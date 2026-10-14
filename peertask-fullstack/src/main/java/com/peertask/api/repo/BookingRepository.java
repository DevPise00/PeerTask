package com.peertask.api.repo;

import com.peertask.api.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findBySeekerIdOrProviderIdOrderByCreatedAtDesc(String seekerId, String providerId);
}