USE Basketball;
GO

--DROP TABLE Basketball.dbo.Scalation;

CREATE TABLE Basketball.dbo.Scalation (
SeasonId char(5) NOT NULL,
TeamId varchar(3) NOT NULL,
);

ALTER TABLE Scalation
ADD CONSTRAINT PK_Scalation PRIMARY KEY (SeasonId, TeamId);

ALTER TABLE Scalation
ADD CONSTRAINT FK_Scalation_Season FOREIGN KEY (SeasonId) REFERENCES Season(Id);

ALTER TABLE Scalation
ADD CONSTRAINT FK_Scalation_Team FOREIGN KEY (TeamId) REFERENCES Team(Id);

