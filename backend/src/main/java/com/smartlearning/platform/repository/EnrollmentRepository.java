package com.smartlearning.platform.repository;

import com.smartlearning.platform.model.Enrollment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
	
	// HIGHLIGHT: NEW METHOD TO FIND ALL ENROLLMENTS FOR A GIVEN USER
    List<Enrollment> findByUserId(Long userId);
    
 // HIGHLIGHT: NEW METHOD TO CHECK FOR DUPLICATE ENROLLMENTS
    Optional<Enrollment> findByUserIdAndCourseId(Long userId, Long courseId);
}
