USE Basketball;
GO

--DROP TABLE Basketball.dbo.Season;

CREATE TABLE Basketball.dbo.Season (
Id char(5) NOT NULL PRIMARY KEY,
CONSTRAINT CK_Seasons_Id CHECK (Id LIKE '[0-9][0-9]-[0-9][0-9]')
);
