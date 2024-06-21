USE Basketball;
GO

--DROP TABLE Play

CREATE TABLE Play (
Id int PRIMARY KEY,
ParticipationId int,
Type varchar(20),
Points int,
At time
);

ALTER TABLE Play
ADD CONSTRAINT FK_Play_ParticipationId FOREIGN KEY (ParticipationId) REFERENCES Participation(Id);

ALTER TABLE Play
ADD CONSTRAINT CK_Type CHECK (Type IN ('FreeThrowHit', 'TwoPointerHit', 'ThreePointerHit',
                                       'FreeThrowMiss', 'TwoPointerMiss', 'ThreePointerMiss',
                                       'Assist', 'Rebound', 'Block', 'Foul', 'Turnover'));

ALTER TABLE Play
ADD CONSTRAINT CK_Points_Type CHECK (
    (Type = 'FreeThrowHit' AND Points = 1) OR
    (Type = 'TwoPointerHit' AND Points = 2) OR
    (Type = 'ThreePointerHit' AND Points = 3) OR
    (Type IN ('FreeThrowMiss', 'TwoPointerMiss', 'ThreePointerMiss',
              'Assist', 'Rebound', 'Block', 'Foul', 'Turnover') AND Points = 0)
);
