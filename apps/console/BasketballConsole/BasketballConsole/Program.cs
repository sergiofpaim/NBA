using NBA.Commands;
using NBA.Repo;
using Spectre.Console;
using Spectre.Console.Cli;

class Program
{
    public static int Main(string[] args)
    {
        ConfigConsole();

        var app = new CommandApp();
        app.Configure(MyConfigurator);

        return app.Run(args);
    }

    private static void ConfigConsole()
    {
        var repoType = AnsiConsole.Prompt(
        new SelectionPrompt<string>()
            .Title("Select the [green]Repo Type[/] (sql/ef):")
            .AddChoices("SQL", "EF")
    );

        switch (repoType)
        {
            case "SQL":
                Basketball.SetRepo(new BasketballSQL());
                AnsiConsole.MarkupLine("[yellow]SQL Repository selected.[/]");
                break;

            case "EF":
                Basketball.SetRepo(new BasketballEF());
                AnsiConsole.MarkupLine("[yellow]EF Repository selected.[/]");
                break;

            default:
                AnsiConsole.MarkupLine("[red]Invalid repo type. Defaulting to SQL.[/]");
                Basketball.SetRepo(new BasketballSQL());
                break;
        }
    }

    private static void MyConfigurator(IConfigurator config)
    {
        config.SetApplicationName("NBA");
        config.ValidateExamples();
        config.AddExample("add", "game");
        config.AddExample("add", "play");

        // Add
        config.AddBranch<CommandSettings>("add", add =>
        {
            add.SetDescription("Add operations");

            add.AddCommand<AddGameCommand>("game")
               .WithDescription("Add a game");

            add.AddCommand<AddPlayCommand>("play")
               .WithDescription("Add a play of a player in a game");
        });

        // List
        config.AddBranch<CommandSettings>("list", list =>
        {
            list.SetDescription("List operations");

            list.AddCommand<ListPlayCommand>("play")
              .WithDescription("Lists all plays of a player in a game");
        });
    }
}