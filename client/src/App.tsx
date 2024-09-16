import { useState } from "react";
import {HubConnection, HubConnectionBuilder, LogLevel} from "@microsoft/signalr";

import ChatMessage from "./models/ChatMessage.tsx";
import ChatUser from "./models/ChatUser.tsx";

import ChatRoom from "./components/chatroom/ChatRoom.tsx";
import Lobby from "./components/lobby/Lobby.tsx";

import "./App.css";

export default function App()
{
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [users, setUsers] = useState<ChatUser[]>([]);
    const [currentUsername, setCurrentUsername] = useState<string>("");

    async function joinChatRoom (userName: string){
        try {
            const connection = new HubConnectionBuilder()
                .withUrl("http://localhost:5076/chat")
                .configureLogging(LogLevel.Information)
                .build();

            connection.on("ReceiveMessage", (message: ChatMessage) => {
                setMessages((messages) => [...messages, message]);
            });

            connection.on("ReceiveConnectedUsers", (users: ChatUser[]) => {
                setUsers(users);
            });

            connection.onclose((error?: Error | null) => {
                if (error) {
                    console.error("Connection closed with error:", error.message);
                } else {
                    console.log("Connection closed.");
                }

                setConnection(null);
                setMessages([]);
                setUsers([]);
            });


            await connection.start();

            const joinedRoom = await connection.invoke("JoinRoom", userName);

            if (joinedRoom)
            {
                setCurrentUsername(userName);
                setConnection(connection);
            }
        } catch (e) {
            console.error(e);
        }
    }

    const sendMessage = async (message: string) => {
        try {
            await connection!.invoke("SendMessage", message);
        } catch (e) {
            console.error(e);
        }
    };

    const closeConnection = async () => {
        try {
            await connection!.stop();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="app">
            {!connection ? (
                <Lobby joinRoom={joinChatRoom} />
            ) : (
                <ChatRoom
                    currentUsername={currentUsername}
                    users={users}
                    messages={messages}
                    sendMessage={sendMessage}
                    closeConnection={closeConnection}
                />
            )}
        </div>
    );
}