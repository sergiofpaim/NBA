USE Basketball;
GO

CREATE TABLE Selection (
Id int IDENTITY(1,1) PRIMARY KEY,
PlayerId int,
SeasonId char(5),
TeamId varchar(3),
Jersey int
);

ALTER TABLE Selection
ADD CONSTRAINT UC_Selection UNIQUE (PlayerId, SeasonId, TeamId);

ALTER TABLE Selection
ADD CONSTRAINT FK_Selection_PlayerId FOREIGN KEY (PlayerId) REFERENCES Player(Id);

ALTER TABLE Selection
ADD CONSTRAINT FK_Selection_TeamId_SeasonId FOREIGN KEY (SeasonId, TeamId) REFERENCES Scalation(SeasonId, TeamId);

