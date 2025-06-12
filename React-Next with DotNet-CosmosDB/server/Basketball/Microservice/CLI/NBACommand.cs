using Spectre.Console;
using Spectre.Console.Cli;

namespace NBA.CLI
{
    public class NBACommand<T> : Command<T> where T : CommandSettings
    {
        public override int Execute(CommandContext context, T settings)
        {
            return 0;
        }

        protected static int PrintResult(string message, int code)
        {
            var color = code == 0 ? "green" : "red";
            AnsiConsole.MarkupLine($"[{color}]{message}[/]");
            return code;
        }
    }
}