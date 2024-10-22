using NBA.Interfaces;
using NBA.Models;
using NBA.Models.ValueObjects;
using System.Data;

namespace NBA.Repo
{
    public class BasketballEF : IBasketballRepo
    {
        public Tables.ApplicationDbContext context;

        public BasketballEF()
        {
            context = new Tables.ApplicationDbContext();
        }

        public int RegisterPlay(int gameId, int quarter, int playerId, PlayType type)
        {
            int points = 0;
            var game = GetGame(gameId);

            if ((DateTime.Now - game.At).TotalMinutes < 0 ||
                (DateTime.Now - game.At).TotalMinutes > 15 && quarter < 4 ||
                (DateTime.Now - game.At).TotalMinutes > 5 && quarter >= 5)
                throw new InvalidConstraintException("Invalid At");

            var selection = context.Selections
                .Where(s => s.PlayerId == playerId &&
                            context.Games.Any(g => g.Id == gameId &&
                            (g.HomeTeamId == s.TeamId || g.VisitorTeamId == s.TeamId)))
                .FirstOrDefault();


            var participation = context.Participations
                .Where(pa => pa.GameId == gameId && pa.Quarter == quarter &&
                             context.Selections.Any(se => se.Id == pa.SelectionId))
                .FirstOrDefault();

            switch (type)
            {
                case PlayType.FreeThrowHit:
                    points = 1;
                    break;
                case PlayType.TwoPointerHit:
                    points = 2;
                    break;
                case PlayType.ThreePointerHit:
                    points = 3;
                    break;
            }

            if (participation == null)
            {
                var newParticipation = new Tables.Participation
                {
                    Id = context.Participations.Max(g => g.Id) + 1,
                    SelectionId = selection?.Id ?? 0,
                    GameId = gameId,
                    Quarter = quarter,
                    Points = points
                };
                participation = newParticipation;
                context.Participations.Add(participation);
                context.SaveChanges();
            }

            var newPlay = new Tables.Play
            {
                Id = context.Plays.Max(g => g.Id) + 1,
                ParticipationId = participation.Id,
                Type = type.ToString(),
                Points = points,
                At = DateTime.Now - game.At
            };
            context.Add(newPlay);
            return context.SaveChanges();
        }

        public int CreateGame(string homeTeamId, string visitorTeamId, DateTime at)
        {
            var game = new Tables.Game
            {
                Id = context.Games.Max(g => g.Id) + 1,
                SeasonId = context.Seasons.OrderByDescending(s => s.Id).Select(s => s.Id).FirstOrDefault(),
                HomeTeamId = homeTeamId,
                VisitorTeamId = visitorTeamId,
                At = at
            };
            context.Games.Add(game);

            return context.SaveChanges();
        }

        public PlayerSelection GetSelection(int gameId, int playerId)
        {
            var selection = context.Selections
                .Where(s => s.PlayerId == playerId &&
                            context.Games.Any(g => (g.HomeTeamId == s.TeamId || g.VisitorTeamId == s.TeamId) && g.Id == gameId))
                .FirstOrDefault();

            return PlayerSelection.FactoryFrom(selection, context.Players.Where(p => p.Id == playerId).Select(p => p.Name).FirstOrDefault());
        }

        public List<GamePlay> GetLastPlays(int gameId, int playerId, int quarter, int topRows = 0)
        {
            var playsTable = context.Plays
                .Where(p => context.Participations
                  .Any(pa => pa.Id == p.ParticipationId
                       && pa.GameId == gameId
                       && pa.Quarter == quarter
                       && context.Selections
                          .Any(s => s.PlayerId == playerId
                               && s.Id == pa.SelectionId)))
                .OrderByDescending(p => p.At);

            List<GamePlay> gamePlays = [];

            if (topRows > 0)
                foreach (var playTable in playsTable.Take(topRows))
                    gamePlays.Add(GamePlay.FactorFrom(playTable, quarter));

            return gamePlays;
        }

        public Game GetGame(int gameId)
        {
            var game = context.Games.FirstOrDefault(g => g.Id == gameId);
            if (game is null)
                throw new InvalidOperationException("Game not found.");

            var homeTeam = context.Teams.FirstOrDefault(t => t.Id == game.HomeTeamId);
            var visitorTeam = context.Teams.FirstOrDefault(t => t.Id == game.VisitorTeamId);

            var homeTeamPlayers = context.Selections
                .Where(s => s.TeamId == game.HomeTeamId && s.SeasonId == game.SeasonId)
                .Select(s => s.PlayerId)
                .ToList();

            var visitorTeamPlayers = context.Selections
                .Where(s => s.TeamId == game.VisitorTeamId && s.SeasonId == game.SeasonId)
                .Select(s => s.PlayerId)
                .ToList();

            var homeTeamPlayerIds = homeTeamPlayers.Select(id => id.ToString()).ToList();
            var visitorTeamPlayerIds = visitorTeamPlayers.Select(id => id.ToString()).ToList();

            return Game.FactoryFrom(game, homeTeam, visitorTeam, homeTeamPlayerIds, visitorTeamPlayerIds);
        }


        public Player GetPlayer(int playerId)
        {
            return Player.FactoryFrom(context.Players.Where(p => p.Id == playerId).FirstOrDefault());
        }
    }
}