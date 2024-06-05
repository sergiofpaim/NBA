INSERT INTO Seasons(Id)
VALUES 
(1991),
(2021);

INSERT INTO Teams(Id, TeamName, TeamState)
VALUES 
('CHI', 'Chicago Bulls', 'Illinois'),
('LAL', 'Los Angeles Lakers', 'California');

INSERT INTO Scalation(Season, Team, Ranking)
VALUES 
(1991, 'CHI', 1),
(2021, 'LAL', 2);

INSERT INTO Players(Id, PlayerName, DateOfBirth, Position)
VALUES 
(425, 'Michael Jordan', CONVERT(date, '1963-02-17', 120), 'Shooting Guard'),
(583, 'LeBron James', CONVERT(date, '1984-12-30', 120), 'Small Forward');

INSERT INTO Selection(Id, PlayerId, Season, Team, Jersey)
VALUES 
(121, 425, 1991, 'CHI', 23),
(232, 583, 2021, 'LAL', 6);

INSERT INTO Game(Id, HomeTeam, VisitorsTeam, MatchDate)
VALUES 
(3123, 'CHI', 'LAL', CONVERT(date, '1991-02-17')),
(2234, 'LAL', 'CHI', CONVERT(date, '2021-07-29'));

INSERT INTO Quarters(Id, Selection, Game, Quarters)
VALUES 
(89324, 121, 3123, 3),
(21343, 232, 2234, 1);

INSERT INTO GameStats(Id, Shots_3, Shots_2, Shots_FT, Buckets_3, Buckets_2, Buckets_FT, Assists, Blocks, Fouls, Turnovers)
VALUES 
(89324, 5, 20, 6, 1, 18, 5, 7, 3, 3, 7),
(21343, 10, 15, 8, 6, 12, 5, 8, 6, 4, 10);

