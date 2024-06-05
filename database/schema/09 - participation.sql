USE Basketball;
GO

CREATE TABLE Participation (
Selection int NOT NULL,
Game int NOT NULL,
Quarter int NOT NULL
);

ALTER TABLE Participation
ADD CONSTRAINT PK_Participation PRIMARY KEY (Selection, Game, Quarter)

ALTER TABLE Participation
ADD FOREIGN KEY (Game, Quarter) REFERENCES Quarters(Game, Quarter);

ALTER TABLE Participation
ADD FOREIGN KEY (Selection) REFERENCES Selection(Id);

