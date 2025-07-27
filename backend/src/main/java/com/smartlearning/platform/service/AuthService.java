package com.smartlearning.platform.service;

import com.smartlearning.platform.model.User;
import com.smartlearning.platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired; // For dependency injection
import org.springframework.security.crypto.password.PasswordEncoder; // For password hashing
import org.springframework.stereotype.Service; // Marks this class as a Spring Service
import org.springframework.transaction.annotation.Transactional; // For transactional operations
import java.util.Optional; 

@Service // This annotation tells Spring that this is a Service component
public class AuthService {

    private final UserRepository userRepository; // To interact with the database
    private final PasswordEncoder passwordEncoder; // To hash passwords

    // Constructor-based dependency injection: Spring automatically provides instances of UserRepository and PasswordEncoder
    @Autowired // This annotation is optional for constructor injection from Spring 4.3+, but good for clarity
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Method to handle user registration
    @Transactional // Ensures that the entire method runs as a single database transaction
    public User registerUser(String username, String password, String role) {
        // 1. Check if username already exists
        if (userRepository.existsByUsername(username)) {
            // If username exists, throw an exception. We'll handle this in the Controller.
            throw new RuntimeException("Username already taken!");
        }

        // 2. Create a new User object
        User newUser = new User();
        newUser.setUsername(username);
        newUser.setRole(role); // Set the role (e.g., "STUDENT", "ADMIN")

        // 3. Hash the password before saving it to the database
        // NEVER store plain text passwords!
        newUser.setPassword(passwordEncoder.encode(password));

        // 4. Save the new user to the database using the UserRepository
        return userRepository.save(newUser);
    }

    // This method will be implemented later for login validation
    // public User authenticateUser(String username, String password) {
    //     // Logic for authenticating user
    // }
    
    // --- NEW METHOD FOR LOGIN ---
    public User authenticateUser(String username, String password) {
        // 1. Find user by username
        Optional<User> userOptional = userRepository.findByUsername(username);

        // 2. Check if user exists
        if (userOptional.isEmpty()) {
            throw new RuntimeException("Invalid username or password.");
        }

        User user = userOptional.get();

        // 3. Compare provided password with stored hashed password
        // passwordEncoder.matches(rawPassword, encodedPassword) is crucial here
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid username or password.");
        }

        // 4. If credentials are valid, return the user object
        return user;
    }
}
