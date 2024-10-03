using NBA.Interfaces;
using NBA.Models;
using NBA.Models.ValueObjects;
using NBA.Repo;
using static NBA.CLI.AddPlayCommand;

namespace NBA.Services
{
    internal static class NBAService
    {
        public static (string Message, int Code) AddGame(string homeTeamId, string visitorTeamId, DateTime at)
        {
            var lastSeason = Basketball.Repo.GetLastSeason();
            if (lastSeason is null)
                return ("There is no season registered yet.", 128);

            var homeTeam = lastSeason.Teams.FirstOrDefault(t => t.TeamId == homeTeamId);
            if (homeTeam is null)
                return ("Home team not found.", 128);

            var visitorTeam = lastSeason.Teams.FirstOrDefault(t => t.TeamId == visitorTeamId);
            if (visitorTeam is null)
                return ("Visitor team not found.", 128);

            var game = Game.FactoryFrom(lastSeason.Id, homeTeam, visitorTeam, at);

            bool success = Basketball.Repo.CreateGame(game).Result;

            if (!success)
                return ("Failed to add the game to the database.", 1);

            return ("Game added to the database.", 0);
        }

        public static (string Message, int Code, Participation Participation) AddPlay(PlayParms settings, Game game, bool isHomePlayer, PlayType type, int playsToTake)
        {
            var newPlay = GamePlay.FactoryFrom(settings.Quarter, type, game.At);

            var player = Basketball.Repo.GetPlayer(settings.PlayerId);

            if (player is null)
                return ("Player not found", 128, null);

            var participation = Basketball.Repo.GetParticipation(settings.GameId, settings.PlayerId);

            if (participation == null)
                participation = Participation.FactoryFrom(game,
                                                          player,
                                                          isHomePlayer
                                                              ? game.HomeTeamName
                                                              : game.VisitorTeamName, newPlay);
            else
                participation.RegisterPlay(newPlay);

            bool success = Basketball.Repo.Update(participation);

            //Only cuts the participation after updating the database
            if (participation.Plays.Count > playsToTake)
                participation.Plays.RemoveRange(playsToTake, participation.Plays.Count - playsToTake);

            if (!success)
                return ("Failed to add the play to the database.", 1, null);
            else
                return ("Play added to the database.", 0, participation);
        }

        internal static (string Message, int Code, Game Game, bool IsHomePlayer) CheckGameForPlayer(string gameId, string playerId)
        {
            var game = Basketball.Repo.GetGame(gameId);

            if (game is null)
                return ("Game not found", 128, null, false);

            bool isHomePlayer;
            if (game.HomePlayerIds.Contains(playerId))
                isHomePlayer = true;
            else if (game.VisitorPlayerIds.Contains(playerId))
                isHomePlayer = false;
            else
                return ("Player does not participate in the team for the season", 128, null, false);

            return (null, 0, game, isHomePlayer);
        }

        internal static (string Message, int Code, Participation Participation) GetParticipation(string gameId, string playerId)
        {
            var participation = Basketball.Repo.GetParticipation(gameId, playerId);
            if (participation is null)
                return ("Player does not participate in the game", 128, null);
            else
                return (null, 0, participation);
        }

        internal static (string Message, int Code, Player Player) GetPlayer(string playerId)
        {
            var player = Basketball.Repo.GetPlayer(playerId);

            if (player == null)
                return ("Player not found", 128, null);
            else
                return (null, 0, player);
        }

        internal static (string Message, int Code) Reseed()
        {
            Basketball.Repo.Reseed();
            return ("Reseed completed", 0);
        }
    }
}