USE Basketball;
GO

--DROP TABLE Basketball.dbo.Player;

CREATE TABLE Basketball.dbo.Player (
Id int PRIMARY KEY ,
Name varchar(50),
BornOn date,
Position varchar(20)
);