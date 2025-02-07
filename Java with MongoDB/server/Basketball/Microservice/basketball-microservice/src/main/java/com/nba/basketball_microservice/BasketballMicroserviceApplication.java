package com.nba.basketball_microservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import com.nba.basketball_microservice.infrastructure.Basketball;
import com.nba.basketball_microservice.infrastructure.MongoDBRepo;

@SpringBootApplication
public class BasketballMicroserviceApplication {

	public static void main(String[] args) {
		Basketball.setRepo(new MongoDBRepo());
		SpringApplication.run(BasketballMicroserviceApplication.class, args);
	}
}