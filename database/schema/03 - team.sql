USE Basketball;
GO

CREATE TABLE Team (
    Id VARCHAR(3) NOT NULL PRIMARY KEY,
    Name VARCHAR(20),
    State VARCHAR(20),
    City VARCHAR(20),
    Stadium VARCHAR(50),
    Conference CHAR(1),
    CONSTRAINT CK_Team_Conference CHECK (Conference IN ('W', 'E'))
);
