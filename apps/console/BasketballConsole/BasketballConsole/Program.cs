using NBA.Commands;
using Spectre.Console.Cli;

class Program
{
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
        config.AddBranch<AddSettings>("add", add =>
        {
            add.SetDescription("Add a play or a game to the database");
            add.AddCommand<AddPlayCommand>("play");
        });
    }
}