package com.nba.basketball_microservice.viewmodels.transactional;

import com.nba.basketball_microservice.infrastructure.BasketballViewModel;
import com.nba.basketball_microservice.infrastructure.ValidationResult;
import java.time.LocalDateTime;

public class AddGameVM extends BasketballViewModel {

    private String homeTeamId;
    private String visitorTeamId;
    private LocalDateTime at;

    public String getHomeTeamId() {
        return homeTeamId;
    }

    public void setHomeTeamId(String homeTeamId) {
        this.homeTeamId = homeTeamId;
    }

    public String getVisitorTeamId() {
        return visitorTeamId;
    }

    public void setVisitorTeamId(String visitorTeamId) {
        this.visitorTeamId = visitorTeamId;
    }

    public LocalDateTime getAt() {
        return at;
    }

    public void setAt(LocalDateTime at) {
        this.at = at;
    }

    @Override
    public ValidationResult validate() {
        if (homeTeamId == null) {
            return new ValidationResult(false, "homeTeamId cannot be null");
        }

        if (visitorTeamId == null) {
            return new ValidationResult(false, "visitorTeamId cannot be null");
        }

        if (homeTeamId.equals(visitorTeamId)) {
            return new ValidationResult(false, "The teams cannot be the same");
        }

        if (at == null) {
            return new ValidationResult(false, "at cannot be empty");
        }

        return new ValidationResult(true, null);
    }
}
