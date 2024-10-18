using NBA.Models;

namespace NBA.Infrastructure
{
    interface IBasketballRepo
    {
        bool Update(Participation participation);
        Task<bool> CreateGame(Game game);
        Season GetLastSeason();
        Game GetGame(string gameId);
        //T GetById<T>(string id);
        //List<T> Get<T>(Func<T, bool> predicate);
        //var participations = CosmosDBRepo.Get<Participation>(p => p.gameId == gameId && p.playerId == playerId);
        Participation GetParticipation(string gameId, string playerId);
        Player GetPlayer(string playerId);
        void Reseed();
    }
}