using Spectre.Console.Cli;
using System.ComponentModel;

public abstract class AddSettings : CommandSettings
{
    [CommandOption("-g|--game <GAMEID>")]
    [Description("The game Id")]
    public int GameId { get; set; }

    [CommandOption("-q|--quarter <QUARTER>")]
    [Description("The quarter of the play")]
    public int Quarter { get; set; }

    [CommandOption("-p|--player <PLAYERID>")]
    [Description("The id of the player")]
    public int PlayerId { get; set; }

    [CommandOption("-t|--type <TYPE>")]
    [Description("The type of play")]
    public string Type { get; set; }
}