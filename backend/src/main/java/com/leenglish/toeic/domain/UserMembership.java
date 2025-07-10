package com.leenglish.toeic.domain;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "user_memberships")
public class UserMembership {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "membership_plan_id", nullable = false)
    private MembershipPlan membershipPlan;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Column(name = "status", nullable = false)
    private String status = "ACTIVE"; // ACTIVE, EXPIRED, CANCELLED, SUSPENDED

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "payment_status")
    private String paymentStatus; // PAID, PENDING, FAILED, REFUNDED

    @Column(name = "auto_renew")
    private Boolean autoRenew = false;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @Column(name = "cancellation_reason")
    private String cancellationReason;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public UserMembership() {
    }

    public UserMembership(User user, MembershipPlan membershipPlan, LocalDate startDate, LocalDate endDate) {
        this.user = user;
        this.membershipPlan = membershipPlan;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = "ACTIVE";
        this.isActive = true;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public MembershipPlan getMembershipPlan() {
        return membershipPlan;
    }

    public void setMembershipPlan(MembershipPlan membershipPlan) {
        this.membershipPlan = membershipPlan;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
        this.updatedAt = LocalDateTime.now();
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
        this.updatedAt = LocalDateTime.now();
    }

    public Boolean getAutoRenew() {
        return autoRenew;
    }

    public void setAutoRenew(Boolean autoRenew) {
        this.autoRenew = autoRenew;
        this.updatedAt = LocalDateTime.now();
    }

    public LocalDateTime getCancelledAt() {
        return cancelledAt;
    }

    public void setCancelledAt(LocalDateTime cancelledAt) {
        this.cancelledAt = cancelledAt;
    }

    public String getCancellationReason() {
        return cancellationReason;
    }

    public void setCancellationReason(String cancellationReason) {
        this.cancellationReason = cancellationReason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Business Logic Methods
    public boolean isActive() {
        return "ACTIVE".equals(status) && isActive != null && isActive && !isExpired();
    }

    public boolean isExpired() {
        return endDate != null && endDate.isBefore(LocalDate.now());
    }

    public boolean isCancelled() {
        return "CANCELLED".equals(status);
    }

    public boolean isSuspended() {
        return "SUSPENDED".equals(status);
    }

    public boolean isPaid() {
        return "PAID".equals(paymentStatus);
    }

    public long getDaysRemaining() {
        if (endDate == null || isExpired())
            return 0;
        return ChronoUnit.DAYS.between(LocalDate.now(), endDate);
    }

    public long getTotalDuration() {
        if (startDate == null || endDate == null)
            return 0;
        return ChronoUnit.DAYS.between(startDate, endDate);
    }

    public long getDaysUsed() {
        if (startDate == null)
            return 0;
        LocalDate current = LocalDate.now();
        if (current.isBefore(startDate))
            return 0;
        if (endDate != null && current.isAfter(endDate)) {
            return ChronoUnit.DAYS.between(startDate, endDate);
        }
        return ChronoUnit.DAYS.between(startDate, current);
    }

    public double getUsagePercentage() {
        long total = getTotalDuration();
        if (total == 0)
            return 0.0;
        return (double) getDaysUsed() / total * 100;
    }

    public boolean isNearExpiry(int daysThreshold) {
        return getDaysRemaining() <= daysThreshold && getDaysRemaining() > 0;
    }

    public void cancel(String reason) {
        this.status = "CANCELLED";
        this.isActive = false;
        this.cancelledAt = LocalDateTime.now();
        this.cancellationReason = reason;
        this.autoRenew = false;
        this.updatedAt = LocalDateTime.now();
    }

    public void suspend() {
        this.status = "SUSPENDED";
        this.isActive = false;
        this.updatedAt = LocalDateTime.now();
    }

    public void reactivate() {
        if (!isExpired()) {
            this.status = "ACTIVE";
            this.isActive = true;
            this.updatedAt = LocalDateTime.now();
        }
    }

    public void expire() {
        this.status = "EXPIRED";
        this.isActive = false;
        this.autoRenew = false;
        this.updatedAt = LocalDateTime.now();
    }

    public boolean canRenew() {
        return !isCancelled() && (isExpired() || isNearExpiry(7));
    }

    public LocalDate calculateRenewalDate() {
        if (membershipPlan == null)
            return null;
        LocalDate baseDate = isExpired() ? LocalDate.now() : endDate;
        return baseDate.plusDays(membershipPlan.getDurationInDays());
    }

    // Lifecycle Methods
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (isActive == null)
            isActive = true;
        if (autoRenew == null)
            autoRenew = false;
        if (status == null)
            status = "ACTIVE";
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();

        // Auto-expire if end date has passed
        if (isExpired() && "ACTIVE".equals(status)) {
            expire();
        }
    }
}
