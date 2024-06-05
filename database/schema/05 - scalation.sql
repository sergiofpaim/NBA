USE Basketball;
GO

CREATE TABLE Scalation (
Season int NOT NULL,
Team varchar(3) NOT NULL,
Ranking integer,
);

ALTER TABLE Scalation
ADD  CONSTRAINT PK_Scalation PRIMARY KEY (Season, Team);

ALTER TABLE Scalation
ADD FOREIGN KEY (Season) REFERENCES Seasons(Id);

ALTER TABLE Scalation
ADD FOREIGN KEY (Team) REFERENCES Teams(Id);

