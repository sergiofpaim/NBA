namespace NBA.Repo.Tables;

public partial class Season
{
    public string Id { get; set; } = null!;

    public virtual ICollection<Scalation> Scalations { get; set; } = [];
}
