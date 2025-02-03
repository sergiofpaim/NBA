package com.nba.basketball_microservice.models.ValueObjects;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.nba.basketball_microservice.infrastructure.ValidationResult;
import com.nba.basketball_microservice.models.Type.PlayType;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;

public class GamePlay {
    private int quarter;
    private String type;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Integer points;

    private Duration at;

    public GamePlay() {
    }

    public GamePlay(int quarter, String type, Integer points, Duration at) {
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
        return Optional.ofNullable(points);
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    public Duration getAt() {
        return at;
    }

    public void setAt(Duration at) {
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
                if (points != null) {
                    return new ValidationResult(false, "points should be null");
                }
                break;
        }

        if (at.isNegative() || at.compareTo(Duration.ofMinutes(15)) > 0) {
            return new ValidationResult(false, "at should be between 0 and 15 minutes");
        }

        return new ValidationResult(true, null);
    }

    public static GamePlay factoryFrom(int quarter, PlayType type, Instant gameAt) {
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

        Duration at = Duration.ofMinutes((Instant.now().toEpochMilli() - gameAt.toEpochMilli()) / 60000 % 15);

        return new GamePlay(quarter, type.toString(), points, at);
    }
}
