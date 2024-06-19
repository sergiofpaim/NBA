USE Basketball;
GO

CREATE PROCEDURE CreateGame
	@HomeTeamId varchar(3),
	@VisitorsTeamId varchar(3),
    @At datetime
AS
BEGIN
        INSERT INTO Game (Id, SeasonId, HomeTeamId, VisitorTeamId, At)
        VALUES (
            (SELECT ISNULL(MAX(Id), 0) + 1 FROM Game),
            (SELECT ISNULL(MAX(Id), 0) FROM Season),
			@HomeTeamId,
			@VisitorsTeamId,
			@At
        );
        PRINT 'Game created successfully.';
END;
