package com.nba.microservice.viewmodels;

import com.nba.microservice.models.Participation;
import com.nba.microservice.models.ValueObjects.GamePlay;
import com.nba.microservice.infrastructure.BasketballViewModel;
import com.nba.microservice.infrastructure.ValidationResult;
import java.util.ArrayList;
import java.util.List;

public class ParticipationVM extends BasketballViewModel {

    private String participationId;
    private String gameId;
    private String playerId;
    private List<GamePlayVM> plays;

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

    public List<GamePlayVM> getPlays() {
        return plays;
    }

    public void setPlays(List<GamePlayVM> plays) {
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

        List<GamePlayVM> gamePlayVMs = new ArrayList<>();
        for (GamePlay play : model.getPlays()) {
            gamePlayVMs.add(GamePlayVM.factoryFrom(play));
        }
        participationVM.setPlays(gamePlayVMs);

        return participationVM;
    }
}