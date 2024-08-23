using NBA.Models.SQL;

namespace NBA.ViewModels;

public class GameVM
{
    //SQL
    public int Id { get; set; }
    public string SeasonId { get; set; }
    public string HomeTeamId { get; set; }
    public string VisitorTeamId { get; set; }
    public DateTime At { get; set; }
    public virtual ICollection<Models.SQL.Participation> Participations { get; set; } = [];
    public virtual Scalation Scalation { get; set; }
    public virtual Scalation ScalationNavigation { get; set; }

    // Cosmos
    public string CosmosId { get; set; }
    public string HomeTeamName { get; set; }
    public List<string> HomePlayerIds { get; set; } = [];
    public string VisitorTeamName { get; set; }
    public List<string> VisitorPlayerIds { get; set; } = [];

    public void MapTo<T>(T g)
    {
        if (g is GameVM sqlGame)
        {
            sqlGame.Id = Id;
            sqlGame.SeasonId = SeasonId;
            sqlGame.HomeTeamId = HomeTeamId;
            sqlGame.VisitorTeamId = VisitorTeamId;
            sqlGame.At = At;
            sqlGame.Participations = Participations;
            sqlGame.Scalation = Scalation;
            sqlGame.ScalationNavigation = ScalationNavigation;
        }
        else if (g is Models.CosmosDB.Game cosmosGame)
        {
            cosmosGame.Id = CosmosId;
            cosmosGame.SeasonId = SeasonId;
            cosmosGame.HomeTeamId = HomeTeamId;
            cosmosGame.HomeTeamName = HomeTeamName;
            cosmosGame.HomePlayerIds = HomePlayerIds;
            cosmosGame.VisitorTeamId = VisitorTeamId;
            cosmosGame.VisitorTeamName = VisitorTeamName;
            cosmosGame.VisitorPlayerIds = VisitorPlayerIds;
            cosmosGame.At = At;
        }
    }

    public static GameVM FactoryFrom<T>(T g)
    {
        if (g is NBA.Models.SQL.Game sqlGame)
        {
            return new GameVM
            {
                Id = sqlGame.Id,
                SeasonId = sqlGame.SeasonId,
                HomeTeamId = sqlGame.HomeTeamId,
                VisitorTeamId = sqlGame.VisitorTeamId,
                At = sqlGame.At,
                Participations = sqlGame.Participations,
                Scalation = sqlGame.Scalation,
                ScalationNavigation = sqlGame.ScalationNavigation
            };
        }
        else if (g is NBA.Models.CosmosDB.Game cosmosGame)
        {
            return new GameVM
            {
                CosmosId = cosmosGame.Id,
                SeasonId = cosmosGame.SeasonId,
                HomeTeamId = cosmosGame.HomeTeamId,
                HomeTeamName = cosmosGame.HomeTeamName,
                HomePlayerIds = cosmosGame.HomePlayerIds,
                VisitorTeamId = cosmosGame.VisitorTeamId,
                VisitorTeamName = cosmosGame.VisitorTeamName,
                VisitorPlayerIds = cosmosGame.VisitorPlayerIds,
                At = cosmosGame.At
            };
        }
        throw new ArgumentException("Unsupported type", nameof(g));
    }
}