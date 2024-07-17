using NBA.Commands;
using NBA.Repo;
using Spectre.Console.Cli;
using System.Data.SqlClient;

class Program
{
    public static int Main(string[] args)
    {
        var app = new CommandApp();
        app.Configure(MyConfigurator);

        BasketballRepo.Initialize();

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
               .WithDescription("Add a game to the database");

            add.AddCommand<AddPlayCommand>("play")
               .WithDescription("Add a play to the database");
        });
    }
}