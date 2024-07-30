namespace NBA.Repo
{
    internal static class Repository
    {
        private static IBasketballRepo main;

        public static IBasketballRepo Main { get => main; private set => main = value; }

        public static void SetRepo(IBasketballRepo repo)
        {
            Main = repo;
        }
    }
}