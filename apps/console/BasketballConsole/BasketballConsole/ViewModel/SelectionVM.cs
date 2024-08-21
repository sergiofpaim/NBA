using NBA.Models.SQL;

namespace NBA.ViewModels;

public class SelectionVM
{
    public int Id { get; set; }

    public int? PlayerId { get; set; }

    public string SeasonId { get; set; }

    public string TeamId { get; set; }

    public int? Jersey { get; set; }

    public virtual ICollection<Participation> Participations { get; set; } = [];

    public virtual Player Player { get; set; }

    public virtual Scalation Scalation { get; set; }


    public void MapTo(Selection s)
    {
        s.PlayerId = PlayerId;
        s.SeasonId = SeasonId;
        s.TeamId = TeamId;
        s.Jersey = Jersey;
        s.Participations = Participations;
        s.Player = Player;
        s.Scalation = Scalation;
    }

    public static SelectionVM FactoryFrom(Selection s)
    {
        return new()
        {
            PlayerId = s.PlayerId,
            SeasonId = s.SeasonId,
            TeamId = s.TeamId,
            Jersey = s.Jersey,
            Participations = s.Participations,
            Player = s.Player,
            Scalation = s.Scalation
        };
    }
}
