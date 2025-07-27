package com.smartlearning.platform.controller;

import com.smartlearning.platform.model.User;
import com.smartlearning.platform.payload.request.LoginRequest;
import com.smartlearning.platform.security.jwt.JwtUtil; // NEW IMPORT
import com.smartlearning.platform.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil; // NEW FIELD FOR JWT UTIL

    // Modified constructor to inject JwtUtil
    @Autowired
    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil; // Initialize jwtUtil
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User registrationRequest) {
        try {
            User registeredUser = authService.registerUser(
                registrationRequest.getUsername(),
                registrationRequest.getPassword(),
                "STUDENT"
            );
            return new ResponseEntity<>("User registered successfully with username: " + registeredUser.getUsername(), HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            User authenticatedUser = authService.authenticateUser(
                loginRequest.getUsername(),
                loginRequest.getPassword()
            );
            // Generate JWT upon successful authentication
            String jwt = jwtUtil.generateJwtToken(authenticatedUser.getUsername());
            // Return the JWT in the response
            return ResponseEntity.ok(jwt); // Return 200 OK with the JWT string as body
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }
    
 // --- TEMPORARY TEST ENDPOINT (REMOVE AFTER VERIFICATION) ---
    @GetMapping("/test/protected")
    public ResponseEntity<String> testProtectedEndpoint() {
        return ResponseEntity.ok("This is a protected resource! You are authenticated.");
    }
}