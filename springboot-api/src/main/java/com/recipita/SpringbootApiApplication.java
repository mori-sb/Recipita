package com.recipita;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication
@MapperScan("com.recipita.mapper")
public class SpringbootApiApplication {
	public static void main(String[] args) {
		System.out.println("FIREBASE_CREDENTIAL = " + System.getenv("FIREBASE_CREDENTIAL"));
		SpringApplication.run(SpringbootApiApplication.class, args);
	}
}
