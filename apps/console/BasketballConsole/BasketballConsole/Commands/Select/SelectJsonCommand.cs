using NBA.Models.CosmosDB;
using NBA.Models.Type;
using NBA.Repo.CosmosDB;
using Newtonsoft.Json;
using Spectre.Console.Cli;
using System.ComponentModel;

namespace NBA.Commands
{
    public class SelectJsonCommand : Command<SelectJsonCommand.SelectParms>
    {
        public class SelectParms : CommandSettings
        {
            [CommandOption("-i|--id <ID>")]
            [Description("The id of the player")]
            public string Id { get; set; }

            [CommandOption("-n|--name <NAME>")]
            [Description("The name of the player")]
            public string Name { get; set; }
        }

        public override int Execute(CommandContext context, SelectParms settings)
        {
            Participation part = new();
            part.Plays.Insert(0, new() { At = new(2000), Type = PlayType.FreeThrowHit.ToString() });

            var player = BasketballCosmos.GetAsync(settings.Id, settings.Name).Result;

            if (player is null)
                Console.WriteLine("No items found.");
            else
            {
                string jsonString = JsonConvert.SerializeObject(player, Formatting.Indented);
                Console.WriteLine(jsonString);
            }
            return 0;
        }
    }
}