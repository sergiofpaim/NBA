using NBA.Models;

namespace NBA.Infrastructure
{
    interface IBasketballRepo
    {
        bool Update(Participation participation);
        Task<bool> CreateGame(Game game);
        Season GetLastSeason();
        Participation GetParticipation(string gameId, string playerId);
        T GetById<T>(string id) where T : BasketballModel;
        //List<T> Get<T>(Func<T, bool> predicate);
        //var participations = CosmosDBRepo.Get<Participation>(p => p.gameId == gameId && p.playerId == playerId);
        void Reseed();
    }
}