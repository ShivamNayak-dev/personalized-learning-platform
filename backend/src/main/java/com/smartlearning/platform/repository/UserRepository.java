package com.smartlearning.platform.repository;

import com.smartlearning.platform.model.User; // Import our User entity
import org.springframework.data.jpa.repository.JpaRepository; // Import JpaRepository
import java.util.Optional; // Import Optional for safe null handling

// JpaRepository provides CRUD (Create, Read, Update, Delete) operations automatically.
// <User, Long> means this repository works with the User entity and its primary key type is Long.
public interface UserRepository extends JpaRepository<User, Long> {

    // Custom method to find a user by their username (e.g., email)
    // Spring Data JPA automatically generates the implementation for this method
    Optional<User> findByUsername(String username);

    // Custom method to check if a user with a given username already exists
    // Useful for preventing duplicate registrations
    Boolean existsByUsername(String username);
}
