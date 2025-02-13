package com.nba.basketball_microservice.models.ValueObjects;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.nba.basketball_microservice.infrastructure.ValidationResult;
import java.util.List;

public class TeamScalation {
    @JsonProperty("id")
    private String id;
    @JsonProperty("teamName")
    private String teamName;
    @JsonProperty("players")
    private List<PlayerSelection> players;

    public TeamScalation() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public List<PlayerSelection> getPlayers() {
        return players;
    }

    public void setPlayers(List<PlayerSelection> players) {
        this.players = players;
    }

    public ValidationResult validate() {
        if (id == null) {
            return new ValidationResult(false, "id cannot be null");
        }
        if (teamName == null) {
            return new ValidationResult(false, "teamName cannot be null");
        }
        if (players == null) {
            return new ValidationResult(false, "players cannot be null");
        }

        for (PlayerSelection player : players) {
            ValidationResult result = player.validate();
            if (!result.isSuccess()) {
                return new ValidationResult(false,
                        "player of id '" + player.getPlayerId() + "' is invalid due to '" + result.getMessage() + "'");
            }
        }
        return new ValidationResult(true, null);
    }
}