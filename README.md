# DotNetSignalRSample

## Introduction

This project is an example of how to use [SignalR](https://learn.microsoft.com/en-us/aspnet/signalr/overview/getting-started/introduction-to-signalr) to perform bi-directional data exchange between a server and multiple clients.

This example is based around the simple concept of an on-line chat room.  Users are able to join and send chat messages to the room.  Equally, when new users join or leave the room the current list of connected users is re-sent to all users.

The repository contains 2 projects:
- **Server** - this project is a .NET webapi project that hosts a `Microsoft.AspNetCore.SignalR.Hub` instance that forms the server-side part of the chat room.
- **client** - A simple React web application that uses `@microsoft/signalr` to interact with the server process.

## The Server.

You can run the server from the repo root directory with:

```
dotnet run n --project ./Server
```

### Logging
All logging currently goes to the console/STDOUT but you can log to file if you need to by adjusting the [Serilog](https://serilog.net/) configuration in `appsettings.json`.

When the server starts you will see it register `json` as the SignalR hub protocol and bind the methods exposed from `ChatHub`.  These method bindings are called from the client.

```
[DBG] [Microsoft.AspNetCore.SignalR.Internal.DefaultHubProtocolResolver] Registered SignalR Protocol: "json", implemented by "Microsoft.AspNetCore.SignalR.Protocol.JsonHubProtocol".
[VRB] [Microsoft.AspNetCore.SignalR.Internal.DefaultHubDispatcher] '"ChatHub"' hub method '"JoinRoom"' is bound.
[VRB] [Microsoft.AspNetCore.SignalR.Internal.DefaultHubDispatcher] '"ChatHub"' hub method '"SendMessage"' is bound.
[VRB] [Microsoft.AspNetCore.SignalR.Internal.DefaultHubDispatcher] '"ChatHub"' hub method '"SendConnectedUsers"' is bound.
```
When users connect you will see log messages like:

```
[DBG] [Microsoft.AspNetCore.SignalR.HubConnectionHandler] OnConnectedAsync started.
[DBG] [Microsoft.AspNetCore.SignalR.Internal.DefaultHubProtocolResolver] Found protocol implementation for requested protocol: "json".
[DBG] [Microsoft.AspNetCore.SignalR.HubConnectionContext] Completed connection handshake. Using HubProtocol '"json"'.
[INF] [DotNetSignalRSample.Server.Hubs.ChatHub] Connection "sqA-xdVsJ1H69_0ioGdnxg" [Connect]
[DBG] [Microsoft.AspNetCore.SignalR.Internal.DefaultHubDispatcher] Received hub invocation: "InvocationMessage { InvocationId: \"0\", Target: \"JoinRoom\", Arguments: [ A ], StreamIds: [  ] }".
[INF] [DotNetSignalRSample.Server.Hubs.ChatHub] Connection "sqA-xdVsJ1H69_0ioGdnxg" [JoinRoom] - User "A" is joining the room
[INF] [DotNetSignalRSample.Server.Hubs.ChatHub] Connection "sqA-xdVsJ1H69_0ioGdnxg" [SendConnectedUsers] - Sending connected user list
[VRB] [Microsoft.AspNetCore.SignalR.Internal.DefaultHubDispatcher] InvocationId "0": Sending result of type '"System.Boolean"'.
```

You will also notice the current list of connected users is transmitted to connected users as part of this phase.

When users send a chat message you will see log messages like:

```
[DBG] [Microsoft.AspNetCore.SignalR.Internal.DefaultHubDispatcher] Received hub invocation: "InvocationMessage { InvocationId: \"1\", Target: \"SendMessage\", Arguments: [ Hello everyone 👋🏻 ], StreamIds: [  ] }".
[INF] [DotNetSignalRSample.Server.Hubs.ChatHub] Connection "u5We0oTJLaVclfbeqsPkKg" [SendMessage] - User "A" sent the message "Hello everyone 👋🏻"
[VRB] [Microsoft.AspNetCore.SignalR.Internal.DefaultHubDispatcher] InvocationId "1": Sending result of type '"System.Void"'.
```

When a user leaves the chat you will see log messages like:

```
[INF] [DotNetSignalRSample.Server.Hubs.ChatHub] Connection "u5We0oTJLaVclfbeqsPkKg" [Disconnect] - - User "A" has left the room
[INF] [DotNetSignalRSample.Server.Hubs.ChatHub] Connection "u5We0oTJLaVclfbeqsPkKg" [SendConnectedUsers] - Sending connected user list
[DBG] [Microsoft.AspNetCore.SignalR.HubConnectionHandler] OnConnectedAsync ending.
```

When this happens the users connection is removed from the list of active connections and the list of connected users is broadcast to all other chat users.

## The Client

You can run the client from the repo root directory with:

```
npm --prefix ./client run dev
```

Then you can point your web browser at http://localhost:5173/ to use the application.