namespace NBA.Models.SQL;

public partial class Season
{
    public string Id { get; set; }

    public virtual ICollection<Scalation> Scalations { get; set; } = [];
}
