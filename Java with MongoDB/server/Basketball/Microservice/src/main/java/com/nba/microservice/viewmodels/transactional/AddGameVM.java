package com.nba.microservice.viewmodels.transactional;

import com.nba.microservice.infrastructure.BasketballViewModel;
import com.nba.microservice.infrastructure.ValidationResult;
import java.util.Date;

public class AddGameVM extends BasketballViewModel {

    private String homeTeamId;
    private String visitorTeamId;
    private Date at;

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

    public Date getAt() {
        return at;
    }

    public void setAt(Date at) {
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