using NBA.ViewModels;
using NBA.Models.Type;

namespace NBA.Interfaces
{
    interface IBasketballRepo
    {
        int RegisterPlay(int gameId, int quarter, int playerId, PlayType type);
        int CreateGame(string? homeTeamId, string? visitorTeamId, DateTime at);
        List<PlayVM> GetLastPlays(int gameId, int playerId, int quarter, int topRows = 0);
        GameVM GetGame(int gameId);
        PlayerVM GetPlayer(int playerId);
        SelectionVM? GetSelection(int gameId, int playerId);
    }
}