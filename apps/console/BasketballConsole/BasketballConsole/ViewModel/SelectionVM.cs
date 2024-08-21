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

    //Cosmos

    public int IdCosmos { get; set; }

    public string PlayerName { get; set; }
}
