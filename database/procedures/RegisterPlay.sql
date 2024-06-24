USE Basketball;
GO

CREATE PROCEDURE RegisterPlay @GameId varchar(3),
	                          @PlayerId int,
	                          @Quarter int,
                              @Type varchar(20),
	                          @At time
AS
BEGIN TRY	
	SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
	BEGIN TRAN
	 	-- Checks the parameters
			IF @GameId IS NULL
				RAISERROR ('Invalid Game.', 16, 1);

			IF @PlayerId < 1
				RAISERROR ('Invalid Player.', 16, 1);

	 		IF @Quarter NOT BETWEEN 1 AND 6
	 			RAISERROR ('Invalid Quarter.', 16, 1);

			IF @Type NOT IN ('FreeThrowHit', 'TwoPointerHit', 'ThreePointerHit',
                             'FreeThrowMiss', 'TwoPointerMiss', 'ThreePointerMiss',
                             'Assist', 'Rebound', 'Block', 'Foul', 'Turnover')
				RAISERROR ('Invalid Type.', 16, 1);

			IF (@Quarter < 5 AND @At NOT BETWEEN '00:00:00' AND '00:15:00') OR (@Quarter >= 5 AND @At NOT BETWEEN '00:00:00' AND '00:05:00')
				RAISERROR ('Invalid At.', 16, 1);

	 	-- Calculates the points from the Play.Type
	 	DECLARE @Points INT = 0;

			SET @Points = 
    			CASE @Type
        			WHEN 'FreeThrowHit' THEN 1
        			WHEN 'TwoPointerHit' THEN 2
        			WHEN 'ThreePointerHit' THEN 3
        			ELSE 0
    			END;
	
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
	 	IF @ParticipationId = 0 
		BEGIN
			-- Tries to recover the Selection of the Player for this Game 
			SELECT @SelectionId = se.Id
            FROM Selection AS se
			JOIN Game AS ga
			  ON ga.HomeTeamId = se.TeamId
			WHERE @GameId = ga.Id 
			  AND @PlayerId = se.PlayerId 
			  AND se.SeasonId = ga.SeasonId
			
			IF @SelectionId = 0 
			BEGIN
				SELECT @SelectionId = se.Id
            	FROM Selection AS se
				JOIN Game AS ga
				  ON ga.VisitorTeamId = se.TeamId
				WHERE @GameId = ga.Id 
				  AND @PlayerId = se.PlayerId
				  AND se.SeasonId = ga.SeasonId
				  
			END;

	 		-- Raise error if Player is not participating in the Team
     	    IF @SelectionId = 0 
	 		    RAISERROR ('The Player does not participate in the Team for the Season.', 16, 1);

			-- Creates an Participation
		 		
			SET @ParticipationId = (SELECT ISNULL(MAX(Id), 0) + 1 
			                        FROM Participation);						

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

	 		UPDATE Participation
	 		SET Participation.Points = Participation.Points + @Points
	 		WHERE Participation.Id = @ParticipationId

	 	END;	
        -- Gets the next Id of Play
		DECLARE @PlayId INT;

		SET @PlayId = (SELECT ISNULL(MAX(Id), 0) + 1 
			                        FROM Play);

		INSERT INTO Play (Id, ParticipationId, Type, Points, At)
		VALUES (
			@PlayId,
			@ParticipationId,
			@Type,
			@Points,
			@At
		);

	COMMIT TRAN;
END TRY
BEGIN CATCH
        IF @@TRANCOUNT > 0
        BEGIN
            ROLLBACK TRANSACTION;
        END;
        THROW;
END CATCH;