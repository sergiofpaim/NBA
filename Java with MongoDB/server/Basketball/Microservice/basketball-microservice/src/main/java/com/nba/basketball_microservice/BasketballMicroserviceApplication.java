package com.nba.basketball_microservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.nba.basketball_microservice.infrastructure.Basketball;
import com.nba.basketball_microservice.infrastructure.MongoDBRepo;

@SpringBootApplication
public class BasketballMicroserviceApplication {

	public static void main(String[] args) {
		// Initialize the repository
		Basketball.setRepo(new MongoDBRepo());
		System.out.println("Repository is set to MongoDBRepo");

		// Start the Spring Boot application
		SpringApplication.run(BasketballMicroserviceApplication.class, args);
	}
}
