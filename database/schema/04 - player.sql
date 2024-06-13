USE Basketball;
GO

CREATE TABLE Player (
Id int IDENTITY(1,1) PRIMARY KEY ,
Name varchar(50),
BornOn date,
Position varchar(20)
);

SET IDENTITY_INSERT Player ON;