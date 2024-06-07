INSERT INTO Seasons(Id)
VALUES 
('91-92'),
('21-22');

INSERT INTO Teams(Id, TeamName, TeamState)
VALUES 
('CHI', 'Chicago Bulls', 'Illinois'),
('LAL', 'Los Angeles Lakers', 'California');

INSERT INTO Scalation(Season, Team, Ranking)
VALUES 
('91-92', 'CHI', 1),
('21-22', 'LAL', 2);

INSERT INTO Players(PlayerName, DateOfBirth, Position)
VALUES 
('Michael Jordan', CONVERT(date, '1963-02-17', 120), 'Shooting Guard'),
('LeBron James', CONVERT(date, '1984-12-30', 120), 'Small Forward');

INSERT INTO Selection(Season, Team, Jersey)
VALUES 
('91-92', 'CHI', 23),
('21-22', 'LAL', 6);

INSERT INTO Games(HomeTeam, VisitorsTeam, MatchDate)
VALUES 
('CHI', 'LAL', CONVERT(date, '1991-02-17')),
('LAL', 'CHI', CONVERT(date, '2021-07-29'));

INSERT INTO Quarters(Game, Quarter)
VALUES 
(1, 3),
(2, 1);

INSERT INTO Participation(Selection, Game, Quarter)
VALUES 
(3, 1, 3),
(2, 2, 1);

INSERT INTO GameStats(Id, Shots_3, Shots_2, Shots_FT, Buckets_3, Buckets_2, Buckets_FT, Assists, Blocks, Fouls, Turnovers)
VALUES 
(89324, 5, 20, 6, 1, 18, 5, 7, 3, 3, 7),
(21343, 10, 15, 8, 6, 12, 5, 8, 6, 4, 10);

