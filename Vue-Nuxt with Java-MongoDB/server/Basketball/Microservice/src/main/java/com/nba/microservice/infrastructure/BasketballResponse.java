package com.nba.microservice.infrastructure;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class BasketballResponse<T> {

    @JsonIgnore
    private int code;

    private String message;

    private T payLoad;

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getPayLoad() {
        return payLoad;
    }

    public void setPayLoad(T payLoad) {
        this.payLoad = payLoad;
    }
}