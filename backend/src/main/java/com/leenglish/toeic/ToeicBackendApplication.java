package com.leenglish.toeic;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ToeicBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(ToeicBackendApplication.class, args);
    }
}
