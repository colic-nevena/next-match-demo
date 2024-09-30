'use server'

import { messageSchema, MessageSchema } from "@/lib/schemas/messageSchema";
import { ActionResult, MessageDto } from "@/types";
import { getAuthUserId } from "./authActions";
import prisma from "@/lib/prisma";
import { mapMessageToMessageDTO } from "@/lib/mappings";
import { pusherServer } from "@/lib/pusher";
import { createChatId } from "@/lib/util";

export async function createMessage(recipientUserId: string, data: MessageSchema): Promise<ActionResult<MessageDto>> {
    try {
        const userId = await getAuthUserId()

        const validated = messageSchema.safeParse(data)

        if (!validated.success) return { status: "error", error: validated.error.errors }

        const { text } = validated.data

        const message = await prisma.message.create({
            data: {
                text,
                recipientId: recipientUserId,
                senderId: userId
            },
            select: messageSelect
        })

        const messageDto = mapMessageToMessageDTO(message)

        await pusherServer.trigger(createChatId(userId, recipientUserId), "message:new", messageDto)
        await pusherServer.trigger(`private-${recipientUserId}`, "message:new", messageDto)

        return { status: "success", data: messageDto }
    } catch (error) {
        console.log(error)
        return { status: "error", error: (error as Error).message }
    }
}

export async function getMessageThread(recipientId: string) {
    try {
        const userId = await getAuthUserId()

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    {
                        senderId: userId,
                        recipientId,
                        senderDeleted: false
                    },
                    {
                        senderId: recipientId,
                        recipientId: userId,
                        recipientDeleted: false
                    }
                ]
            },
            orderBy: {
                createdAt: 'asc'
            },
            select: messageSelect
        });

        let readCount = 0;

        if (messages.length > 0) {
            const readMessageIds = messages
                .filter(message => message.dateRead === null
                    && message.recipient?.userId === userId
                    && message.sender?.userId === recipientId)
                .map(message => message.id)

            await prisma.message.updateMany({
                where: {
                    id: { in: readMessageIds }
                },
                data: {
                    dateRead: new Date()
                }
            })

            readCount = readMessageIds.length

            await pusherServer.trigger(createChatId(recipientId, userId), "messages:read", readMessageIds)
        }

        const messagesToReturn = messages.map(msg => mapMessageToMessageDTO(msg))

        return { messages: messagesToReturn, readCount }
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getMessagesByContainer(container?: string | null, cursor?: string, limit = 10) { // check out cursor pagination algorithm
    try {
        const userId = await getAuthUserId()

        const conditions = {
            [container === "outbox" ? "senderId" : "recipientId"]: userId,
            ...(container === "outbox" ? { senderDeleted: false } : { recipientDeleted: false })
        }

        const messages = await prisma.message.findMany({
            where: {
                ...conditions,
                ...(cursor ? { createdAt: { lte: new Date(cursor) } } : {}) // everything up until the cursor
            },
            select: messageSelect,
            take: limit + 1, // +1 will be the start of the next batch, cursor
            orderBy: {
                createdAt: "desc"
            }
        })

        let nextCursor: string | undefined;
        if (messages.length > limit) {
            const nextItem = messages.pop() // taking the +1 message
            nextCursor = nextItem?.createdAt.toISOString()
        } else {
            nextCursor = undefined
        }

        const messagesToReturn = messages.map(msg => mapMessageToMessageDTO(msg))

        return {
            messages: messagesToReturn,
            nextCursor
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function deleteMessage(messageId: string, isOutbox: boolean) {
    try {
        const userId = await getAuthUserId()
        const selector = isOutbox ? "senderDeleted" : "recipientDeleted"

        await prisma.message.update({
            where: {
                id: messageId
            },
            data: {
                [selector]: true
            }
        })

        const messagesToDelete = await prisma.message.findMany({
            where: {
                OR: [
                    {
                        senderId: userId,
                        senderDeleted: true,
                        recipientDeleted: true
                    },
                    {
                        recipientId: userId,
                        senderDeleted: true,
                        recipientDeleted: true
                    }
                ]
            }
        })

        if (messagesToDelete.length > 0) {
            await prisma.message.deleteMany({
                where: {
                    OR: messagesToDelete.map(m => ({ id: m.id }))
                }
            })
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getUnreadMessagesCount() {
    try {
        const userId = await getAuthUserId()

        return prisma.message.count({
            where: {
                recipientId: userId,
                dateRead: null,
                recipientDeleted: false
            }
        })
    } catch (error) {
        console.log(error)
        throw error
    }
}

const messageSelect = {
    id: true,
    text: true,
    createdAt: true,
    dateRead: true,
    sender: {
        select: {
            userId: true,
            name: true,
            image: true
        }
    },
    recipient: {
        select: {
            userId: true,
            name: true,
            image: true
        }
    }
}