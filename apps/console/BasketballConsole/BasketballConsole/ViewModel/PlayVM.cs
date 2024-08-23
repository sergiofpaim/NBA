using NBA.Models.SQL;
using NBA.Models.CosmosDB;

namespace NBA.ViewModels;

public class PlayVM
{
    //SQL
    public int Id { get; set; }
    public int? ParticipationId { get; set; }
    public string Type { get; set; }
    public int? Points { get; set; }
    public TimeSpan? At { get; set; }

    // Cosmos
    public int CosmosId { get; set; }
    public int Quarter { get; set; }

    public void MapTo<T>(T p)
    {
        if (p is PlayVM sqlPlay)
        {
            sqlPlay.ParticipationId = ParticipationId;
            sqlPlay.Type = Type;
            sqlPlay.Points = Points;
            sqlPlay.At = At;
        }
        else if (p is GamePlay cosmosPlay)
        {
            cosmosPlay.Quarter = Quarter;
            cosmosPlay.Type = Type;
            cosmosPlay.Points = Points;
            cosmosPlay.At = At.GetValueOrDefault();
        }
    }

    public static PlayVM FactoryFrom<T>(T p)
    {
        if (p is Play sqlPlay)
        {
            return new PlayVM
            {
                Id = sqlPlay.Id,
                ParticipationId = sqlPlay.ParticipationId,
                Type = sqlPlay.Type,
                Points = sqlPlay.Points,
                At = sqlPlay.At
            };
        }
        else if (p is GamePlay cosmosPlay)
        {
            return new PlayVM
            {
                Quarter = cosmosPlay.Quarter,
                Type = cosmosPlay.Type,
                Points = cosmosPlay.Points,
                At = cosmosPlay.At
            };
        }

        throw new ArgumentException("Unsupported type", nameof(p));
    }
}