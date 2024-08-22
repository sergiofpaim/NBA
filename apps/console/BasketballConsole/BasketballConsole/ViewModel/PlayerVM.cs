using NBA.Models.SQL;

namespace NBA.ViewModels;

public class PlayerVM
{
    public int Id { get; set; }

    public string Name { get; set; }

    public DateOnly? BornOn { get; set; }

    public string Position { get; set; }

    public virtual ICollection<Selection> Selections { get; set; } = [];

    //Cosmos

    public string IdCosmos { get; set; }
}
