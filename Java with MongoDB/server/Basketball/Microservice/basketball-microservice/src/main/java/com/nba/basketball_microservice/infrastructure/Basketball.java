package com.nba.basketball_microservice.infrastructure;

public class Basketball {
    private static IBasketballRepo repo;

    public static IBasketballRepo getRepo() {
        return repo;
    }

    public static void setRepo(IBasketballRepo repo) {
        Basketball.repo = repo;
    }
}
