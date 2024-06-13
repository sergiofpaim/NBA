USE Basketball;
GO

CREATE TABLE Season (
Id char(5) NOT NULL PRIMARY KEY,
CONSTRAINT CK_Seasons_Id CHECK (Id LIKE '[0-9][0-9]-[0-9][0-9]')
);
