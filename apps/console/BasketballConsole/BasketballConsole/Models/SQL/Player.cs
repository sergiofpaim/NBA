using NBA.ViewModels;

namespace NBA.Models.SQL;

public partial class Player
{
    public int Id { get; set; }

    public string Name { get; set; }

    public DateOnly BornOn { get; set; }

    public string Position { get; set; }

    public virtual ICollection<Selection> Selections { get; set; } = [];

    public void MapTo(PlayerVM p)
    {
        p.Id = Id;
        p.Name = Name;
        p.BornOn = BornOn;
        p.Position = Position;
        p.Selections = Selections;
    }

    public static PlayerVM FactoryFrom(Player p)
    {
        return new()
        {
            Id = p.Id,
            Name = p.Name,
            BornOn = p.BornOn,
            Position = p.Position,
            Selections = p.Selections,
        };
    }
}
