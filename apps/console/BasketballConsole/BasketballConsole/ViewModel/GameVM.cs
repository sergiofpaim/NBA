using NBA.Models.SQL;

namespace NBA.ViewModels;

public class GameVM
{
    public int Id { get; set; }

    public string SeasonId { get; set; }

    public string HomeTeamId { get; set; }

    public string VisitorTeamId { get; set; }

    public DateTime At { get; set; }

    public virtual ICollection<Participation> Participations { get; set; } = [];

    public virtual Scalation Scalation { get; set; }

    public virtual Scalation ScalationNavigation { get; set; }
}
