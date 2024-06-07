USE Basketball;
GO

CREATE TABLE Game (
Id int IDENTITY(1,1) PRIMARY KEY,
SeasonId char(5),
HomeTeamId varchar(3),
VisitorsTeamId varchar(3),
MatchDate date
);

ALTER TABLE Game
ADD CONSTRAINT FK_HomeTeamId_TeamId FOREIGN KEY (SeasonId, HomeTeamId) REFERENCES Scalation(SeasonId, TeamId);

ALTER TABLE Game
ADD CONSTRAINT FK_VisitorsTeamId_TeamId FOREIGN KEY (SeasonId, VisitorsTeamId) REFERENCES Scalation(SeasonId, TeamId);
