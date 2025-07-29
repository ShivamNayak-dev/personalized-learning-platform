package com.smartlearning.platform.model;
import jakarta.persistence.*;

@Entity
@Table(name="courses")
public class Course {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false)
	private String title;
	
	@Column(columnDefinition = "TEXT")
	private String description;
	private String instructor;
	private String duration;
	private String difficulty;
	private Double price;
	private String imageUrl;
	
	public Course() {
		
	}
	
	public Course(String title, String description, String instructor, String duration, String difficulty, Double price, String imageUrl) {
		this.title = title;
        this.description = description;
        this.instructor = instructor;
        this.duration = duration;
        this.difficulty = difficulty;
        this.price = price;
        this.imageUrl = imageUrl;
	}
	
	// Getters and Setters (Generate these if your IDE doesn't do it automatically)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getInstructor() {
        return instructor;
    }

    public void setInstructor(String instructor) {
        this.instructor = instructor;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
	
	
}
