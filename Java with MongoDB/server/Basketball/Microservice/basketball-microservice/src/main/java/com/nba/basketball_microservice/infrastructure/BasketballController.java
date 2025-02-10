package com.nba.basketball_microservice.infrastructure;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BasketballController {

    protected String validationError = null;

    public String getValidationError() {
        return validationError;
    }

    protected <T> ResponseEntity<Object> result(BasketballResponse<T> response) {
        if (response.getCode() == 0) {
            return ResponseEntity.ok().body(new Object() {
                public final String message = response.getMessage();
                public final T payLoad = response.getPayLoad();
            });
        } else if (response.getCode() == 128) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response.getMessage());
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response.getMessage());
        }
    }

    protected boolean isInvalid(BasketballViewModel request) {
        var validationResult = request.validate();
        validationError = validationResult.getMessage();

        return !validationResult.isSuccess();
    }
}
