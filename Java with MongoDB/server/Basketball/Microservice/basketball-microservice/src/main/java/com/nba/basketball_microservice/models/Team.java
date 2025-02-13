package com.nba.basketball_microservice.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.nba.basketball_microservice.infrastructure.BasketballModel;
import com.nba.basketball_microservice.infrastructure.ValidationResult;

public class Team extends BasketballModel {
    @JsonProperty("name")
    private String name;
    @JsonProperty("state")
    private String state;
    @JsonProperty("city")
    private String city;
    @JsonProperty("stadium")
    private String stadium;
    @JsonProperty("conference")
    private String conference;

    public Team() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStadium() {
        return stadium;
    }

    public void setStadium(String stadium) {
        this.stadium = stadium;
    }

    public String getConference() {
        return conference;
    }

    public void setConference(String conference) {
        this.conference = conference;
    }

    @Override
    public ValidationResult validate() {
        if (getId() == null) {
            return new ValidationResult(false, "id cannot be null");
        }

        if (name == null) {
            return new ValidationResult(false, "name cannot be null");
        }

        if (state == null) {
            return new ValidationResult(false, "state cannot be null");
        }

        if (city == null) {
            return new ValidationResult(false, "city cannot be null");
        }

        if (stadium == null) {
            return new ValidationResult(false, "stadium cannot be null");
        }

        if (conference == null) {
            return new ValidationResult(false, "conference cannot be null");
        }

        return new ValidationResult(true, null);
    }
}