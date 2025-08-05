package com.smartlearning.platform.service;

import com.smartlearning.platform.model.Enrollment;
import com.smartlearning.platform.model.User;
import com.smartlearning.platform.model.Course;
import com.smartlearning.platform.repository.CourseRepository;
import com.smartlearning.platform.repository.EnrollmentRepository;
import com.smartlearning.platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EnrollmentService {

	@Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    // HIGHLIGHT: UPDATED METHOD TO CHECK FOR DUPLICATES
    public Enrollment enrollUserInCourse(Long userId, Long courseId) {
        // First, check if the user is already enrolled in this course
        Optional<Enrollment> existingEnrollment = enrollmentRepository.findByUserIdAndCourseId(userId, courseId);
        if (existingEnrollment.isPresent()) {
            throw new IllegalStateException("User is already enrolled in this course.");
        }

        // Find the user and course, throwing an exception if not found
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new EntityNotFoundException("Course not found with ID: " + courseId));

        // Create and save the new enrollment
        Enrollment enrollment = new Enrollment();
        enrollment.setUser(user);
        enrollment.setCourse(course);
        
        return enrollmentRepository.save(enrollment);
    }
    
 // HIGHLIGHT: NEW METHOD TO GET ALL COURSES FOR A USER
    public List<Course> getEnrolledCoursesByUserId(Long userId) {
        // Find all enrollments for the user
        List<Enrollment> enrollments = enrollmentRepository.findByUserId(userId);

        // Extract the Course objects from the enrollments
        return enrollments.stream()
                .map(Enrollment::getCourse)
                .collect(Collectors.toList());
    }
}