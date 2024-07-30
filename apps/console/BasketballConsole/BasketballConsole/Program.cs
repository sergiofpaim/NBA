using NBA.Commands;
using NBA.Repo;
using Spectre.Console.Cli;

class Program
{
    private static bool RepoSql = true;

    public static int Main(string[] args)
    {
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

        //List
        config.AddBranch<CommandSettings>("list", select =>
        {
            select.SetDescription("List operations");

            select.AddCommand<ListPlayCommand>("play")
              .WithDescription("Lists all plays of a player in a game");
        });

        if (RepoSql)
        {
            BasketballSQL.Initialize();
            Basketball.SetRepo(new BasketballSQL());
        }
        else
            Basketball.SetRepo(new BasketballEF());
    }
}