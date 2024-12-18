using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Spectre.Console.Cli;
using System.Net;
using System.Net.Sockets;

namespace NBA.CLI;

public class StartAPICommand : NBACommand<EmptyCommandSettings>
{
    public override int Execute(CommandContext context, EmptyCommandSettings settings)
    {
        var builder = WebApplication.CreateBuilder([]);

        builder.Services.AddControllers();

        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        var firstNetworkIp = GetFirstNetworkIp();

        builder.WebHost.ConfigureKestrel(options =>
        {
            if (firstNetworkIp is not null)
                options.Listen(IPAddress.Parse(firstNetworkIp), 5000); 

            options.Listen(IPAddress.Loopback, 5000);
        });

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }
        else
        {
            app.UseExceptionHandler("/Home/Error");
        }

        app.UseHttpsRedirection();
        app.UseAuthorization();
        app.MapControllers();

        app.UseCors(policy => policy.AllowAnyOrigin()
                                    .AllowAnyMethod()
                                    .AllowAnyHeader());

        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "NBA V1");
            c.RoutePrefix = string.Empty;
        });

        app.Run();

        return 0;

    }

    string GetFirstNetworkIp()
    {
        var host = Dns.GetHostEntry(Dns.GetHostName());
        foreach (var ip in host.AddressList)
        {
            if (ip.AddressFamily == AddressFamily.InterNetwork && !IPAddress.IsLoopback(ip))
            {
                return ip.ToString();
            }
        }
        return null;
    }
}