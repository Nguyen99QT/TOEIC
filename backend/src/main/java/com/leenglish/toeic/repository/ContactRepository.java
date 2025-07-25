package com.leenglish.toeic.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.leenglish.toeic.domain.Contact;
import com.leenglish.toeic.domain.Contact.ContactType;
import com.leenglish.toeic.domain.Contact.Priority;
import com.leenglish.toeic.domain.Contact.Status;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {

    // Find all active contact
    @Query("SELECT c FROM Contact c WHERE c.isDeleted = false ORDER BY c.createdAt DESC")
    Page<Contact> findAllActive(Pageable pageable);

    // Find contact by ID and check if active
    @Query("SELECT c FROM Contact c WHERE c.id = :id AND c.isDeleted = false")
    Optional<Contact> findByIdAndActive(@Param("id") Long id);

    // Find contact by user
    @Query("SELECT c FROM Contact c WHERE c.user.id = :userId AND c.isDeleted = false ORDER BY c.createdAt DESC")
    Page<Contact> findByUserIdAndActive(@Param("userId") Long userId, Pageable pageable);

    // Find contact by status
    @Query("SELECT c FROM Contact c WHERE c.status = :status AND c.isDeleted = false ORDER BY c.createdAt DESC")
    Page<Contact> findByStatusAndActive(@Param("status") Status status, Pageable pageable);

    // Find contact by priority
    @Query("SELECT c FROM Contact c WHERE c.priority = :priority AND c.isDeleted = false ORDER BY c.createdAt DESC")
    Page<Contact> findByPriorityAndActive(@Param("priority") Priority priority, Pageable pageable);

    // Find contact by type
    @Query("SELECT c FROM Contact c WHERE c.contactType = :contactType AND c.isDeleted = false ORDER BY c.createdAt DESC")
    Page<Contact> findByContactTypeAndActive(@Param("contactType") ContactType contactType, Pageable pageable);

    // Find pending contact
    @Query("SELECT c FROM Contact c WHERE c.status = 'PENDING' AND c.isDeleted = false ORDER BY c.priority DESC, c.createdAt ASC")
    Page<Contact> findPendingContact(Pageable pageable);

    // Find urgent contact
    @Query("SELECT c FROM Contact c WHERE c.priority = 'URGENT' AND c.isDeleted = false ORDER BY c.createdAt ASC")
    Page<Contact> findUrgentContact(Pageable pageable);

    // Find high priority contact
    @Query("SELECT c FROM Contact c WHERE c.priority IN ('HIGH', 'URGENT') AND c.isDeleted = false ORDER BY c.priority DESC, c.createdAt ASC")
    Page<Contact> findHighPriorityContact(Pageable pageable);

    // Find contact needing response
    @Query("SELECT c FROM Contact c WHERE c.adminResponse IS NULL AND c.status IN ('PENDING', 'IN_PROGRESS') AND c.isDeleted = false ORDER BY c.priority DESC, c.createdAt ASC")
    Page<Contact> findContactNeedingResponse(Pageable pageable);

    // Find contact with admin response
    @Query("SELECT c FROM Contact c WHERE c.adminResponse IS NOT NULL AND c.isDeleted = false ORDER BY c.respondedAt DESC")
    Page<Contact> findContactWithResponse(Pageable pageable);

    // Find contact without admin response
    @Query("SELECT c FROM Contact c WHERE c.adminResponse IS NULL AND c.isDeleted = false ORDER BY c.priority DESC, c.createdAt ASC")
    Page<Contact> findContactWithoutResponse(Pageable pageable);

    // Find contact by admin who responded
    @Query("SELECT c FROM Contact c WHERE c.respondedBy = :adminId AND c.isDeleted = false ORDER BY c.respondedAt DESC")
    Page<Contact> findByRespondedBy(@Param("adminId") Long adminId, Pageable pageable);

    // Find recent contact
    @Query("SELECT c FROM Contact c WHERE c.isDeleted = false ORDER BY c.createdAt DESC")
    List<Contact> findRecentContact(@Param("limit") int limit);

    // Search contact by subject or content
    @Query("SELECT c FROM Contact c WHERE c.isDeleted = false AND (c.subject LIKE %:searchTerm% OR c.content LIKE %:searchTerm%) ORDER BY c.createdAt DESC")
    Page<Contact> searchContact(@Param("searchTerm") String searchTerm, Pageable pageable);

    // Find contact by multiple criteria
    @Query("SELECT c FROM Contact c WHERE c.isDeleted = false " +
           "AND (:status IS NULL OR c.status = :status) " +
           "AND (:priority IS NULL OR c.priority = :priority) " +
           "AND (:contactType IS NULL OR c.contactType = :contactType) " +
           "ORDER BY c.priority DESC, c.createdAt DESC")
    Page<Contact> findByCriteria(@Param("status") Status status, 
                                 @Param("priority") Priority priority, 
                                 @Param("contactType") ContactType contactType, 
                                 Pageable pageable);

    // Statistics queries
    @Query("SELECT COUNT(c) FROM Contact c WHERE c.isDeleted = false")
    long countActiveContact();

    @Query("SELECT COUNT(c) FROM Contact c WHERE c.status = 'PENDING' AND c.isDeleted = false")
    long countPendingContact();

    @Query("SELECT COUNT(c) FROM Contact c WHERE c.status = 'IN_PROGRESS' AND c.isDeleted = false")
    long countInProgressContact();

    @Query("SELECT COUNT(c) FROM Contact c WHERE c.status = 'RESOLVED' AND c.isDeleted = false")
    long countResolvedContact();

    @Query("SELECT COUNT(c) FROM Contact c WHERE c.priority = 'URGENT' AND c.isDeleted = false")
    long countUrgentContact();

    @Query("SELECT COUNT(c) FROM Contact c WHERE c.adminResponse IS NULL AND c.isDeleted = false")
    long countContactNeedingResponse();
} 