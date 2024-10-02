using NBA.Interfaces;

namespace NBA.Repo
{
    internal static class Basketball
    {
        private static IBasketballRepo? repo;

        public static IBasketballRepo Repo { get => repo; private set => repo = value; }

        public static void SetRepo(IBasketballRepo repo)
        {
            Repo = repo;
        }
    }
}