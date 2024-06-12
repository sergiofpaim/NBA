SELECT Selection.SeasonId, Selection.TeamId, AVG(DATEDIFF(YEAR, Player.DateOfBirth, Season.StartDate)) AS AverageAge 
FROM Selection 
JOIN Player ON Selection.PlayerId = Player.Id 
JOIN Scalation ON Selection.SeasonId = Scalation.SeasonId 
AND Selection.TeamId = Scalation.TeamId 
JOIN Season On Scalation.SeasonId = Season.Id
GROUP BY Selection.SeasonId, Selection.TeamId 
ORDER BY Selection.SeasonId, Selection.TeamId;