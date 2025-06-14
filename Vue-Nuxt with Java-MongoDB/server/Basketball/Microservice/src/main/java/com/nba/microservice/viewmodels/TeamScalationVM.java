package com.nba.microservice.viewmodels;

import com.nba.microservice.infrastructure.BasketballViewModel;
import com.nba.microservice.infrastructure.ValidationResult;
import com.nba.microservice.models.ValueObjects.PlayerSelection;
import com.nba.microservice.models.ValueObjects.TeamScalation;
import java.util.List;

public class TeamScalationVM extends BasketballViewModel {

    private String teamId;
    private String teamName;
    private List<PlayerSelection> players;

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

    public List<PlayerSelection> getPlayers() {
        return players;
    }

    public void setPlayers(List<PlayerSelection> players) {
        this.players = players;
    }

    @Override
    public ValidationResult validate() {
        return new ValidationResult(false, "this viewModel cannot be used for write operations");
    }

    public static TeamScalationVM factorFrom(TeamScalation model) {
        TeamScalationVM teamScalationVM = new TeamScalationVM();
        teamScalationVM.setTeamId(model.getId());
        teamScalationVM.setTeamName(model.getTeamName());
        teamScalationVM.setPlayers(model.getPlayers());
        return teamScalationVM;
    }
}