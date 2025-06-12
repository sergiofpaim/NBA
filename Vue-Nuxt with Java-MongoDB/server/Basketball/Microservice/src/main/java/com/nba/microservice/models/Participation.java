package com.nba.microservice.models;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.nba.microservice.infrastructure.BasketballModel;
import com.nba.microservice.infrastructure.ValidationResult;
import com.nba.microservice.models.ValueObjects.GamePlay;

public class Participation extends BasketballModel {
    @JsonProperty("seasonId")
    private String seasonId;
    @JsonProperty("gameId")
    private String gameId;
    @JsonProperty("teamId")
    private String teamId;
    @JsonProperty("teamName")
    private String teamName;
    @JsonProperty("playerId")
    private String playerId;
    @JsonProperty("playerName")
    private String playerName;
    @JsonProperty("plays")
    private List<GamePlay> plays;

    public Participation() {
    }

    public String getSeasonId() {
        return seasonId;
    }

    public void setSeasonId(String seasonId) {
        this.seasonId = seasonId;
    }

    public String getGameId() {
        return gameId;
    }

    public void setGameId(String gameId) {
        this.gameId = gameId;
    }

    public String getTeamId() {
        return teamId;
    }

    public void setTeamId(String teamId) {
        this.teamId = teamId;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public List<GamePlay> getPlays() {
        return plays;
    }

    public void setPlays(List<GamePlay> plays) {
        this.plays = plays;
    }

    @Override
    public ValidationResult validate() {
        if (getId() == null) {
            return new ValidationResult(false, "id cannot be null");
        }

        if (seasonId == null) {
            return new ValidationResult(false, "seasonId cannot be null");
        }

        if (gameId == null) {
            return new ValidationResult(false, "gameId cannot be null");
        }

        if (teamId == null) {
            return new ValidationResult(false, "teamId cannot be null");
        }

        if (teamName == null) {
            return new ValidationResult(false, "teamName cannot be null");
        }

        if (playerId == null) {
            return new ValidationResult(false, "playerId cannot be null");
        }

        if (playerName == null) {
            return new ValidationResult(false, "playerName cannot be null");
        }

        for (GamePlay play : plays) {
            ValidationResult result = play.validate();
            if (!result.isSuccess()) {
                return new ValidationResult(false,
                        "play at '" + play.getAt() + "' is invalid due to '" + result.getMessage() + "'");
            }
        }

        return new ValidationResult(true, null);
    }

    public static Participation factoryFrom(Game game, Player player, String teamName, String teamId,
            GamePlay gamePlay) {
        Participation participation = new Participation();
        participation.setId(UUID.randomUUID().toString().substring(0, 8));
        participation.setSeasonId(game.getSeasonId());
        participation.setGameId(game.getId());
        participation.setTeamId(teamId);
        participation.setTeamName(teamName);
        participation.setPlayerId(player.getId());
        participation.setPlayerName(player.getName());
        participation.setPlays(new ArrayList<>());
        participation.getPlays().add(gamePlay);
        return participation;
    }

    public void registerPlay(GamePlay newPlay) {
        plays.add(0, newPlay);
    }

    public void trimPlays(int playsToTake) {
        if (plays.size() > playsToTake) {
            plays.subList(playsToTake, plays.size()).clear();
        }

        plays.sort((p1, p2) -> Long.compare(p1.getAt(), p2.getAt()));
    }

}