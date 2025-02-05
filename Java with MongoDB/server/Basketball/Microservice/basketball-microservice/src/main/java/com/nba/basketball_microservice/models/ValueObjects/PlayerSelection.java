package com.nba.basketball_microservice.models.ValueObjects;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.nba.basketball_microservice.infrastructure.ValidationResult;

public class PlayerSelection {
    private String playerId;
    private String playerName;
    private int jersey;

    @JsonCreator
    public PlayerSelection(@JsonProperty("playerId") String playerId,
            @JsonProperty("playerName") String playerName,
            @JsonProperty("jersey") int jersey) {
        this.playerId = playerId;
        this.playerName = playerName;
        this.jersey = jersey;
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

    public int getJersey() {
        return jersey;
    }

    public void setJersey(int jersey) {
        this.jersey = jersey;
    }

    public ValidationResult validate() {
        if (playerId == null) {
            return new ValidationResult(false, "playerId cannot be null");
        }

        if (playerName == null) {
            return new ValidationResult(false, "playerName cannot be null");
        }

        if (jersey < 0 || jersey >= 100) {
            return new ValidationResult(false, "jersey should be between 0 and 100");
        }

        return new ValidationResult(true, null);
    }
}
