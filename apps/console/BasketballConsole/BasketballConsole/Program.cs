using NBA.Commands;
using NBA.Repo;
using Spectre.Console.Cli;
using System.Diagnostics.CodeAnalysis;

class Program
{
    public static int Main(string[] args)
    {
        Console.WriteLine("Type the Repo type (sql/ef):");
        string repoType = Console.ReadLine()?.Trim().ToLower();

        if (repoType == "sql")
            Basketball.SetRepo(new BasketballSQL());

        else if (repoType == "ef")
            Basketball.SetRepo(new BasketballEF());
        else
            Console.WriteLine("Invalid repo type. Defaulting to SQL.");

        var app = new CommandApp();
        app.Configure(MyConfigurator);

        return app.Run(args);
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