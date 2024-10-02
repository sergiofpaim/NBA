using Spectre.Console.Cli;
using System.ComponentModel;

namespace NBA.Commands;

[Description("\n\nSets the repo to sql or ef")]

public class GlobalCommandSettings : CommandSettings
{
    [CommandOption("-r|--repo")]
    public string Repo { get; set; }
}