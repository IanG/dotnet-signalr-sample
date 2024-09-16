import React, { useState } from "react";
import {Button, Container, Form} from "react-bootstrap";

import "./Lobby.css";

interface LobbyProps {
    joinRoom: (userName: string) => void;
}

export default function Lobby({ joinRoom }: LobbyProps)
{
    const [userName, setUserName] = useState("");

    function onKeyDownHandler( e: React.KeyboardEvent<HTMLInputElement>){
        if (e.code === "Space") e.preventDefault();
    }

    function onChangeHandler (e: React.ChangeEvent<HTMLInputElement>){
        setUserName(e.target.value);
    }

    function onSubmitHandler(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        joinRoom(userName);
    }

    function onPasteHandler(e: React.ClipboardEvent<HTMLInputElement>) {
        const pasteData = e.clipboardData.getData('text');
        const newValue = pasteData.replace(/\s+/g, '');

        e.preventDefault();
        setUserName((prev) => prev + newValue);
    }

    return (
        <Container fluid className="vh-100 d-flex flex-column">
            <Form onSubmit={onSubmitHandler} className="lobby">
                <Form.Group>
                    <Form.Label column="sm">
                        <h1>SignalR Chat Room</h1>
                    </Form.Label>
                </Form.Group>
                <Form.Group controlId="formUserName">
                    <Form.Label className="text-center" column="lg" style={{width: "100%"}}>Your Username</Form.Label>
                    <Form.Control type="text" onChange={onChangeHandler} onKeyDown={onKeyDownHandler} onPaste={onPasteHandler} minLength={1} maxLength={25} placeholder="Enter Your Username"/>
                    <Form.Text className="text-muted">Be nice, don't use rude names</Form.Text>
                </Form.Group>
                <Form.Group>
                    <div className="text-center" style={{ marginTop: "20px"}}>
                        <Button type="submit" disabled={!userName}>Join the Chat</Button>
                    </div>
                </Form.Group>
            </Form>
        </Container>
    );
}