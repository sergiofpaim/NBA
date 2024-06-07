USE Basketball;
GO

CREATE TABLE Player (
Id int IDENTITY(1,1) PRIMARY KEY ,
PlayerName varchar(50),
DateOfBirth date,
Position varchar(20)
);