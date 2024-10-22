SELECT Player.PlayerName,
		Game.HomeTeamId +' vs '+Game.VisitorsTeamId AS Game,
		Game.MatchDate AS GameDate,
		SUM(CASE WHEN Play.PlayType < 4 THEN Play.PlayType * Play.Amount ELSE 0 END) AS Points
FROM Play 
JOIN Participation
  ON Play.ParticipationId = Participation.Id 
JOIN Selection
  ON Participation.SelectionId= Selection.Id
JOIN Game
  ON Participation.GameId = Game.Id
JOIN Player
  ON Selection.PlayerId= Player.Id
GROUP BY Play.ParticipationId, Player.PlayerName, Game.HomeTeamId, Game.VisitorsTeamId, Game.MatchDate
ORDER BY GameDate DESC, Game, Points DESC;

--select * 
--from season AS ss, team AS t, Scalation AS sl
--WHERE ss.Id = sl.SeasonId AND t.Id = sl.TeamId

--select *
--from Season AS ss
--JOIN Scalation AS sl
--  ON ss.Id = sl.SeasonId
--JOIN Team AS t
--  ON t.Id = sl.TeamId