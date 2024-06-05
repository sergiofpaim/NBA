USE Basketball;
GO

CREATE TABLE Quarters (
Game int NOT NULL,
Quarter int NOT NULL
);

ALTER TABLE Quarters
ADD CONSTRAINT PK_Quarters PRIMARY KEY (Game, Quarter);

ALTER TABLE Quarters
ADD FOREIGN KEY (Game) REFERENCES Games(Id);

