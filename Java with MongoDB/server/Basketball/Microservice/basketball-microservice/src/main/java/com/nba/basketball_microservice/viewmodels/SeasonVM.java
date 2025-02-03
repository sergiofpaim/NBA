package com.nba.basketball_microservice.viewmodels;

import com.nba.basketball_microservice.models.Season;
import com.nba.basketball_microservice.infrastructure.BasketballViewModel;
import com.nba.basketball_microservice.infrastructure.ValidationResult;

public class SeasonVM extends BasketballViewModel {

    private String id;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Override
    public ValidationResult validate() {
        return new ValidationResult(false, "this viewModel cannot be used for write operations");
    }

    public static SeasonVM fromSeason(Season model) {
        SeasonVM seasonVM = new SeasonVM();
        seasonVM.setId(model.getId());
        return seasonVM;
    }
}
