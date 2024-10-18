using NBA.Models;
using System.Linq.Expressions;

namespace NBA.Infrastructure
{
    interface IBasketballRepo
    {
        Task<bool> CreateGame(Game game);
        bool Update(Participation participation);
        T GetById<T>(string id) where T : BasketballModel;
        T Get<T>(Expression<Func<T, bool>> predicate) where T : BasketballModel;
        Season GetLastSeason();
        void Reseed();
    }
}