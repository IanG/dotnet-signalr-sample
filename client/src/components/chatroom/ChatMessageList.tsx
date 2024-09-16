import ChatMessageItem from "./ChatMessageItem.tsx";
import ChatMessage from "../../models/ChatMessage.tsx";

import "./ChatMessageList.css";

interface ChatMessageListProps {
    messages: ChatMessage[];
}

export default function ChatMessageList ({ messages }: ChatMessageListProps){

    return (
        <ul className="chat-message-list">
            {messages.map((message, idx) => (
                <ChatMessageItem key={idx} chatMessage={message} />
            ))}
        </ul>
    );
}