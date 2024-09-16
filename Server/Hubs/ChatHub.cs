using DotNetSignalRSample.Server.Data;
using Microsoft.AspNetCore.SignalR;

namespace DotNetSignalRSample.Server.Hubs;

public class ChatHub : Hub
{
    private readonly ILogger<ChatHub> _logger;

    private static readonly IDictionary<string, ChatUser> ChatConnections = new Dictionary<string, ChatUser>();
    
    public ChatHub(ILogger<ChatHub> logger)
    {
        _logger = logger;
    }
    
    public async Task<bool> JoinRoom(string userName)
    {
        if (!ChatConnections.Values.Any(user => user.Name.Equals(userName, StringComparison.InvariantCultureIgnoreCase)))
        {
            if (_logger.IsEnabled(LogLevel.Information))
            {
                _logger.LogInformation("Connection {connectionId} [JoinRoom] - User {username} is joining the room", Context.ConnectionId, userName); 
            }
            
            ChatConnections[Context.ConnectionId] = new ChatUser { Name = userName };

            ChatMessage chatMessage = new ChatMessage
                { From = "Chat Room", Text = $"User {userName} has joined the room", IsIncoming = true };

            await Clients.All.SendAsync("ReceiveMessage", chatMessage);
        
            await SendConnectedUsers();
            
            return true;
        }

        if (_logger.IsEnabled(LogLevel.Warning))
        {
            _logger.LogWarning("Connection {{connectionId}} [JoinRoom] - The User {userName} already exists", userName);    
        }

        return false;
    }
    
    public async Task SendMessage(string message)
    {
        if (ChatConnections.TryGetValue(Context.ConnectionId, out ChatUser? userConnection))
        {
            if (_logger.IsEnabled(LogLevel.Information))
            {
                _logger.LogInformation("Connection {connectionId} [SendMessage] - User {username} sent the message {message}", Context.ConnectionId, userConnection.Name, message); 
            }
            
            ChatMessage chatMessage = new ChatMessage() { From = userConnection.Name, Text = message, IsIncoming = false };

            await Clients.Caller.SendAsync("ReceiveMessage", chatMessage);

            chatMessage.IsIncoming = true;

            await Clients.AllExcept(Context.ConnectionId).SendAsync("ReceiveMessage", chatMessage);
        }
    }

    public Task SendConnectedUsers()
    {
        if (_logger.IsEnabled(LogLevel.Information))
        {
            _logger.LogInformation("Connection {connectionId} [SendConnectedUsers] - Sending connected user list", Context.ConnectionId);
        }

        return Clients.All.SendAsync("ReceiveConnectedUsers", ChatConnections.Values);
    }

    public override Task OnConnectedAsync()
    {
        if (_logger.IsEnabled(LogLevel.Information))
        {
            _logger.LogInformation("Connection {connectionId} [Connect]", Context.ConnectionId);
        }

        return base.OnConnectedAsync();
    }
    
    public override Task OnDisconnectedAsync(Exception? exception)
    {
        if (ChatConnections.TryGetValue(Context.ConnectionId, out ChatUser? userConnection))
        {
            if (_logger.IsEnabled(LogLevel.Information))
            {
                _logger.LogInformation("Connection {connectionId} [Disconnect] - - User {username} has left the room", Context.ConnectionId, userConnection.Name); 
            }
            
            ChatConnections.Remove(Context.ConnectionId);

            ChatMessage chatMessage = new ChatMessage()
            {
                From = "Chat Room", Text = $"User {userConnection.Name} left the room.", IsIncoming = true
            };

            Clients.All.SendAsync("ReceiveMessage", chatMessage);
            
            SendConnectedUsers();
        }
        
        return base.OnDisconnectedAsync(exception);
    }
}