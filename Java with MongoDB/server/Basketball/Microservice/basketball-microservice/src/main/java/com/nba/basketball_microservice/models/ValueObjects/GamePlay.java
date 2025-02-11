package com.nba.basketball_microservice.models.ValueObjects;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.nba.basketball_microservice.infrastructure.ValidationResult;
import com.nba.basketball_microservice.models.Type.PlayType;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class GamePlay {
    @JsonProperty("quarter")
    private int quarter;
    @JsonProperty("type")
    private String type;
    @JsonProperty("points")
    private Integer points;
    @JsonProperty("at")
    private LocalTime at;

    public GamePlay() {
    }

    public GamePlay(int quarter, String type, Integer points, LocalTime at) {
        this.quarter = quarter;
        this.type = type;
        this.points = points;
        this.at = at;
    }

    public int getQuarter() {
        return quarter;
    }

    public void setQuarter(int quarter) {
        this.quarter = quarter;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    public LocalTime getAt() {
        return at;
    }

    public void setAt(LocalTime at) {
        this.at = at;
    }

    public ValidationResult validate() {
        if (quarter <= 0) {
            return new ValidationResult(false, "quarter should be positive");
        }

        PlayType playType;
        try {
            playType = PlayType.valueOf(type);
        } catch (IllegalArgumentException | NullPointerException e) {
            return new ValidationResult(false, "type is invalid");
        }

        switch (playType) {
            case FreeThrowHit:
                if (points == null || points != 1) {
                    return new ValidationResult(false, "points should be 1 for a FreeThrowHit");
                }
                break;
            case TwoPointerHit:
                if (points == null || points != 2) {
                    return new ValidationResult(false, "points should be 2 for a TwoPointerHit");
                }
                break;
            case ThreePointerHit:
                if (points == null || points != 3) {
                    return new ValidationResult(false, "points should be 3 for a ThreePointerHit");
                }
                break;
            default:
                break;
        }

        if (at.isBefore(LocalTime.MIDNIGHT) || at.isAfter(LocalTime.MIDNIGHT.plusMinutes(15))) {
            return new ValidationResult(false, "at should be between 00:00 and 15:00 minutes");
        }

        return new ValidationResult(true, null);
    }

    public static GamePlay factoryFrom(int quarter, PlayType type, LocalDateTime gameAt) {
        Integer points = null;

        switch (type) {
            case FreeThrowHit:
                points = 1;
                break;
            case TwoPointerHit:
                points = 2;
                break;
            case ThreePointerHit:
                points = 3;
                break;
            default:
                break;
        }

        long elapsedMinutes = Duration.between(gameAt, LocalDateTime.now()).toMinutes();
        long minutesInQuarter = elapsedMinutes % 15;

        LocalTime at = LocalTime.of(0, (int) minutesInQuarter);

        return new GamePlay(quarter, type.toString(), points, at);
    }
}
