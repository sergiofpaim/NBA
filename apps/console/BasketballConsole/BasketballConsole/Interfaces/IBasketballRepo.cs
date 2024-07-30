using NBA.Models;
using NBA.Models.Type;

namespace NBA.Interfaces
{
    interface IBasketballRepo
    {
        int RegisterPlay(int gameId, int quarter, int playerId, PlayType type);
        int CreateGame(string? homeTeamId, string? visitorTeamId, DateTime at);
        List<Play> GetLastPlays(int gameId, int playerId, int quarter, int topRows = 0);
        Game GetGame(int gameId);
        Player GetPlayer(int playerId);
        Selection? GetSelection(int gameId, int playerId);
    }
}