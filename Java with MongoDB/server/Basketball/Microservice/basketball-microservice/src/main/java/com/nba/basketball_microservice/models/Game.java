package com.nba.basketball_microservice.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.nba.basketball_microservice.infrastructure.BasketballModel;
import com.nba.basketball_microservice.infrastructure.ValidationResult;
import com.nba.basketball_microservice.models.ValueObjects.PlayerSelection;
import com.nba.basketball_microservice.models.ValueObjects.TeamScalation;
import org.bson.types.ObjectId;

import java.util.List;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.stream.Collectors;

public class Game extends BasketballModel {
    private String seasonId;
    private String homeTeamId;
    private String homeTeamName;
    private List<String> homePlayerIds;
    private String visitorTeamId;
    private String visitorTeamName;
    private List<String> visitorPlayerIds;
    private LocalDateTime at;

    public Game() {
    }

    @JsonCreator
    public Game(@JsonProperty("id") String id,
            @JsonProperty("seasonId") String seasonId,
            @JsonProperty("homeTeamId") String homeTeamId,
            @JsonProperty("homeTeamName") String homeTeamName,
            @JsonProperty("homePlayerIds") List<String> homePlayerIds,
            @JsonProperty("visitorTeamId") String visitorTeamId,
            @JsonProperty("visitorTeamName") String visitorTeamName,
            @JsonProperty("visitorPlayerIds") List<String> visitorPlayerIds,
            @JsonProperty("at") LocalDateTime at) {
        this.setId(id);
        this.seasonId = seasonId;
        this.homeTeamId = homeTeamId;
        this.homeTeamName = homeTeamName;
        this.homePlayerIds = homePlayerIds;
        this.visitorTeamId = visitorTeamId;
        this.visitorTeamName = visitorTeamName;
        this.visitorPlayerIds = visitorPlayerIds;
        this.at = at;
    }

    public String getSeasonId() {
        return seasonId;
    }

    public void setSeasonId(String seasonId) {
        this.seasonId = seasonId;
    }

    public String getHomeTeamId() {
        return homeTeamId;
    }

    public void setHomeTeamId(String homeTeamId) {
        this.homeTeamId = homeTeamId;
    }

    public String getHomeTeamName() {
        return homeTeamName;
    }

    public void setHomeTeamName(String homeTeamName) {
        this.homeTeamName = homeTeamName;
    }

    public List<String> getHomePlayerIds() {
        return homePlayerIds;
    }

    public void setHomePlayerIds(List<String> homePlayerIds) {
        this.homePlayerIds = homePlayerIds;
    }

    public String getVisitorTeamId() {
        return visitorTeamId;
    }

    public void setVisitorTeamId(String visitorTeamId) {
        this.visitorTeamId = visitorTeamId;
    }

    public String getVisitorTeamName() {
        return visitorTeamName;
    }

    public void setVisitorTeamName(String visitorTeamName) {
        this.visitorTeamName = visitorTeamName;
    }

    public List<String> getVisitorPlayerIds() {
        return visitorPlayerIds;
    }

    public void setVisitorPlayerIds(List<String> visitorPlayerIds) {
        this.visitorPlayerIds = visitorPlayerIds;
    }

    public LocalDateTime getAt() {
        return at;
    }

    public void setAt(LocalDateTime at) {
        this.at = at;
    }

    public ValidationResult validate() {
        if (getId() == null) {
            return new ValidationResult(false, "id cannot be null");
        }
        if (seasonId == null) {
            return new ValidationResult(false, "seasonId cannot be null");
        }
        if (homeTeamId == null) {
            return new ValidationResult(false, "homeTeamId cannot be null");
        }
        if (homeTeamId.equals(visitorTeamId)) {
            return new ValidationResult(false, "The teams cannot be the same");
        }
        if (homeTeamName == null) {
            return new ValidationResult(false, "homeTeamName cannot be null");
        }
        if (homePlayerIds == null || homePlayerIds.size() < 5 || homePlayerIds.stream().anyMatch(String::isBlank)) {
            return new ValidationResult(false, "homePlayerIds should have at least 5 valid ids");
        }
        if (visitorTeamId == null) {
            return new ValidationResult(false, "visitorTeamId cannot be null");
        }
        if (visitorTeamName == null) {
            return new ValidationResult(false, "visitorTeamName cannot be null");
        }
        if (visitorPlayerIds == null || visitorPlayerIds.size() < 5
                || visitorPlayerIds.stream().anyMatch(String::isBlank)) {
            return new ValidationResult(false, "visitorPlayerIds should have at least 5 valid ids");
        }
        if (at == null) {
            return new ValidationResult(false, "at cannot be empty");
        }
        return new ValidationResult(true, null);
    }

    public static Game factoryFrom(String seasonId, TeamScalation homeTeam, TeamScalation visitorTeam,
            LocalDateTime at) {
        return new Game(
                new ObjectId().toHexString(),
                seasonId,
                homeTeam.getId(),
                homeTeam.getTeamName(),
                homeTeam.getPlayers().stream().map(PlayerSelection::getPlayerId).collect(Collectors.toList()),
                visitorTeam.getId(),
                visitorTeam.getTeamName(),
                visitorTeam.getPlayers().stream().map(PlayerSelection::getPlayerId).collect(Collectors.toList()),
                at);
    }
}
