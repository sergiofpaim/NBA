USE Basketball;
GO

--DROP TABLE Basketball.dbo.Game;

CREATE TABLE Basketball.dbo.Game (
Id int PRIMARY KEY,
SeasonId char(5),
HomeTeamId varchar(3),
VisitorTeamId varchar(3),
At datetime
);

ALTER TABLE Game
ADD CONSTRAINT FK_HomeTeamId_TeamId FOREIGN KEY (SeasonId, HomeTeamId) REFERENCES Scalation(SeasonId, TeamId);

ALTER TABLE Game
ADD CONSTRAINT FK_VisitorTeamId_TeamId FOREIGN KEY (SeasonId, VisitorTeamId) REFERENCES Scalation(SeasonId, TeamId);

