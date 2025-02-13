package com.nba.basketball_microservice.viewmodels.transactional;

import com.nba.basketball_microservice.models.Type.PlayType;
import com.nba.basketball_microservice.infrastructure.BasketballViewModel;
import com.nba.basketball_microservice.infrastructure.ValidationResult;

public class AddPlayVM extends BasketballViewModel {

    private String gameId;
    private String playerId;
    private int quarter;
    private String type;

    public String getGameId() {
        return gameId;
    }

    public void setGameId(String gameId) {
        this.gameId = gameId;
    }

    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
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

    @Override
    public ValidationResult validate() {
        if (gameId == null) {
            return new ValidationResult(false, "gameId cannot be null");
        }

        if (playerId == null) {
            return new ValidationResult(false, "playerId cannot be null");
        }

        if (quarter <= 0) {
            return new ValidationResult(false, "quarter should be positive");
        }

        try {
            PlayType.valueOf(type);
        } catch (IllegalArgumentException e) {
            return new ValidationResult(false, "type is invalid");
        }

        return new ValidationResult(true, null);
    }
}