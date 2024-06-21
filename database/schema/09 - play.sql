USE Basketball;
GO

--DROP TABLE Play

CREATE TABLE Play (
Id int PRIMARY KEY,
ParticipationId int,
Type varchar(20),
Points int,
At time
);

ALTER TABLE Play
ADD CONSTRAINT FK_Play_ParticipationId FOREIGN KEY (ParticipationId) REFERENCES Participation(Id);
