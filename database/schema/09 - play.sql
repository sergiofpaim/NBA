USE Basketball;
GO

CREATE TABLE Play (
Id int IDENTITY(1,1) PRIMARY KEY,
ParticipationId int,
Type varchar(20),
Points int,
At time
);

ALTER TABLE Play
ADD CONSTRAINT FK_Play_ParticipationId FOREIGN KEY (ParticipationId) REFERENCES Participation(Id);

SET IDENTITY_INSERT Play ON;
