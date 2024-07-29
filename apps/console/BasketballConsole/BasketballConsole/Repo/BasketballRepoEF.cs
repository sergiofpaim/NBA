using NBA.Models;
using NBA.Repo.Type;
using Spectre.Console;
using System.Data;
using System.Data.SqlClient;

namespace NBA.Repo
{
    public class BasketballRepoEF : IBasketballRepo
    {
        static private readonly string serverName = "NOTE-SFP";
        static private readonly string databaseName = "Basketball";
        static private readonly string connectionString = $"Data Source={serverName};Initial Catalog={databaseName};Integrated Security=True";

        private static readonly SqlConnection conn = new(connectionString);

        public void Initialize()
        {
            conn.Open();
        }

        public int RegisterPlay(int gameId, int quarter, int playerId, DateTime gameStart, string? type)
        {
            using (var context = new ApplicationDbContext())
            {
                int points = 0;
                TimeSpan timediff = DateTime.Now - gameStart;

                var selection = context.Selections
                    .Where(s => s.PlayerId == playerId &&
                                context.Games.Any(g => g.HomeTeamId == s.TeamId || g.VisitorTeamId == s.TeamId))
                    .FirstOrDefault();

                if (selection == null)
                    throw new InvalidOperationException("Selection not found.");

                var participation = context.Participations
                    .Where(pa => pa.GameId == gameId && pa.Quarter == quarter &&
                                 context.Selections.Any(se => se.PlayerId == playerId && se.Id == pa.SelectionId))
                    .FirstOrDefault();

                if (participation == null)
                {
                    var newParticipation = new Participation
                    {
                        SelectionId = selection.Id,
                        GameId = gameId,
                        Quarter = quarter
                    };
                    context.Participations.Add(newParticipation);
                    context.SaveChanges();
                    participation = newParticipation;
                }

                switch (type)
                {
                    case "FreeThrowHit":
                        points = 1;
                        break;
                    case "TwoPointerHit":
                        points = 2;
                        break;
                    case "ThreePointerHit":
                        points = 3;
                        break;
                    default:
                        throw new ArgumentException("Invalid play type.", nameof(type));
                }

                var newPlay = new Play
                {
                    Id = context.Plays.Max(g => g.Id) + 1,
                    ParticipationId = participation.Id,
                    Type = type,
                    Points = points,
                    At = timediff
                };

                context.Add(newPlay);
                return context.SaveChanges();
            }
        }

        public int CreateGame(string? homeTeamId, string? visitorTeamId, DateTime at)
        {
            using (var context = new ApplicationDbContext())
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
        }


        public List<Play> GetLastPlays(int gameId, int playerId, int quarter, int topRows)
        {
            using (var context = new ApplicationDbContext())
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
        }

        public DateTime GetGameStart(int gameId)
        {
            using (var context = new ApplicationDbContext())
            {
                var game = context.Games.FirstOrDefault(g => g.Id == gameId);
                if (game == null)
                    throw new InvalidOperationException("Game not found.");

                return game.At;
            }
        }

        public string GetPlayerName(int playerId)
        {
            using (var context = new ApplicationDbContext())
            {
                var name = context.Players.Where(p => p.Id == playerId).Select(p => p.Name).FirstOrDefault();

                return name ?? "Player not registered";
            }
        }
    }
}
