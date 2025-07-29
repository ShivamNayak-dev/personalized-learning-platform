package com.smartlearning.platform.repository;

import com.smartlearning.platform.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    // Spring Data JPA will automatically provide methods like save, findById, findAll, deleteById etc.
    // You can add custom query methods here if needed, e.g., findByTitleContaining
}
