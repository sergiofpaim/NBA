namespace NBA.Infrastructure
{
    public abstract class BasketballViewModel
    {
        public abstract (bool Success, string Message) Validate();
    }
}