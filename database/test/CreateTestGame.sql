  UPDATE Game 
  SET At = GETDATE()
  WHERE Id = 31;

  --INSERT INTO Game (Id, SeasonId, HomeTeamId, VisitorTeamId, At) VALUES
  --(31,'23-24','LAL','BOS','2024-10-15T20:15:00');
  
  --DELETE FROM Game WHERE Id > 30;
  --DELETE FROM Participation WHERE GameId > 30;
  --DELETE FROM Play WHERE Id > 1800;

  --SELECT * FROM Play WHERE ParticipationId > 600;