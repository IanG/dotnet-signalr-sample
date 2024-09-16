import React, { useState } from "react";
import {Button, Form} from "react-bootstrap";

interface SendMessageProps {
    sendMessage: (message: string) => void;
}

export default function SendMessagePanel({ sendMessage }: SendMessageProps) {
    const [message, setMessage] = useState<string>("");

    function onMessageChangeHandler(e: React.ChangeEvent<HTMLInputElement>)
    {
        setMessage(e.target.value);
    }

    function onSubmitHandler(e: React.FormEvent<HTMLFormElement>)
    {
        e.preventDefault();
        sendMessage(message);
        setMessage("");
    }

    return (
        <Form onSubmit={onSubmitHandler}>
            <Form.Group className="d-flex w-100" >
                <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Type a message..."
                    style={{ flex: 1, marginRight: '10px', resize: 'none' }}
                    onChange={onMessageChangeHandler}
                    value={message}
                />
                <Button variant="primary" type="submit" disabled={!message}>Send</Button>
            </Form.Group>
        </Form>
    );
}