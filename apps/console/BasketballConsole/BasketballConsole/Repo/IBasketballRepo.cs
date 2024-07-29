using NBA.Models;
namespace NBA.Repo
{
    interface IBasketballRepo
    {
        void Initialize();
        int RegisterPlay(int gameId, int quarter, int playerId, TimeSpan timeDiff, string? type);
        int CreateGame(string? homeTeamId, string? visitorTeamId, DateTime at);
        List<Play> GetLastPlays(int gameId, int playerId, int quarter, int topRows);
        DateTime GetGameStart(int gameId);
        string GetPlayerName(int playerId);
    }
}