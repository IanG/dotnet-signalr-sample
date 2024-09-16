import ChatMessage from "../../models/ChatMessage.tsx";

import "./ChatMessageItem.css";

interface ChatMessageItemProps {
    chatMessage: ChatMessage;
}

export default function ChatMessageItem({ chatMessage }: ChatMessageItemProps) {
    return (
        <li
            className={
                chatMessage.isIncoming ? "chat-message-item chat-message-item-user-message" : "chat-message-item"
            }
        >
            <div className="chat-message">
                <div className="from"><i className="bi bi-person"/>&nbsp;{chatMessage.from}</div>
                <div className="text">{chatMessage.text}</div>
                <div className="sent-at">{chatMessage.sentAt}</div>
            </div>
        </li>
    );
}