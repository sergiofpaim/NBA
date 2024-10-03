using NBA.CLI;
using NBA.Repo;
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
        Basketball.SetRepo(new CosmosDBRepo());
    }

    private static void MyConfigurator(IConfigurator config)
    {
        config.SetApplicationName("NBA");

        config.AddExample(["add", "play", "-g", "31", "-q", "1", "-p", "131"]);
        config.AddExample(["add", "game", "-o", "CHI", "-v", "LAL", "-a", "2024-08-01T19:30:00"]);
        config.AddExample(["list", "play", "-g", "31", "-q", "1", "-p", "131"]);

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

        // Utils
        config.AddBranch<CommandSettings>("utils", utils =>
        {
            utils.SetDescription("Utils operations");

            utils.AddCommand<ReseedCommand>("reseed")
              .WithDescription("Reseeds the repository");
        });
    }
}