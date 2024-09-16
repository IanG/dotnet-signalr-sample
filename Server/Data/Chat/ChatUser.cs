namespace DotNetSignalRSample.Server.Data;

public class ChatUser
{
    public string? Name { get; init; }
    public DateTime JoinedAt { get; } = DateTime.Now;
}