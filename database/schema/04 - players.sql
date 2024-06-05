USE Basketball;
GO

CREATE TABLE Players (
Id int IDENTITY(1,1) PRIMARY KEY ,
PlayerName varchar(20),
DateOfBirth date,
Position varchar(20)
);