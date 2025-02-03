package com.nba.basketball_microservice.infrastructure;

public abstract class BasketballModel {

    private String id;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public abstract ValidationResult validate();
}
