using NBA.ViewModels;

namespace NBA.Models.SQL;

public partial class Game
{
    public int Id { get; set; }

    public string SeasonId { get; set; }

    public string HomeTeamId { get; set; }

    public string VisitorTeamId { get; set; }

    public DateTime At { get; set; }

    public virtual ICollection<Participation> Participations { get; set; } = [];

    public virtual Scalation Scalation { get; set; }

    public virtual Scalation ScalationNavigation { get; set; }

    public void MapTo(GameVM g)
    {
        g.Id = Id;
        g.SeasonId = SeasonId;
        g.HomeTeamId = HomeTeamId;
        g.VisitorTeamId = VisitorTeamId;
        g.At = At;
        g.Participations = Participations;
        g.Scalation = Scalation;
        g.ScalationNavigation = ScalationNavigation;
    }

    public static GameVM FactoryFrom(Game g)
    {
        return new()
        {
            Id = g.Id,
            SeasonId = g.SeasonId,
            HomeTeamId = g.HomeTeamId,
            VisitorTeamId = g.VisitorTeamId,
            At = g.At,
            Participations = g.Participations,
            Scalation = g.Scalation,
            ScalationNavigation = g.ScalationNavigation
        };
    }
}
