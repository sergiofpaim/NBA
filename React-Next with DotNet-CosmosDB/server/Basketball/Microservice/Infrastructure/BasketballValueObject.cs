namespace NBA.Infrastructure
{
    public abstract class BasketballValueObject
    {
        public abstract (bool Success, string Message) Validate();
    }
}