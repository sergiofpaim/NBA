namespace NBA.SQL.Models;

public partial class CSeason
{
    public string Id { get; set; } = null!;

    public virtual ICollection<Scalation> Scalations { get; set; } = new List<Scalation>();
}
