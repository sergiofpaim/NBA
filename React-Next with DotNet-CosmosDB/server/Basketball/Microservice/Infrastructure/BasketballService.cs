namespace NBA.Infrastructure
{
    internal class BasketballService
    {
        protected static BasketballResponse<T> Success<T>(T value, string message = null)
        {
            return new()
            {
                Message = message,
                Code = 0,
                PayLoad = value
            };
        }

        protected static BasketballResponse<T> NotFound<T>(string message)
        {
            return new()
            {
                Message = message,
                Code = 128
            };
        }

        protected static BasketballResponse<T> Error<T>(string message)
        {
            return new()
            {
                Message = message,
                Code = 1
            };
        }
    }
}