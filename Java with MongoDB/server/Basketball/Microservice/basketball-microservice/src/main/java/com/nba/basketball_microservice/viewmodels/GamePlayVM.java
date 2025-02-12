package com.nba.basketball_microservice.viewmodels;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.nba.basketball_microservice.infrastructure.ValidationResult;
import com.nba.basketball_microservice.models.Type.PlayType;
import com.nba.basketball_microservice.models.ValueObjects.GamePlay;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public class GamePlayVM {
    @JsonProperty("quarter")
    private int quarter;
    @JsonProperty("type")
    private String type;
    @JsonProperty("points")
    private Integer points;
    @JsonProperty("at")
    private String at;

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

    public String getAt() {
        return at;
    }

    public void setAt(String at) {
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

        if (at != null) {
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss.SSSSSSS");
                LocalTime atTime = LocalTime.parse(at, formatter);
                long atMinutes = atTime.getMinute();
                if (atMinutes < 0 || atMinutes > 15) {
                    return new ValidationResult(false, "at should be between 00:00 and 15:00 minutes");
                }
            } catch (Exception e) {
                return new ValidationResult(false, "at is invalid or not in the expected format");
            }
        }

        return new ValidationResult(true, null);
    }

    public static GamePlayVM factoryFrom(GamePlay model) {
        GamePlayVM gamePlayVM = new GamePlayVM();
        gamePlayVM.quarter = model.getQuarter();
        gamePlayVM.type = model.getType();
        gamePlayVM.points = model.getPoints();

        long milliseconds = model.getAt();
        LocalTime time = LocalTime.ofNanoOfDay(milliseconds * 1_000_000);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss.SSSSSSS");
        gamePlayVM.at = time.format(formatter);

        return gamePlayVM;
    }
}
