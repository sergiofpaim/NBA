package com.nba.basketball_microservice.infrastructure;

import java.util.List;
import java.util.function.Function;

import org.bson.conversions.Bson;

import java.util.concurrent.CompletableFuture;

public interface IBasketballRepo {

    <T extends BasketballModel> CompletableFuture<T> createAsync(T entity);

    <T extends BasketballModel> CompletableFuture<T> updateAsync(T entity);

    <T extends BasketballModel> T getById(String id, Class<T> clazz);

    public <T extends BasketballModel> List<T> get(Class<T> clazz, Bson filter, Function<Class<T>, String> order,
            boolean descending, Integer take);

    CompletableFuture<Void> reseedAsync();
}
