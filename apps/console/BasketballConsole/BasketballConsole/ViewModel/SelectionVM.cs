using NBA.Models.SQL;
using NBA.Models.CosmosDB;

namespace NBA.ViewModels;

public class SelectionVM
{
    //SQL
    public int Id { get; set; }
    public int? PlayerId { get; set; }
    public string SeasonId { get; set; }
    public string TeamId { get; set; }
    public int? Jersey { get; set; }
    public virtual ICollection<Models.SQL.Participation> Participations { get; set; } = [];
    public virtual Models.SQL.Player Player { get; set; }
    public virtual Scalation Scalation { get; set; }

    // Cosmos
    public string CosmosPlayerId { get; set; }
    public string PlayerName { get; set; }

    public void MapTo<T>(T s)
    {
        if (s is SelectionVM sqlSelection)
        {
            sqlSelection.PlayerId = PlayerId;
            sqlSelection.SeasonId = SeasonId;
            sqlSelection.TeamId = TeamId;
            sqlSelection.Jersey = Jersey;
            sqlSelection.Participations = Participations;
            sqlSelection.Player = Player;
            sqlSelection.Scalation = Scalation;
        }
        else if (s is PlayerSelection cosmosSelection)
        {
            cosmosSelection.PlayerId = CosmosPlayerId;
            cosmosSelection.PlayerName = PlayerName;
            cosmosSelection.Jersey = Jersey.GetValueOrDefault();
        }
    }

    public static SelectionVM FactoryFrom<T>(T s)
    {
        if (s is Selection sqlSelection)
        {
            return new SelectionVM
            {
                Id = sqlSelection.Id,
                PlayerId = sqlSelection.PlayerId,
                SeasonId = sqlSelection.SeasonId,
                TeamId = sqlSelection.TeamId,
                Jersey = sqlSelection.Jersey,
                Participations = sqlSelection.Participations,
                Player = sqlSelection.Player,
                Scalation = sqlSelection.Scalation
            };
        }
        else if (s is PlayerSelection cosmosSelection)
        {
            return new SelectionVM
            {
                CosmosPlayerId = cosmosSelection.PlayerId,
                PlayerName = cosmosSelection.PlayerName,
                Jersey = cosmosSelection.Jersey
            };
        }

        throw new ArgumentException("Unsupported type", nameof(s));
    }
}