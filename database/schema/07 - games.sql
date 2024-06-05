USE Basketball;
GO

CREATE TABLE Games (
Id int IDENTITY(1,1) PRIMARY KEY,
HomeTeam varchar(3),
VisitorsTeam varchar(3),
MatchDate date
);

ALTER TABLE Games
ADD FOREIGN KEY (HomeTeam) REFERENCES Teams(Id);

ALTER TABLE Games
ADD FOREIGN KEY (VisitorsTeam) REFERENCES Teams(Id);
