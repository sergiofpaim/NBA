USE Basketball;
GO

CREATE TABLE Game (
Id int IDENTITY(1,1) PRIMARY KEY,
SeasonId char(5),
HomeTeamId varchar(3),
VisitorTeamId varchar(3),
At datetime
);

ALTER TABLE Game
ADD CONSTRAINT FK_HomeTeamId_TeamId FOREIGN KEY (SeasonId, HomeTeamId) REFERENCES Scalation(SeasonId, TeamId);

ALTER TABLE Game
ADD CONSTRAINT FK_VisitorTeamId_TeamId FOREIGN KEY (SeasonId, VisitorTeamId) REFERENCES Scalation(SeasonId, TeamId);

SET IDENTITY_INSERT Game ON;

