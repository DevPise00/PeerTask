package com.peertask.api.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long skillId;
    private String skillName;
    private String skillLocation;

    private String seekerId;
    private String seekerName;
    private String providerId;
    private String providerName;
    private String providerPhone;

    private String mode; // Barter or Paid
    private String barterOffer;
    private Double amount;
    private String paymentRef; // UPI UTR or Direct Cash note

    private String status = "Pending"; // Pending, Accepted, Declined, Cancelled, Completed
    private boolean seekerConfirmed = false;
    private boolean providerConfirmed = false;

    private boolean reviewed = false;
    private Integer rating;
    private String reviewComment;
    private Instant createdAt = Instant.now();

    public Booking() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getSkillId() { return skillId; }
    public void setSkillId(Long skillId) { this.skillId = skillId; }
    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }
    public String getSkillLocation() { return skillLocation; }
    public void setSkillLocation(String skillLocation) { this.skillLocation = skillLocation; }
    public String getSeekerId() { return seekerId; }
    public void setSeekerId(String seekerId) { this.seekerId = seekerId; }
    public String getSeekerName() { return seekerName; }
    public void setSeekerName(String seekerName) { this.seekerName = seekerName; }
    public String getProviderId() { return providerId; }
    public void setProviderId(String providerId) { this.providerId = providerId; }
    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }
    public String getProviderPhone() { return providerPhone; }
    public void setProviderPhone(String providerPhone) { this.providerPhone = providerPhone; }
    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }
    public String getBarterOffer() { return barterOffer; }
    public void setBarterOffer(String barterOffer) { this.barterOffer = barterOffer; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getPaymentRef() { return paymentRef; }
    public void setPaymentRef(String paymentRef) { this.paymentRef = paymentRef; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public boolean isSeekerConfirmed() { return seekerConfirmed; }
    public void setSeekerConfirmed(boolean seekerConfirmed) { this.seekerConfirmed = seekerConfirmed; }
    public boolean isProviderConfirmed() { return providerConfirmed; }
    public void setProviderConfirmed(boolean providerConfirmed) { this.providerConfirmed = providerConfirmed; }
    public boolean isReviewed() { return reviewed; }
    public void setReviewed(boolean reviewed) { this.reviewed = reviewed; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public String getReviewComment() { return reviewComment; }
    public void setReviewComment(String reviewComment) { this.reviewComment = reviewComment; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}