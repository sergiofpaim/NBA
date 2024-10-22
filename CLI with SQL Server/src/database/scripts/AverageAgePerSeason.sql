SELECT Selection.SeasonId, AVG(DATEDIFF(YEAR, Player.DateOfBirth, Season.StartDate)) AS AverageAge 
FROM Selection 
JOIN Player
  ON Selection.PlayerId = Player.Id 
JOIN Scalation
  ON Selection.SeasonId = Scalation.SeasonId
JOIN Season
  On Scalation.SeasonId = Season.Id
GROUP BY Selection.SeasonId
ORDER BY Selection.SeasonId;