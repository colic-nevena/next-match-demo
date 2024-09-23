'use server'

import prisma from "@/lib/prisma"
import { getAuthUserId } from "./authActions"

export async function toggleLikeMember(targetUserId: string, isLiked: boolean) {
    try {
        const userId = await getAuthUserId()

        if (isLiked) {
            await prisma.like.delete({
                where: {
                    sourceUserId_targetUserId: {
                        sourceUserId: userId, targetUserId
                    }
                }
            })
        } else {
            await prisma.like.create({
                data: {
                    sourceUserId: userId,
                    targetUserId
                }
            })
        }
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export async function fetchCurrentUserLikeIds() {
    try {
        const userId = await getAuthUserId()

        const likeIds = await prisma.like.findMany({
            where: {
                sourceUserId: userId
            },
            select: {
                targetUserId: true
            }
        })

        return likeIds.map(like => like.targetUserId)
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export async function getLikedMembers(type = 'source') {
    try {
        const userId = await getAuthUserId()

        switch (type) {
            case 'source':
                return await getSourceLikes(userId)

            case 'target':
                return await getTargetLikes(userId)

            case 'mutual':
                return await getMutualLikes(userId)

            default:
                return []
        }
    } catch (error) {
        console.log(error)
        throw error;
    }
}

async function getSourceLikes(userId: string) {
    try {
        const sourceLikes = await prisma.like.findMany({
            where: { sourceUserId: userId },
            select: { targetMember: true }
        })

        return sourceLikes.map(x => x.targetMember)
    } catch (error) {
        console.log(error)
    }
}


async function getTargetLikes(userId: string) {
    try {
        const targetLikes = await prisma.like.findMany({
            where: { targetUserId: userId },
            select: { sourceMember: true }
        })

        return targetLikes.map(x => x.sourceMember)
    } catch (error) {
        console.log(error)
    }
}


async function getMutualLikes(userId: string) {
    try {
        // those who I liked
        const likedUsers = await prisma.like.findMany({
            where: { sourceUserId: userId },
            select: { targetUserId: true }
        })

        const likedIds = likedUsers.map(x => x.targetUserId)

        // among those who I liked, find those who liked me back, where I am the target user
        const mutualLikes = await prisma.like.findMany({
            where: {
                AND: [
                    { targetUserId: userId },
                    { sourceUserId: { in: likedIds } }
                ]
            },
            select: { sourceMember: true }
        })

        return mutualLikes.map(x => x.sourceMember)
    } catch (error) {
        console.log(error)
    }
}
