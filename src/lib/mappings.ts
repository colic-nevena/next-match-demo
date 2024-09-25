import { formatShortDateTime } from './util';
import { MessageWithSenderRecipient } from '@/types';

export function mapMessageToMessageDTO(message: MessageWithSenderRecipient) {
    return {
        id: message.id,
        text: message.text,
        createdAt: formatShortDateTime(message.createdAt),
        dateRead: message.dateRead ? formatShortDateTime(message.dateRead) : null,
        senderId: message.sender?.userId,
        senderName: message.sender?.name,
        senderImage: message.sender?.image,
        recipientId: message.recipient?.userId,
        recipientImage: message.recipient?.image,
        recipientName: message.recipient?.name
    }
}