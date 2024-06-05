USE Basketball;
GO

CREATE TABLE Participation (
Selection int NOT NULL,
Game int NOT NULL,
Quarters int NOT NULL
);

ALTER TABLE Participation
ADD CONSTRAINT PK_Quarters PRIMARY KEY (Selection, Game, Quarters)

ALTER TABLE Participation
ADD FOREIGN KEY (Game, Quarters) REFERENCES Quarters(Game, Quarters);

ALTER TABLE Participation
ADD FOREIGN KEY (Selection) REFERENCES Selection(Id);

