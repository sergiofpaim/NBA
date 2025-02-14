package com.nba.microservice.infrastructure;

public class BasketballService {

    protected static <T> BasketballResponse<T> success(T value, String message) {
        BasketballResponse<T> response = new BasketballResponse<>();
        response.setMessage(message);
        response.setCode(0);
        response.setPayLoad(value);
        return response;
    }

    protected static <T> BasketballResponse<T> notFound(String message) {
        BasketballResponse<T> response = new BasketballResponse<>();
        response.setMessage(message);
        response.setCode(128);
        return response;
    }

    protected static <T> BasketballResponse<T> error(String message) {
        BasketballResponse<T> response = new BasketballResponse<>();
        response.setMessage(message);
        response.setCode(1);
        return response;
    }
}