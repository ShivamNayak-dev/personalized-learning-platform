package com.smartlearning.platform.model;

import jakarta.persistence.*; // Important for JPA annotations
import lombok.Data;         // From Lombok, for getters/setters/etc.
import java.time.LocalDateTime; // For created_at and updated_at timestamps

@Data // Lombok annotation: Automatically generates getters, setters, toString, equals, and hashCode methods
@Entity // JPA annotation: Marks this class as a JPA entity, mapping it to a database table
@Table(name = "users") // Specifies the name of the database table for this entity. Good practice to use plural form.
public class User {

    @Id // JPA annotation: Marks the primary key of the entity
    @GeneratedValue(strategy = GenerationType.IDENTITY) // JPA annotation: Auto-generates ID value using database's identity column feature (e.g., auto-increment in MySQL)
    private Long id; // Unique identifier for the user

    @Column(nullable = false, unique = true) // JPA annotation: Maps to a column. 'nullable=false' means it cannot be empty. 'unique=true' means no two users can have the same username.
    private String username; // User's unique identifier, e.g., email address

    @Column(nullable = false) // 'nullable=false' means password cannot be empty
    private String password; // User's hashed password (NEVER store plain passwords!)

    @Column(nullable = false) // 'nullable=false' means role cannot be empty
    private String role; // User's role (e.g., "STUDENT", "ADMIN")

    @Column(name = "created_at", nullable = false, updatable = false) // 'updatable=false' means this field is set only once upon creation
    private LocalDateTime createdAt; // Timestamp when the user was created

    @Column(name = "updated_at") // This field will be updated whenever the user's data changes
    private LocalDateTime updatedAt; // Timestamp when the user's data was last updated

    // Lombok's @Data annotation takes care of constructors, getters, and setters.
    // However, we'll add a @PrePersist and @PreUpdate for timestamps.

    @PrePersist // JPA annotation: This method is called automatically before an entity is persisted (saved for the first time)
    protected void onCreate() {
        this.createdAt = LocalDateTime.now(); // Set createdAt to current time
        this.updatedAt = LocalDateTime.now(); // Also set updatedAt to current time initially
    }

    @PreUpdate // JPA annotation: This method is called automatically before an entity is updated
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now(); // Update updatedAt to current time
    }
}
