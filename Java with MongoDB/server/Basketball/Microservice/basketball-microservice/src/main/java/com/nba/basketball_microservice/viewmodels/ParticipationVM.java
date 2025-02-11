package com.nba.basketball_microservice.viewmodels;

import com.nba.basketball_microservice.models.Participation;
import com.nba.basketball_microservice.models.ValueObjects.GamePlay;
import com.nba.basketball_microservice.infrastructure.BasketballViewModel;
import com.nba.basketball_microservice.infrastructure.ValidationResult;

import java.util.List;

public class ParticipationVM extends BasketballViewModel {

    private String participationId;
    private String gameId;
    private String playerId;
    private List<GamePlay> plays;

    public String getParticipationId() {
        return participationId;
    }

    public void setParticipationId(String participationId) {
        this.participationId = participationId;
    }

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

    public List<GamePlay> getPlays() {
        return plays;
    }

    public void setPlays(List<GamePlay> plays) {
        this.plays = plays;
    }

    @Override
    public ValidationResult validate() {
        return new ValidationResult(false, "this viewModel cannot be used for write operations");
    }

    public static ParticipationVM factoryFrom(Participation model) {
        ParticipationVM participationVM = new ParticipationVM();
        participationVM.setParticipationId(model.getId());
        participationVM.setPlayerId(model.getPlayerId());
        participationVM.setGameId(model.getGameId());
        participationVM.setPlays(model.getPlays());
        return participationVM;
    }
}
