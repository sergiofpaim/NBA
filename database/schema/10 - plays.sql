USE Basketball;
GO

CREATE TABLE Plays (
Id int IDENTITY(1,1) PRIMARY KEY,
Selected int,
Game int,
Quarter int,
PlayType int,
Amount int,
);

ALTER TABLE Plays
ADD CONSTRAINT UC_Plays UNIQUE (Selected, Game, Quarter);

ALTER TABLE Plays
ADD FOREIGN KEY (Selected, Game, Quarter) REFERENCES Participation(Selection, Game, Quarter);
