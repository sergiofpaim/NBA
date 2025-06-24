CREATE TRIGGER restrict_player_participation_insert
ON Participation
INSTEAD OF INSERT
AS
BEGIN
    -- Check for invalid salary in the inserted data
    IF EXISTS (SELECT 1 
               FROM inserted
			   JOIN Selection AS se 
                 ON inserted.SelectionId = se.Id
			   JOIN Game AS ga ON inserted.GameId = ga.Id
			   WHERE se.TeamId != ga.HomeTeamId
                 AND se.TeamId != ga.VisitorTeamId)
    BEGIN
        RAISERROR('Inserted player must be part of one of the teams playing the game', 20, 1);
    END
    ELSE
    BEGIN
        -- Insert data if all rows have valid salaries
        INSERT INTO Participation (Id, SelectionId, GameId, Quarter)
        SELECT Id, SelectionId, GameId, Quarter
        FROM inserted;
    END
END;