package com.nba.basketball_microservice.models.ValueObjects;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.nba.basketball_microservice.infrastructure.ValidationResult;
import com.nba.basketball_microservice.models.Type.PlayType;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalTime;
import java.util.Optional;

public class GamePlay {
    @JsonProperty("quarter")
    private int quarter;
    @JsonProperty("type")
    private String type;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("points")
    private Optional<Integer> points = Optional.empty();
    @JsonProperty("at")
    private LocalTime at;

    public GamePlay(int quarter, String type, Optional<Integer> points, LocalTime at) {
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

    public Optional<Integer> getPoints() {
        return points;
    }

    public void setPoints(Optional<Integer> points) {
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
                if (points.orElse(0) != 1) {
                    return new ValidationResult(false, "points should be 1 for a FreeThrowHit");
                }
                break;
            case TwoPointerHit:
                if (points.orElse(0) != 2) {
                    return new ValidationResult(false, "points should be 2 for a TwoPointerHit");
                }
                break;
            case ThreePointerHit:
                if (points.orElse(0) != 3) {
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

    public static GamePlay factoryFrom(int quarter, PlayType type, Instant gameAt) {
        Optional<Integer> points = Optional.empty();

        switch (type) {
            case FreeThrowHit:
                points = Optional.of(1);
                break;
            case TwoPointerHit:
                points = Optional.of(2);
                break;
            case ThreePointerHit:
                points = Optional.of(3);
                break;
            default:
                break;
        }

        Duration durationAt = Duration.ofMinutes((Instant.now().toEpochMilli() - gameAt.toEpochMilli()) / 60000 % 15);
        LocalTime at = LocalTime.ofSecondOfDay(durationAt.getSeconds());

        return new GamePlay(quarter, type.toString(), points, at);
    }
}
