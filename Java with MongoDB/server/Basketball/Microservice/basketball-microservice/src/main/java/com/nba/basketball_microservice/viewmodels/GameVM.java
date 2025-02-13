package com.nba.basketball_microservice.viewmodels;

import com.nba.basketball_microservice.models.Game;
import com.nba.basketball_microservice.infrastructure.BasketballViewModel;
import com.nba.basketball_microservice.infrastructure.ValidationResult;
import java.util.Date;

public class GameVM extends BasketballViewModel {

    private String id;
    private String homeTeamId;
    private String homeTeamName;
    private String visitorTeamId;
    private String visitorTeamName;
    private Date at;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getHomeTeamId() {
        return homeTeamId;
    }

    public void setHomeTeamId(String homeTeamId) {
        this.homeTeamId = homeTeamId;
    }

    public String getHomeTeamName() {
        return homeTeamName;
    }

    public void setHomeTeamName(String homeTeamName) {
        this.homeTeamName = homeTeamName;
    }

    public String getVisitorTeamId() {
        return visitorTeamId;
    }

    public void setVisitorTeamId(String visitorTeamId) {
        this.visitorTeamId = visitorTeamId;
    }

    public String getVisitorTeamName() {
        return visitorTeamName;
    }

    public void setVisitorTeamName(String visitorTeamName) {
        this.visitorTeamName = visitorTeamName;
    }

    public Date getAt() {
        return at;
    }

    public void setAt(Date at) {
        this.at = at;
    }

    @Override
    public ValidationResult validate() {
        return new ValidationResult(false, "this viewModel cannot be used for write operations");
    }

    public static GameVM factorFrom(Game model) {
        GameVM gameVM = new GameVM();
        gameVM.setId(model.getId());
        gameVM.setHomeTeamId(model.getHomeTeamId());
        gameVM.setHomeTeamName(model.getHomeTeamName());
        gameVM.setVisitorTeamId(model.getVisitorTeamId());
        gameVM.setVisitorTeamName(model.getVisitorTeamName());
        gameVM.setAt(model.getAt());
        return gameVM;
    }
}