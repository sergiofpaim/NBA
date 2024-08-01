using NBA.Commands;
using NBA.Interfaces;
using NBA.Models;
using NBA.Repo;
using Spectre.Console;
using Spectre.Console.Cli;
using System.Collections.Generic;

class Program
{
    public static int Main(string[] args)
    {
        ConfigRepo([.. args]);

        var app = new CommandApp();
        app.Configure(MyConfigurator);

        return app.Run(args);
    }

    private static void ConfigRepo(List<string> args)
    {
        AnsiConsole.MarkupLine("[bold]Note:[/] You have to set the repository type using the `-r` or `--repo` options followed by `sql` or `ef`\n");

        var repoOption = args
            .FirstOrDefault(a => a.Equals("-r", StringComparison.CurrentCultureIgnoreCase) ||
                                 a.Equals("--repo", StringComparison.CurrentCultureIgnoreCase));

        if (repoOption is not null)
        {
            var repoIndex = args.IndexOf(repoOption);
            if (repoIndex >= 0 && repoIndex < args.Count - 1)
            {
                var repo = args[repoIndex + 1].ToLower();

                IBasketballRepo? selectedRepo = repo switch
                {
                    "sql" => new BasketballSQL(),
                    "ef" => new BasketballEF(),
                    _ => null
                };

                if (selectedRepo is not null)
                {
                    Basketball.SetRepo(selectedRepo);
                    AnsiConsole.MarkupLine($"[yellow]{repo.ToUpper()} Repository selected.[/]\n");
                }
                else
                {
                    AnsiConsole.MarkupLine("[red]Invalid repo type. Defaulting to SQL.[/]\n");
                    Basketball.SetRepo(new BasketballSQL());
                }
            }
        }
    }

    private static void MyConfigurator(IConfigurator config)
    {
        config.SetApplicationName("NBA");

        config.AddExample(["add", "play", "-g", "31", "-q", "1", "-p", "131", "--repo", "sql"]);
        config.AddExample(["add", "game", "-o", "CHI", "-v", "LAL", "-a", "2024-08-01T19:30:00", "--repo", "ef"]);
        config.AddExample(["list", "play", "-g", "31", "-q", "1", "-p", "131", "-r", "sql"]);

        // Add
        config.AddBranch<GlobalCommandSettings>("add", add =>
        {
            add.SetDescription("Add operations");

            add.AddCommand<AddGameCommand>("game")
               .WithDescription("Add a game");

            add.AddCommand<AddPlayCommand>("play")
               .WithDescription("Add a play of a player in a game");
        });

        // List
        config.AddBranch<GlobalCommandSettings>("list", list =>
        {
            list.SetDescription("List operations");

            list.AddCommand<ListPlayCommand>("play")
              .WithDescription("Lists all plays of a player in a game");
        });
    }
}