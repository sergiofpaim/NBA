namespace NBA.Repo.Tables;

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
}
