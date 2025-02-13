package com.nba.basketball_microservice.infrastructure;

import java.util.List;
import java.util.function.Function;
import org.bson.conversions.Bson;

public interface IBasketballRepo {

    <T extends BasketballModel> T create(T entity);

    <T extends BasketballModel> T update(T entity);

    <T extends BasketballModel> T getById(String id, Class<T> clazz);

    public <T extends BasketballModel> List<T> get(Class<T> clazz, Bson filter, Function<Class<T>, String> order,
            boolean descending, Integer take);

    void reseed();
}