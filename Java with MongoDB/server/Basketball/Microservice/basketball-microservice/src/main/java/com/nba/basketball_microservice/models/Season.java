package com.nba.basketball_microservice.models;

import com.nba.basketball_microservice.infrastructure.BasketballModel;
import com.nba.basketball_microservice.infrastructure.ValidationResult;
import com.nba.basketball_microservice.models.ValueObjects.TeamScalation;

import java.util.List;

public class Season extends BasketballModel {
    private List<TeamScalation> teams;

    public List<TeamScalation> getTeams() {
        return teams;
    }

    public void setTeams(List<TeamScalation> teams) {
        this.teams = teams;
    }

    @Override
    public ValidationResult validate() {
        if (getId() == null) {
            return new ValidationResult(false, "id cannot be null");
        }

        if (teams == null) {
            return new ValidationResult(false, "teams cannot be null");
        }

        for (TeamScalation team : teams) {
            ValidationResult result = team.validate();
            if (!result.isSuccess()) {
                return new ValidationResult(false,
                        "team of id '" + team.getId() + "' is invalid due to '" + result.getMessage() + "'");
            }
        }

        return new ValidationResult(true, null);
    }
}
