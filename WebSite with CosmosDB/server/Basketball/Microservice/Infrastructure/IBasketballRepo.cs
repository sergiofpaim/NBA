using System.Linq.Expressions;

namespace NBA.Infrastructure
{
    interface IBasketballRepo
    {
        Task<T> CreateAsync<T>(T entity) where T : BasketballModel;
        Task<T> UpdateAsync<T>(T entity) where T : BasketballModel;
        T GetById<T>(string id) where T : BasketballModel;
        IEnumerable<T> Get<T>(Expression<Func<T, bool>> where, Expression<Func<T, object>> order = null, int? take = null) where T : BasketballModel;
        void Reseed();
    }
}