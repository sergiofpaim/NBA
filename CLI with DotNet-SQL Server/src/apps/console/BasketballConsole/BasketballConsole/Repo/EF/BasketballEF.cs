using NBA.Interfaces;
using NBA.Models;
using NBA.Repo.Tables;
using System.Data;

namespace NBA.Repo
{
    public class BasketballEF : IBasketballRepo
    {
        public ApplicationDbContext context;

        public BasketballEF()
        {
            context = new ApplicationDbContext();
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
                var newParticipation = new Participation
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

            var newPlay = new Play
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

        public int CreateGame(string? homeTeamId, string? visitorTeamId, DateTime at)
        {
            var game = new Game
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

        public Selection? GetSelection(int gameId, int playerId)
        {
            var selection = context.Selections
                .Where(s => s.PlayerId == playerId &&
                            context.Games.Any(g => (g.HomeTeamId == s.TeamId || g.VisitorTeamId == s.TeamId) && g.Id == gameId))
                .FirstOrDefault();

            return selection;
        }

        public List<Play> GetLastPlays(int gameId, int playerId, int quarter, int topRows = 0)
        {
            var plays = context.Plays
                .Where(p => context.Participations
                  .Any(pa => pa.Id == p.ParticipationId
                       && pa.GameId == gameId
                       && pa.Quarter == quarter
                       && context.Selections
                          .Any(s => s.PlayerId == playerId
                               && s.Id == pa.SelectionId)))
                .OrderByDescending(p => p.At);

            if (topRows > 0)
                return [.. plays.Take(topRows)];

            return [.. plays];
        }

        public Game GetGame(int gameId)
        {
            Game a = null;
            var game = context.Games.FirstOrDefault(g => g.Id == gameId);
            if (game is null)
                throw new InvalidOperationException("Game not found.");

            return game;
        }

        public Player GetPlayer(int playerId)
        {
            return context.Players.Where(p => p.Id == playerId).FirstOrDefault();
        }
    }
}