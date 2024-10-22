namespace NBA.Infrastructure
{
    public class BasketballResponse<T>
    {
        public int Code { get; internal set; }
        public string Message { get; internal set; }
        public T PayLoad { get; internal set; }
    }
}
