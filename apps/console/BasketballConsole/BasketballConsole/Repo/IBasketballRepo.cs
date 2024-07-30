using NBA.Models;
using NBA.Repo.Type;
namespace NBA.Repo
{
    interface IBasketballRepo
    {
        void Initialize();
        int CheckSelection(int gameId, int playerId);
        int RegisterPlay(int gameId, int quarter, int playerId, PlayType type);
        int CreateGame(string? homeTeamId, string? visitorTeamId, DateTime at);
        List<Play> GetLastPlays(int gameId, int playerId, int quarter, int topRows);
        DateTime GetGameStart(int gameId);
        string GetPlayerName(int playerId);
    }
}