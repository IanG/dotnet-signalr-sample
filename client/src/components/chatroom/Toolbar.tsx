import {Button, Col, Dropdown, OverlayTrigger, Tooltip, TooltipProps} from "react-bootstrap";

import ChatUser from "../../models/ChatUser.tsx";
import {OverlayDelay} from "react-bootstrap/OverlayTrigger";

interface ToolbarProps {
    currentUsername: string;
    users: ChatUser[];
    closeConnection: () => void;
}

export default function Toolbar ({ currentUsername, users, closeConnection } : ToolbarProps)
{
    const defaultOverLayDelay : OverlayDelay = {
        show: 100,
        hide: 50
    }

    const renderShowConnectedUsersTooltip = (props: TooltipProps) => (
        <Tooltip id="chat-users-tooltip" {...props}>Show Chat Users</Tooltip>
    )

    const renderExitChatroomTooltip = (props: TooltipProps) => (
        <Tooltip id="exit-chatroom-tooltip" {...props}>Exit the chat room</Tooltip>
    )

    return (
        <Col className="d-flex justify-content-between align-items-center">
            <Col>
                <span>Chatting as <span>{currentUsername}</span> with { users.length > 1 ? users.length -1 : 0 } other users</span>
            </Col>

            <OverlayTrigger placement="bottom" delay={defaultOverLayDelay} overlay={renderShowConnectedUsersTooltip}>
                <Dropdown>
                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                        <i className="bi bi-people"></i>&nbsp;Connected Users ({users.length})
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {users.map((user, index) => (
                            <Dropdown.Item key={index} as="div" title={"Joined at " + user.joinedAt}>
                                <i className="bi bi-person"></i>&nbsp;{user.name}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" delay={defaultOverLayDelay} overlay={renderExitChatroomTooltip}>
                <Button style={{ marginLeft: "10px"}} onClick={closeConnection}>X</Button>
            </OverlayTrigger>
        </Col>
    );
}