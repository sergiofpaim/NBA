namespace NBA.Models;

public partial class Player
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public DateOnly? BornOn { get; set; }

    public string? Position { get; set; }

    public virtual ICollection<Selection> Selections { get; set; } = new List<Selection>();
}
