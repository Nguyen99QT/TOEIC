package com.leenglish.toeic.service;

import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.leenglish.toeic.dto.AdminResponseRequest;
import com.leenglish.toeic.dto.ContactDto;
import com.leenglish.toeic.dto.ContactRequest;

public interface ContactService {

    // User operations
    ContactDto createContact(Long userId, ContactRequest request);
    ContactDto updateContact(Long userId, Long contactId, ContactRequest request);
    void deleteContact(Long userId, Long contactId);
    ContactDto getContactById(Long contactId, Long currentUserId);
    Page<ContactDto> getContactByUser(Long userId, Long currentUserId, Pageable pageable);

    // Admin operations
    Page<ContactDto> getAllContact(Long adminId, Pageable pageable);
    Page<ContactDto> getContactByStatus(Long adminId, String status, Pageable pageable);
    Page<ContactDto> getContactByPriority(Long adminId, String priority, Pageable pageable);
    Page<ContactDto> getContactByType(Long adminId, String contactType, Pageable pageable);
    Page<ContactDto> getPendingContact(Long adminId, Pageable pageable);
    Page<ContactDto> getUrgentContact(Long adminId, Pageable pageable);
    Page<ContactDto> getContactNeedingResponse(Long adminId, Pageable pageable);
    ContactDto respondToContact(Long adminId, Long contactId, AdminResponseRequest request);
    ContactDto updateContactStatus(Long adminId, Long contactId, String status);
    Page<ContactDto> searchContact(Long adminId, String searchTerm, Pageable pageable);
    Page<ContactDto> getContactByCriteria(Long adminId, String status, String priority, String contactType, Pageable pageable);

    // Statistics
    Map<String, Object> getContactStatistics(Long adminId);

    // Permission checks
    boolean canUserEditContact(Long userId, Long contactId);
    boolean canUserDeleteContact(Long userId, Long contactId);
    boolean canAdminRespondToContact(Long contactId);
} 