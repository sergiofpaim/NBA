  UPDATE Game 
  SET At = GETDATE()
  WHERE Id = 31;
  
  --DELETE FROM Game WHERE Id > 30;
  --DELETE FROM Participation WHERE GameId > 30;
  --DELETE FROM Play WHERE Id > 1800;

  --SELECT * FROM Play WHERE ParticipationId > 600;

SELECT TOP 5 pl.Name, p.Points,  p.Type, p.At 
FROM Play AS p
JOIN Participation AS pa
  ON pa.Id = p.ParticipationId
JOIN Selection AS s 
  ON pa.SelectionId = s.Id
JOIN Player as pl 
  ON s.PlayerId = pl.Id
WHERE pa.GameId = 31
  AND s.PlayerId = 131
ORDER BY p.At DESC
