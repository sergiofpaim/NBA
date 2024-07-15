  UPDATE Game 
  SET At = GETDATE()
  WHERE Id = 31;
  
  --DELETE FROM Game WHERE Id > 30;
  --DELETE FROM Participation WHERE GameId > 30;
  --DELETE FROM Play WHERE Id > 1800;

  --SELECT * FROM Play WHERE ParticipationId > 600;