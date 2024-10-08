using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Spectre.Console.Cli;
using System.Diagnostics;

namespace NBA.CLI;

public class StartAPICommand : NBACommand<EmptyCommandSettings>
{
    public override int Execute(CommandContext context, EmptyCommandSettings settings)
    {
        var builder = WebApplication.CreateBuilder([]);

        builder.Services.AddControllers();

        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

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

        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "NBA V1");
            c.RoutePrefix = string.Empty;
        });

        var url = "http://localhost:5000/index.html";
        Process.Start(new ProcessStartInfo
        {
            FileName = url,
            UseShellExecute = true
        });

        app.Run();

        return 0;
    }
}