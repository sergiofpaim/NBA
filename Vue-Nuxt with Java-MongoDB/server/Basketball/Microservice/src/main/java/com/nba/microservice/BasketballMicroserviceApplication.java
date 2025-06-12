package com.nba.microservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import com.nba.microservice.infrastructure.Basketball;
import com.nba.microservice.infrastructure.MongoDBRepo;

@SpringBootApplication
public class BasketballMicroserviceApplication {

	public static void main(String[] args) {
		Basketball.setRepo(new MongoDBRepo());
		SpringApplication.run(BasketballMicroserviceApplication.class, args);
	}
}