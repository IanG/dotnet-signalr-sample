using DotNetSignalRSample.Server.Hubs;
using Microsoft.AspNetCore.Authorization;
using Serilog;
using Serilog.Core;

var builder = WebApplication.CreateBuilder(args);

// Set up Logging with SeriLog
Logger logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .CreateLogger();

builder.Services.AddSerilog(logger);

// Add SignalR
builder.Services.AddSignalR();

// Allow connections from anywhere (for now)
builder.Services.AddCors(options =>
{
    options.AddPolicy("MyChatRoomPolicy",
        builder =>
        {
            builder.WithOrigins("http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .SetIsOriginAllowed((x) => true)
                .AllowCredentials();
        });
});

builder.Services.AddRouting(options =>
{
    options.LowercaseUrls = true;
    options.LowercaseQueryStrings = true;
});

var app = builder.Build();

app.UseRouting();
app.UseCors("MyChatRoomPolicy");

app.MapHub<ChatHub>("/chat");

app.Run();