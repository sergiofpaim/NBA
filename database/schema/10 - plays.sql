USE Basketball;
GO

CREATE TABLE Plays (
Id int IDENTITY(1,1) PRIMARY KEY,
Selected int,
Game int,
Quarters int,
StatusType int,
Quantity int,
);

ALTER TABLE Plays
ADD CONSTRAINT UC_Plays UNIQUE (Selected, Game, Quarters);

ALTER TABLE Plays
ADD FOREIGN KEY (Selected, Game, Quarters) REFERENCES Participation(Selection, Game, Quarters);
