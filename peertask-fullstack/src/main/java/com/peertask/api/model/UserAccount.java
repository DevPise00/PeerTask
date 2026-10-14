package com.peertask.api.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class UserAccount {
    @Id
    private String id; // e.g., "u_9876543210"

    @Column(unique = true, nullable = false)
    private String phone;

    private String name;
    private String area;
    private boolean otpVerified;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String livePhotoBase64;

    private Instant lastLoginAt;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<Integer> trustHistory = new ArrayList<>();

    public UserAccount() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }
    public boolean isOtpVerified() { return otpVerified; }
    public void setOtpVerified(boolean otpVerified) { this.otpVerified = otpVerified; }
    public String getLivePhotoBase64() { return livePhotoBase64; }
    public void setLivePhotoBase64(String livePhotoBase64) { this.livePhotoBase64 = livePhotoBase64; }
    public Instant getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(Instant lastLoginAt) { this.lastLoginAt = lastLoginAt; }
    public List<Integer> getTrustHistory() { return trustHistory; }
    public void setTrustHistory(List<Integer> trustHistory) { this.trustHistory = trustHistory; }
}