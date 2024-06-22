USE Basketball;
GO

--DROP TABLE Basketball.dbo.Participation;

CREATE TABLE Basketball.dbo.Participation (
Id int PRIMARY KEY,
SelectionId int NOT NULL,
GameId int NOT NULL,
Quarter int NOT NULL,
Points int DEFAULT 0
);

ALTER TABLE Participation
ADD CONSTRAINT CK_Quarter CHECK (Quarter BETWEEN 1 AND 6);

ALTER TABLE Participation
ADD CONSTRAINT UC_Participation UNIQUE (SelectionId, GameId, Quarter);

ALTER TABLE Participation
ADD CONSTRAINT FK_Participation_GameId FOREIGN KEY (GameId) REFERENCES Game(Id);

ALTER TABLE Participation
ADD CONSTRAINT FK_Participation_SelectionId FOREIGN KEY (SelectionId) REFERENCES Selection(Id);



