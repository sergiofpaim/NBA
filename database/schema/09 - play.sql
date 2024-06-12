USE Basketball;
GO

CREATE TABLE Play (
Id int IDENTITY(1,1) PRIMARY KEY,
ParticipationId int,
PlayType varchar(20),
);

ALTER TABLE Play
ADD CONSTRAINT FK_Play_ParticipationId FOREIGN KEY (ParticipationId) REFERENCES Participation(Id);