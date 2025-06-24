package com.nba.microservice.viewmodels;

import com.nba.microservice.models.Season;
import com.nba.microservice.infrastructure.BasketballViewModel;
import com.nba.microservice.infrastructure.ValidationResult;

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

    public static SeasonVM factorFrom(Season model) {
        SeasonVM seasonVM = new SeasonVM();
        seasonVM.setId(model.getId());
        return seasonVM;
    }
}