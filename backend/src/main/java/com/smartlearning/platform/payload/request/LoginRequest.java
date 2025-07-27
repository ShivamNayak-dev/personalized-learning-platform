package com.smartlearning.platform.payload.request;

import lombok.Data; // For getters/setters

@Data // Lombok annotation for boilerplate code
public class LoginRequest {
    private String username;
    private String password;
}