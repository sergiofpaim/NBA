using Microsoft.EntityFrameworkCore;
using NBA.Models;
using NBA.Repo.Type;
using Spectre.Console;
using System.Data;
using System.Data.SqlClient;

namespace NBA.Repo
{
    public class BasketballRepoEF : IBasketballRepo
    {
        public ApplicationDbContext? context;
        public int i = 0;

        public BasketballRepoEF()
        {
            context = new ApplicationDbContext();
        }

        public int RegisterPlay(int gameId, int quarter, int playerId, PlayType type)
        {
            int points = 0;

            var gameAt = context.Games.Where(g => g.Id == gameId).Select(g => g.At).FirstOrDefault();

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
                    SelectionId = selection.Id,
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
                At = DateTime.Now - gameAt
            };
            context.Add(newPlay);
            return context.SaveChanges();
        }

        public int CreateGame(string? homeTeamId, string? visitorTeamId, DateTime at)
        {
            var game = new Game
            {
                Id = context.Games.Max(g => g.Id) + 1,
                SeasonId = context.Seasons.Max(s => s.Id) + 1,
                HomeTeamId = homeTeamId,
                VisitorTeamId = visitorTeamId,
                At = at
            };

            context.Games.Add(game);

            return context.SaveChanges();
        }

        public int CheckSelection(int gameId, int playerId)
        {
            var selection = context.Selections
                .Where(s => s.PlayerId == playerId &&
                            context.Games.Any(g => g.HomeTeamId == s.TeamId || g.VisitorTeamId == s.TeamId)).Select(s => s.Id)
                .FirstOrDefault();

            return selection;
        }

        public List<Play> GetLastPlays(int gameId, int playerId, int quarter, int topRows)
        {
            var plays = context.Plays
                .Where(p => context.Participations
                  .Any(pa => pa.Id == p.ParticipationId
                       && pa.GameId == gameId
                       && pa.Quarter == quarter
                       && context.Selections
                          .Any(s => s.PlayerId == playerId
                               && s.Id == pa.SelectionId)))
                .OrderByDescending(p => p.At)
                .Take(topRows)
                .ToList();

            return plays;
        }

        public DateTime GetGameStart(int gameId)
        {
            var game = context.Games.FirstOrDefault(g => g.Id == gameId);
            if (game == null)
                throw new InvalidOperationException("Game not found.");

            return game.At;
        }

        public string GetPlayerName(int playerId)
        {
            var name = context.Players.Where(p => p.Id == playerId).Select(p => p.Name).FirstOrDefault();

            return name ?? "Player not registered";
        }        
    }
}