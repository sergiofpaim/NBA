package com.nba.basketball_microservice.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.nba.basketball_microservice.infrastructure.BasketballModel;
import com.nba.basketball_microservice.infrastructure.ValidationResult;
import java.time.LocalDate;

public class Player extends BasketballModel {
    @JsonProperty("name")
    private String name;
    @JsonProperty("bornOn")
    private LocalDate bornOn;
    @JsonProperty("position")
    private String position;

    public Player() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getBornOn() {
        return bornOn;
    }

    public void setBornOn(LocalDate bornOn) {
        this.bornOn = bornOn;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    @Override
    public ValidationResult validate() {
        if (getId() == null) {
            return new ValidationResult(false, "id cannot be null");
        }

        if (name == null) {
            return new ValidationResult(false, "name cannot be null");
        }

        if (bornOn == null) {
            return new ValidationResult(false, "bornOn cannot be empty");
        }

        if (position == null) {
            return new ValidationResult(false, "position cannot be null");
        }

        return new ValidationResult(true, null);
    }
}
