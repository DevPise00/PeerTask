package com.peertask.api.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "skills")
public class Skill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;
    private String location;
    private String offerType; // Barter, Paid, Both
    private Double price;     // For Paid or Both
    private String details;

    private String ownerId;
    private String ownerName;
    private String ownerPhone;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String ownerPhoto;

    private double ratingSum = 0.0;
    private int reviewCount = 0;
    private Instant createdAt = Instant.now();

    public Skill() {}

    public double getAvgRating() {
        return reviewCount == 0 ? 0.0 : Math.round((ratingSum / reviewCount) * 10.0) / 10.0;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getOfferType() { return offerType; }
    public void setOfferType(String offerType) { this.offerType = offerType; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    public String getOwnerId() { return ownerId; }
    public void setOwnerId(String ownerId) { this.ownerId = ownerId; }
    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }
    public String getOwnerPhone() { return ownerPhone; }
    public void setOwnerPhone(String ownerPhone) { this.ownerPhone = ownerPhone; }
    public String getOwnerPhoto() { return ownerPhoto; }
    public void setOwnerPhoto(String ownerPhoto) { this.ownerPhoto = ownerPhoto; }
    public double getRatingSum() { return ratingSum; }
    public void setRatingSum(double ratingSum) { this.ratingSum = ratingSum; }
    public int getReviewCount() { return reviewCount; }
    public void setReviewCount(int reviewCount) { this.reviewCount = reviewCount; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}