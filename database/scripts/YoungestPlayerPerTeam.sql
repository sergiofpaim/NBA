WITH DateYoungestPlayer AS (
    SELECT Selection.SeasonId, 
           Selection.TeamId,
           MAX(Player.DateOfBirth) AS DateYoungest
    FROM Selection
    JOIN Player 
      ON Selection.PlayerId = Player.Id 
    GROUP BY Selection.SeasonId, 
             Selection.TeamId
)
SELECT Selection.SeasonId, 
       Selection.TeamId,
       Player.DateOfBirth,
       Player.PlayerName
FROM Selection
JOIN Player 
  ON Selection.PlayerId = Player.Id
JOIN DateYoungestPlayer 
  ON Selection.SeasonId = DateYoungestPlayer.SeasonId 
  AND Selection.TeamId = DateYoungestPlayer.TeamId 
  AND Player.DateOfBirth = DateYoungestPlayer.DateYoungest
GROUP BY Selection.SeasonId, 
         Selection.TeamId,
         Player.DateOfBirth,
         Player.PlayerName
ORDER BY Selection.TeamId DESC;
