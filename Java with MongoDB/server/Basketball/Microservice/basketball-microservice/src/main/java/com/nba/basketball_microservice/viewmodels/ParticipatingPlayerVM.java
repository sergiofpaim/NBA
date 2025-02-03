package com.nba.basketball_microservice.viewmodels;

import com.nba.basketball_microservice.models.Participation;
import com.nba.basketball_microservice.models.ValueObjects.GamePlay;
import com.nba.basketball_microservice.infrastructure.BasketballViewModel;
import com.nba.basketball_microservice.infrastructure.ValidationResult;

import java.util.List;

public class ParticipatingPlayerVM extends BasketballViewModel {

    private String playerId;
    private String playerName;
    private String participationId;
    private String teamId;
    private String teamName;
    private List<GamePlay> plays;

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

    public String getParticipationId() {
        return participationId;
    }

    public void setParticipationId(String participationId) {
        this.participationId = participationId;
    }

    public String getTeamId() {
        return teamId;
    }

    public void setTeamId(String teamId) {
        this.teamId = teamId;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
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

    public static ParticipatingPlayerVM fromParticipation(Participation model) {
        ParticipatingPlayerVM playerVM = new ParticipatingPlayerVM();
        playerVM.setPlayerId(model.getPlayerId());
        playerVM.setPlayerName(model.getPlayerName());
        playerVM.setParticipationId(model.getId());
        playerVM.setTeamId(model.getTeamId());
        playerVM.setTeamName(model.getTeamName());
        playerVM.setPlays(model.getPlays());
        return playerVM;
    }
}
