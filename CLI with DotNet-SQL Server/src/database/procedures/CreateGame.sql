USE Basketball;
GO

CREATE PROCEDURE CreateGame
	@HomeTeamId varchar(3),
	@VisitorTeamId varchar(3),
    @At datetime
AS
BEGIN
        INSERT INTO Game (Id, SeasonId, HomeTeamId, VisitorTeamId, At)
        VALUES (
            (SELECT ISNULL(MAX(Id), 0) + 1 FROM Game),
            (SELECT ISNULL(MAX(Id), 0) FROM Season),
			@HomeTeamId,
			@VisitorTeamId,
			@At
        );
        PRINT 'Game created successfully.';
END;
