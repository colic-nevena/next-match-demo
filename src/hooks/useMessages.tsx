import { deleteMessage } from "@/app/actions/messageActions"
import { MessageDto } from "@/types"
import { useSearchParams, useRouter } from "next/navigation"
import { useState, useCallback, Key, useEffect } from "react"
import useMessageStore from "./useMessageStore"

export const useMessages = (initialMessages: MessageDto[]) => {
    const { set, messages, remove, updateUnreadCount } = useMessageStore(state => ({
        set: state.set,
        messages: state.messages,
        remove: state.remove,
        updateUnreadCount: state.updateUnreadCount
    }))

    const searchParams = useSearchParams()
    const router = useRouter()
    const isOutbox = searchParams.get("container") === "outbox"
    const [isDeleting, setDeleting] = useState({ id: "", loading: false })

    useEffect(() => {
        set(initialMessages)

        return () => {
            set([])
        }
    }, [initialMessages, set])

    const columns = [
        { key: isOutbox ? "recipientName" : "senderName", label: isOutbox ? "Recipient" : "Sender" },
        { key: "text", label: "Message" },
        { key: "createdAt", label: isOutbox ? "Date sent:" : "Date received:" },
        { key: "actions", label: "Actions" }
    ]

    const handleDeleteMessage = useCallback(async (message: MessageDto) => {
        setDeleting({ id: message.id, loading: true })

        await deleteMessage(message.id, isOutbox)
        remove(message.id)

        if (!message.dateRead && !isOutbox) updateUnreadCount(-1)

        setDeleting({ id: "", loading: false })
    }, [isOutbox, remove, updateUnreadCount])

    const handleRowSelect = (key: Key) => {
        const message = messages.find(m => m.id === key)
        const url = isOutbox ? `/members/${message?.recipientId}` : `/members/${message?.senderId}`
        router.push(url + "/chat")
    }

    return {
        isOutbox,
        columns,
        isDeleting,
        deleteMessage: handleDeleteMessage,
        selectRow: handleRowSelect,
        messages
    }
}