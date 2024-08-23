using NBA.Models.SQL;

namespace NBA.ViewModels;

public class PlayerVM
{
    //SQL
    public int Id { get; set; }
    public string Name { get; set; }
    public DateOnly? BornOn { get; set; }
    public string Position { get; set; }
    public virtual ICollection<Selection> Selections { get; set; } = [];

    // Cosmos
    public string CosmosId { get; set; }

    public void MapTo<T>(T p)
    {
        if (p is PlayerVM sqlPlayer)
        {
            sqlPlayer.Id = Id;
            sqlPlayer.Name = Name;
            sqlPlayer.BornOn = BornOn;
            sqlPlayer.Position = Position;
            sqlPlayer.Selections = Selections;
        }
        else if (p is NBA.Models.CosmosDB.Player cosmosPlayer)
        {
            cosmosPlayer.Id = CosmosId;
            cosmosPlayer.Name = Name;
            cosmosPlayer.BornOn = BornOn;
            cosmosPlayer.Position = Position;
        }
    }

    public static PlayerVM FactoryFrom<T>(T p)
    {
        if (p is NBA.Models.SQL.Player sqlPlayer)
        {
            return new PlayerVM
            {
                Id = sqlPlayer.Id,
                Name = sqlPlayer.Name,
                BornOn = sqlPlayer.BornOn,
                Position = sqlPlayer.Position,
                Selections = sqlPlayer.Selections
            };
        }
        else if (p is NBA.Models.CosmosDB.Player cosmosPlayer)
        {
            return new PlayerVM
            {
                CosmosId = cosmosPlayer.Id,
                Name = cosmosPlayer.Name,
                BornOn = cosmosPlayer.BornOn,
                Position = cosmosPlayer.Position
            };
        }

        throw new ArgumentException("Unsupported type", nameof(p));
    }
}