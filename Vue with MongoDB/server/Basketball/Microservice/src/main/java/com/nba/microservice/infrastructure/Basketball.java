package com.nba.microservice.infrastructure;

public class Basketball {
    private static IBasketballRepo repo;

    public static IBasketballRepo getRepo() {
        return repo;
    }

    public static void setRepo(IBasketballRepo repo) {
        Basketball.repo = repo;
        System.out.println(String.format("Repository is set to %s", repo.getClass().getSimpleName()));
    }
}