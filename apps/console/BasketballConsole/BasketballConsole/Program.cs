using NBA.Commands;
using Spectre.Console.Cli;
using System.Data.SqlClient;

class Program
{
    static public string serverName = "NOTE-SFP";
    static public string databaseName = "Basketball";
    static public string connectionString = $"Data Source={serverName};Initial Catalog={databaseName};Integrated Security=True";

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
        config.AddExample("add");

        // Add
        config.AddBranch<CommandSettings> ("add", add =>
        {
            add.SetDescription("Add a game to the database");
            add.AddCommand<AddGameCommand>("game");

            add.SetDescription("Add a play to the database");
            add.AddCommand<AddPlayCommand>("play"); 
        });
    }
}