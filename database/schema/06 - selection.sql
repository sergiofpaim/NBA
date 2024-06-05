USE Basketball;
GO

CREATE TABLE Selection (
Id int IDENTITY(1,1) PRIMARY KEY,
PlayerId int,
Season int,
Team varchar(3),
Jersey int,
);

ALTER TABLE Selection
ADD CONSTRAINT UC_Selection UNIQUE (PlayerId, Season, Team);

ALTER TABLE Selection
ADD FOREIGN KEY (PlayerId) REFERENCES Players(Id);

ALTER TABLE Selection
ADD FOREIGN KEY (Season, Team) REFERENCES Scalation(Season, Team);

