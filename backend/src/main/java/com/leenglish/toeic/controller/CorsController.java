package com.leenglish.toeic.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class CorsController {
    
    @RequestMapping(
        value = "/uploads/**", 
        method = RequestMethod.OPTIONS
    )
    @CrossOrigin(
        origins = "*",
        methods = {RequestMethod.GET, RequestMethod.HEAD, RequestMethod.OPTIONS},
        allowedHeaders = "*",
        allowCredentials = "false"
    )
    public ResponseEntity<Void> handleUploadsOptions() {
        return ResponseEntity.ok()
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS")
                .header("Access-Control-Allow-Headers", "*")
                .header("Access-Control-Max-Age", "3600")
                .build();
    }
}
