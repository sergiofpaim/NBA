using NBA.Commands;
using NBA.Repo;
using Spectre.Console;
using Spectre.Console.Cli;

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
        var repoIndex = args.IndexOf(args.FirstOrDefault(a => a.Equals("-r", StringComparison.CurrentCultureIgnoreCase) ||
                                                              a.Equals("--repo", StringComparison.CurrentCultureIgnoreCase)) ?? "");

        if (repoIndex > 0 && repoIndex < args.Count)
        {
            var repo = args[repoIndex + 1].ToLower();

            switch (repo)
            {
                case "sql":
                    Basketball.SetRepo(new BasketballSQL());
                    AnsiConsole.MarkupLine("[yellow]SQL Repository selected.[/]");
                    break;

                case "ef":
                    Basketball.SetRepo(new BasketballEF());
                    AnsiConsole.MarkupLine("[yellow]EF Repository selected.[/]");
                    break;

                default:
                    AnsiConsole.MarkupLine("[red]Invalid repo type. Defaulting to SQL.[/]");
                    Basketball.SetRepo(new BasketballSQL());
                    break;
            }
        }
    }

    private static void MyConfigurator(IConfigurator config)
    {
        config.SetApplicationName("NBA");
        config.ValidateExamples();
        config.AddExample("add", "play", "-g", "31", "-q", "1", "-p", "131");

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