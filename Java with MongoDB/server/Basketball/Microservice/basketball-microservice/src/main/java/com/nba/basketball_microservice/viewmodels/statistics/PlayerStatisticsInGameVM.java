package com.nba.basketball_microservice.viewmodels.statistics;

import com.nba.basketball_microservice.infrastructure.BasketballViewModel;
import com.nba.basketball_microservice.infrastructure.ValidationResult;

public class PlayerStatisticsInGameVM extends BasketballViewModel {

    private String type;
    private int count;
    private int points;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    @Override
    public ValidationResult validate() {
        return new ValidationResult(false, "this viewModel cannot be used for write operations");
    }

    public static PlayerStatisticsInGameVM factorFrom(String type, int count, int points) {
        PlayerStatisticsInGameVM vm = new PlayerStatisticsInGameVM();
        vm.setType(type);
        vm.setCount(count);
        vm.setPoints(points);
        return vm;
    }
}