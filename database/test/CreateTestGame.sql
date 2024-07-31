  UPDATE Game 
  SET At = GETDATE()
  WHERE Id = 31;

  DELETE FROM Game WHERE Id > 30;
  DELETE FROM Participation WHERE GameId > 30;
  DELETE FROM Play WHERE ParticipationId > 600;

  --DELETE p
  --FROM Play AS p
  --JOIN Participation AS pa ON p.ParticipationId = pa.Id
  --JOIN Selection AS s ON pa.SelectionId = s.Id
  --WHERE s.Id = 131 AND pa.GameId > 30;

  --INSERT INTO Game (Id, SeasonId, HomeTeamId, VisitorTeamId, At) VALUES
  --(31,'23-24','LAL','BOS','2024-10-15T20:15:00');