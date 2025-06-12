package com.nba.microservice.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.nba.microservice.infrastructure.BasketballModel;
import com.nba.microservice.infrastructure.ValidationResult;
import com.nba.microservice.models.ValueObjects.PlayerSelection;
import com.nba.microservice.models.ValueObjects.TeamScalation;
import org.bson.types.ObjectId;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class Game extends BasketballModel {
    @JsonProperty("seasonId")
    private String seasonId;
    @JsonProperty("homeTeamId")
    private String homeTeamId;
    @JsonProperty("homeTeamName")
    private String homeTeamName;
    @JsonProperty("homePlayerIds")
    private List<String> homePlayerIds;
    @JsonProperty("visitorTeamId")
    private String visitorTeamId;
    @JsonProperty("visitorTeamName")
    private String visitorTeamName;
    @JsonProperty("visitorPlayerIds")
    private List<String> visitorPlayerIds;
    @JsonProperty("at")
    private Date at;

    public Game() {
    }

    public Game(String id, String seasonId, String homeTeamId, String homeTeamName, List<String> homePlayerIds,
            String visitorTeamId, String visitorTeamName, List<String> visitorPlayerIds, Date at) {
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

    public Date getAt() {
        return at;
    }

    public void setAt(Date at) {
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
            Date at) {
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