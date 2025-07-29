package com.smartlearning.platform.controller;

import com.smartlearning.platform.model.Course;
import com.smartlearning.platform.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:5173") // Allow requests from your frontend
public class CourseController {

    private final CourseService courseService;

    @Autowired
    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    // GET all courses
    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        return new ResponseEntity<>(courses, HttpStatus.OK);
    }

    // GET course by ID
    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id)
                .map(course -> new ResponseEntity<>(course, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // CREATE a new course
    @PostMapping
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        Course newCourse = courseService.createCourse(course);
        return new ResponseEntity<>(newCourse, HttpStatus.CREATED);
    }

    // UPDATE an existing course
    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course course) {
        try {
            Course updatedCourse = courseService.updateCourse(id, course);
            return new ResponseEntity<>(updatedCourse, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // DELETE a course
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteCourse(@PathVariable Long id) {
        try {
            courseService.deleteCourse(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content for successful deletion
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
