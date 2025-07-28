package com.nba.microservice.viewmodels;

import com.nba.microservice.models.ValueObjects.PlayerSelection;
import com.nba.microservice.infrastructure.BasketballViewModel;
import com.nba.microservice.infrastructure.ValidationResult;
import com.fasterxml.jackson.annotation.JsonProperty;

public class PlayerSelectionVM extends BasketballViewModel {
    @JsonProperty("playerId")
    private String playerId;
    @JsonProperty("playerName")
    private String playerName;
    @JsonProperty("jersey")
    private int jersey;

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

    @Override
    public ValidationResult validate() {
        return new ValidationResult(false, "this viewModel cannot be used for write operations");

    }

    public static PlayerSelectionVM factoryFrom(PlayerSelection model) {
        PlayerSelectionVM playerSelectionVM = new PlayerSelectionVM();
        playerSelectionVM.setPlayerId(model.getPlayerId());
        playerSelectionVM.setPlayerName(model.getPlayerName());
        playerSelectionVM.setJersey(model.getJersey());

        return playerSelectionVM;
    }
}