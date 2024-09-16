namespace DotNetSignalRSample.Server.Data;

public class ChatMessage
{
    public string? From { get; init; }
    public string? Text { get; init; }
    public DateTime SentAt { get; } = DateTime.Now;
    public bool IsIncoming { get; set; }
}