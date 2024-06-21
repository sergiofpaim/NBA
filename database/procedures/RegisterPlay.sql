USE Basketball;
GO

CREATE PROCEDURE RegisterPlay @GameId varchar(3),
	                          @PlayerId int,
	                          @Quarter int,
                              @Type varchar(20),
	                          @At datetime
AS
BEGIN TRY	
	BEGIN TRAN
	 	-- Checks the parameters
	 		-- Checks if the GameId is not empty
	 		-- Checks if PlayerId is greater than 0
	 		-- Checks if Quarter is between 1 and 6
	 		IF @Quarter NOT BETWEEN 1 AND 6
	 			RAISERROR ('Invalid Quarter.', 1)
     	    -- Checks if Type is valid
	
     	    -- Checks if At is not in the future
	
	 	-- Calculates the points from the Play.Type
	 	DECLARE @Points INT = 0;
	
	 		--Case When Else
	
     	-- Tries to recover the existing participation for this Player, Game and Quarter
	 	DECLARE @ParticipationId INT = 0;
	 	DECLARE @SelectionId INT = 0;
	
	 	SELECT @ParticipationId = p.Id,
	 		   @SelectionId = p.SelectionId
	 	FROM Participation AS p
	 	JOIN Selection AS s
	 	  ON s.Id = p.SelectionId
	 	 AND s.PlayerId = @PlayerId
	 	WHERE p.GameId = @GameId
	 	  AND p.Quarter = @Quarter

	 	-- If doesn't exist, creates
	 	IF @ParticipationId = 0 BEGIN
     	    -- Tries to recover the Selection of the Player for this Game 
     	    		--SELECT from Selection and Game (Compare if the player selected plays 
	 				--in the same team and season as the game takes place)
	
	 		-- Raise error if Player is not participating in the Team
     	    IF @SelectionId = 0 
	 		    RAISERROR ('The Player does not participate in the Team for the Season.', 1)
	
     	    -- If doesn't exist, raise an error
	 		SET @ParticipationId = (SELECT ISNULL(MAX(Id), 0) + 1 
			                        FROM Participation);
									-- TODO: Put WriteLock

	 		INSERT INTO Participation
	 		       (Id,
	 			    SelectionId,
	 				GameId,
	 				Quarter,
	 				Points)
	 		VALUES (@ParticipationId,
	 		        @SelectionId,
	 			    @GameId,
	 			    @Quarter,
	 			    @Points);
	 	-- If exists, updates its points
	 	END ELSE BEGIN 

	 		UPDATE Participation AS p
	 		SET p.Points = p.Points + @Points
	 		WHERE p.Id = @ParticipationId

	 	END;	
        -- Gets the next Id of Play
			-- TODO: Put WriteLock
		-- Insert Play

	COMMIT TRAN;
END TRY;

BEGIN CATCH
    IF @@TRANCOUNT > 0
    BEGIN
        ROLLBACK TRANSACTION;
    END;
END CATCH;