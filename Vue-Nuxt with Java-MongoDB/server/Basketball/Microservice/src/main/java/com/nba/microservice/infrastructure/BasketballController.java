package com.nba.microservice.infrastructure;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BasketballController {

    protected String validationError = null;

    public String getValidationError() {
        return validationError;
    }

    protected <T> ResponseEntity<BasketballResponse<T>> result(BasketballResponse<T> response) {
        if (response.getCode() == 0) {
            return ResponseEntity.ok(response);
        } else if (response.getCode() == 128) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    protected boolean isInvalid(BasketballViewModel request) {
        var validationResult = request.validate();
        validationError = validationResult.getMessage();

        return !validationResult.isSuccess();
    }

    protected <T> ResponseEntity<BasketballResponse<T>> badRequest() {
        return badRequest(validationError);
    }

    protected <T> ResponseEntity<BasketballResponse<T>> badRequest(String message) {
        var response = new BasketballResponse<T>();
        response.setMessage(message);

        return ResponseEntity.badRequest().body(response);
    }
}