﻿using NBA.Models.ValueObjects;

namespace NBA.Models
{
    public class Participation
    {
        public string Id { get; set; }

        public string GameId { get; set; }

        public string PlayerId { get; set; }

        public string PlayerName { get; set; }

        public string TeamName { get; set; }

        public List<GamePlay> Plays { get; set; } = [];

        internal static Participation FactoryFrom(Game game, Player player, string teamName, GamePlay gamePlay)
        {
            return new()
            {
                Id = Guid.NewGuid().ToString()[..8],
                GameId = game.Id,
                PlayerId = player.Id,
                PlayerName = player.Name,
                TeamName = teamName,
                Plays = new List<GamePlay> { gamePlay }
            };
        }

        internal void RegisterPlay(GamePlay newPlay)
        {
            Plays.Insert(0, newPlay);
        }
    }
}