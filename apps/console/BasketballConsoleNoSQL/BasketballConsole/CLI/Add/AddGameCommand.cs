using NBA.Services;
using Spectre.Console.Cli;
using System.ComponentModel;

namespace NBA.CLI;

[Description("\n\nAdds a game to the data base")]

public class AddGameCommand : NBACommand<AddGameCommand.GameParms>
{
    public sealed class GameParms : CommandSettings
    {
        [CommandOption("-o|--home <HOMETEAMIID>")]
        [Description("The id of the home team")]
        public string HomeTeamId { get; set; }

        [CommandOption("-v|--visitor <VISITORSTEAMID>")]
        [Description("The id of the visitor team")]
        public string VisitorTeamId { get; set; }

        [CommandOption("-a|--at <AT>")]
        [Description("The date of the game")]
        public DateTime At { get; set; }
    }

    public override int Execute(CommandContext context, GameParms settings)
    {
        var result = NBAService.AddGameAsync(settings.HomeTeamId, settings.VisitorTeamId, settings.At).Result;
        return PrintResult(result.Message, result.Code);
    }
}