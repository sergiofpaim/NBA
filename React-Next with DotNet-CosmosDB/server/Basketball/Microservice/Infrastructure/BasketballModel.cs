namespace NBA.Infrastructure
{
    public abstract class BasketballModel
    {
        public string Id { get; set; }

        public abstract (bool Success, string Message) Validate();
    }
}