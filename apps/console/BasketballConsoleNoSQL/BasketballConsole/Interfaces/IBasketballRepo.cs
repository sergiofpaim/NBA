﻿using NBA.Models;

namespace NBA.Interfaces
{
    interface IBasketballRepo
    {
        bool Update(Participation participation);
        Task<bool> CreateGame(Game game);
        Season GetLastSeason();
        Game GetGame(string gameId);
        Participation GetParticipation(string gameId, string playerId); 
        Player GetPlayer(string playerId);
        void Reseed();
    }
}