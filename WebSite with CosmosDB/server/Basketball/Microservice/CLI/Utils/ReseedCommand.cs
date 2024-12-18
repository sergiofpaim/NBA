using NBA.Services;
using Spectre.Console.Cli;

namespace NBA.CLI;

public class ReseedCommand : NBACommand<EmptyCommandSettings>
{
    public override int Execute(CommandContext context, EmptyCommandSettings settings)
    {
        PrintResult("Reseed started", 0);
        var result = TransactionService.Reseed();
        PrintResult(result.Message, result.Code);

        return result.Code;
    }
}