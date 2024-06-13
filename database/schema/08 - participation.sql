USE Basketball;
GO

CREATE TABLE Participation (
Id int IDENTITY(1,1) PRIMARY KEY,
SelectionId int NOT NULL,
GameId int NOT NULL,
Quarter int NOT NULL
);

ALTER TABLE Participation
ADD CONSTRAINT UC_Participation UNIQUE (SelectionId, GameId, Quarter);

ALTER TABLE Participation
ADD CONSTRAINT FK_Participation_GameId FOREIGN KEY (GameId) REFERENCES Game(Id);

ALTER TABLE Participation
ADD CONSTRAINT FK_Participation_SelectionId FOREIGN KEY (SelectionId) REFERENCES Selection(Id);

SET IDENTITY_INSERT Participation ON;

