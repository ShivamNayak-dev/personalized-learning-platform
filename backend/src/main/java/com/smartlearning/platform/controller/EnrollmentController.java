package com.smartlearning.platform.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.smartlearning.platform.model.Enrollment;
import com.smartlearning.platform.model.User;
import com.smartlearning.platform.repository.UserRepository;
import com.smartlearning.platform.model.Course;
import com.smartlearning.platform.service.EnrollmentService;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/{courseId}")
    public ResponseEntity<?> enrollUser(@PathVariable Long courseId, @AuthenticationPrincipal UserDetails userDetails) {
        Optional<User> optionalUser = userRepository.findByUsername(userDetails.getUsername());
        
        if (optionalUser.isEmpty()) {
            return new ResponseEntity<>("User not found.", HttpStatus.NOT_FOUND);
        }
        
        User user = optionalUser.get();
        
        try {
            Enrollment enrollment = enrollmentService.enrollUserInCourse(user.getId(), courseId);
            return new ResponseEntity<>(enrollment, HttpStatus.CREATED);
        } catch (EntityNotFoundException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>("An unexpected error occurred: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // HIGHLIGHT: NEW GET ENDPOINT TO FETCH A USER'S ENROLLED COURSES
    @GetMapping("/my-courses")
    public ResponseEntity<?> getEnrolledCourses(@AuthenticationPrincipal UserDetails userDetails) {
        Optional<User> optionalUser = userRepository.findByUsername(userDetails.getUsername());

        if (optionalUser.isEmpty()) {
            return new ResponseEntity<>("User not found.", HttpStatus.NOT_FOUND);
        }

        User user = optionalUser.get();
        List<Course> courses = enrollmentService.getEnrolledCoursesByUserId(user.getId());
        
        return ResponseEntity.ok(courses);
    }
}