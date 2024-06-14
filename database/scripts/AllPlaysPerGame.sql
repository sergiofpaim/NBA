WITH gp AS (
SELECT g.Id AS GameId,
       g.At, 
       t.State,
       t.City, 
       t.Stadium, 
       t.Name AS Team, 
       s.Jersey, 
       p.Name AS Player, 
       p.Position 
FROM Game AS g
JOIN Selection AS s
  ON g.SeasonId = s.SeasonId
 AND g.HomeTeamId = s.TeamId
JOIN Player AS p
  ON s.PlayerId = p.Id
JOIN Team AS t
  ON g.HomeTeamId = t.Id
WHERE g.Id = 3 
  AND p.Id = 41
UNION ALL
SELECT g.Id AS GameId,
       g.At, 
       th.State,
       th.City, 
       th.Stadium, 
       t.Name AS Team, 
       s.Jersey, 
       p.Name AS Player, 
       p.Position 
FROM Game AS g
JOIN Selection AS s
  ON g.SeasonId = s.SeasonId
 AND g.VisitorTeamId = s.TeamId
JOIN Player AS p
  ON s.PlayerId = p.Id
JOIN Team AS t
   ON g.VisitorTeamId = t.Id
JOIN Team AS th
  ON g.HomeTeamId = th.Id
WHERE g.Id = 3
  AND p.Id = 41
)
SELECT gp.*, pn.Quarter, py.Type, py.Points, py.At 
FROM gp
JOIN Participation AS pn
  ON gp.GameId = pn.GameId
JOIN Play AS py
  ON pn.Id = py.ParticipationId
