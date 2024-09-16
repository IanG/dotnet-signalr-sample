import { useEffect, useRef } from "react";
import { Col, Container, Row } from "react-bootstrap";

import ChatMessage from "../../models/ChatMessage.tsx";
import ChatUser from "../../models/ChatUser.tsx";

import Toolbar from "./Toolbar.tsx";
import ChatMessageList from "./ChatMessageList.tsx";
import SendMessagePanel from "./SendMessagePanel.tsx";

import "./ChatRoom.css";

interface ChatRoomProps {
    currentUsername: string
    users: ChatUser[];
    messages: ChatMessage[];
    sendMessage: (message: string) => void;
    closeConnection: () => void;
}

export default function ChatRoom({ currentUsername, messages, sendMessage, closeConnection, users, }: ChatRoomProps)
{
    const messageListContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messageListContainerRef && messageListContainerRef.current) {
            const { scrollHeight, clientHeight } = messageListContainerRef.current;
            messageListContainerRef.current.scrollTo({
                left: 0,
                top: scrollHeight - clientHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    return (

        <Container fluid className="d-flex flex-column vh-100" style={{ padding: 0 }}>
            <Row
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "lightgray",
                    color: 'black',
                    padding: '10px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    zIndex: 1,
                }}
            >
                <Toolbar currentUsername={currentUsername} users={users} closeConnection={closeConnection} />
            </Row>

            <Row
                className="flex-grow-1"
                style={{
                    marginTop: '60px',
                    marginBottom: '50px',
                    padding: 0,
                    overflowY: 'auto',
                }}
            >
                <Col style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 60px)', }}>
                    <div className="chat-message-list-container" ref={messageListContainerRef}>
                        <ChatMessageList messages={messages}/>
                    </div>
                </Col>
            </Row>
            <Row
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'lightgray',
                    borderTop: '1px solid #ddd',
                    padding: '10px',
                    zIndex: 1,
                }}
            >
                <Col>
                    <SendMessagePanel sendMessage={sendMessage} />
                </Col>
            </Row>
        </Container>
    );
}