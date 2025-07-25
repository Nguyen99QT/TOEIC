package com.leenglish.toeic.service.impl;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.leenglish.toeic.domain.Contact;
import com.leenglish.toeic.domain.Contact.ContactType;
import com.leenglish.toeic.domain.Contact.Priority;
import com.leenglish.toeic.domain.Contact.Status;
import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.dto.AdminResponseRequest;
import com.leenglish.toeic.dto.ContactDto;
import com.leenglish.toeic.dto.ContactRequest;
import com.leenglish.toeic.exception.ResourceNotFoundException;
import com.leenglish.toeic.exception.UnauthorizedException;
import com.leenglish.toeic.repository.ContactRepository;
import com.leenglish.toeic.repository.UserRepository;
import com.leenglish.toeic.service.ContactService;

@Service
@Transactional
public class ContactServiceImpl implements ContactService {

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private UserRepository userRepository;

    // User operations
    @Override
    public ContactDto createContact(Long userId, ContactRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Contact contact = new Contact(user, request.getSubject(), request.getContent(), request.getContactType());
        contact.setPriority(request.getPriority());
        contact.setIsAnonymous(request.getIsAnonymous());
        contact.setContactEmail(request.getContactEmail());
        contact.setContactPhone(request.getContactPhone());

        contact = contactRepository.save(contact);
        return convertToDto(contact, userId);
    }

    @Override
    public ContactDto updateContact(Long userId, Long contactId, ContactRequest request) {
        Contact contact = contactRepository.findByIdAndActive(contactId)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));

        if (!contact.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You can only edit your own contact");
        }   

        if (!contact.canBeEdited()) {
            throw new UnauthorizedException("Contact cannot be edited");
        }

        contact.setSubject(request.getSubject());
        contact.setContent(request.getContent());
        contact.setContactType(request.getContactType());
        contact.setPriority(request.getPriority());
        contact.setIsAnonymous(request.getIsAnonymous());
        contact.setContactEmail(request.getContactEmail());
        contact.setContactPhone(request.getContactPhone());

        contact = contactRepository.save(contact);
        return convertToDto(contact, userId);
    }

    @Override
    public void deleteContact(Long userId, Long contactId) {
        Contact contact = contactRepository.findByIdAndActive(contactId)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));

        if (!contact.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You can only delete your own contact");
        }

        if (!contact.canBeDeleted()) {
            throw new UnauthorizedException("Contact cannot be deleted");
        }

        contact.setIsDeleted(true);
        contactRepository.save(contact);
    }

    @Override
    public ContactDto getContactById(Long contactId, Long currentUserId) {
        Contact contact = contactRepository.findByIdAndActive(contactId)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));
        return convertToDto(contact, currentUserId);
    }

    @Override
    public Page<ContactDto> getContactByUser(Long userId, Long currentUserId, Pageable pageable) {
        Page<Contact> contacts = contactRepository.findByUserIdAndActive(userId, pageable);
        return contacts.map(contact -> convertToDto(contact, currentUserId));
    }

    // Admin operations
    @Override
    public Page<ContactDto> getAllContact(Long adminId, Pageable pageable) {
        Page<Contact> contacts = contactRepository.findAllActive(pageable);
        return contacts.map(contact -> convertToDto(contact, adminId));
    }

    @Override
    public Page<ContactDto> getContactByStatus(Long adminId, String status, Pageable pageable) {
        Status statusEnum = Status.valueOf(status.toUpperCase());
        Page<Contact> contacts = contactRepository.findByStatusAndActive(statusEnum, pageable);
        return contacts.map(contact -> convertToDto(contact, adminId));
    }

    @Override
    public Page<ContactDto> getContactByPriority(Long adminId, String priority, Pageable pageable) {
        Priority priorityEnum = Priority.valueOf(priority.toUpperCase());
        Page<Contact> contacts = contactRepository.findByPriorityAndActive(priorityEnum, pageable);
        return contacts.map(contact -> convertToDto(contact, adminId));
    }

    @Override
    public Page<ContactDto> getContactByType(Long adminId, String contactType, Pageable pageable) {
        ContactType type = ContactType.valueOf(contactType.toUpperCase());
        Page<Contact> contacts = contactRepository.findByContactTypeAndActive(type, pageable);
        return contacts.map(contact -> convertToDto(contact, adminId));
    }

    @Override
    public Page<ContactDto> getPendingContact(Long adminId, Pageable pageable) {
        Page<Contact> contacts = contactRepository.findPendingContact(pageable);
        return contacts.map(contact -> convertToDto(contact, adminId));
    }

    @Override
    public Page<ContactDto> getUrgentContact(Long adminId, Pageable pageable) {
        Page<Contact> contacts = contactRepository.findUrgentContact(pageable);
        return contacts.map(contact -> convertToDto(contact, adminId));
    }

    @Override
    public Page<ContactDto> getContactNeedingResponse(Long adminId, Pageable pageable) {
        Page<Contact> contacts = contactRepository.findContactNeedingResponse(pageable);
        return contacts.map(contact -> convertToDto(contact, adminId));
    }

    @Override
    public ContactDto respondToContact(Long adminId, Long contactId, AdminResponseRequest request) {
        Contact contact = contactRepository.findByIdAndActive(contactId)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));

        if (!contact.canBeResponded()) {
            throw new UnauthorizedException("Contact cannot be responded to");
        }

        contact.setAdminResponse(request.getAdminResponse());
        contact.setStatus(Status.valueOf(request.getStatus().toUpperCase()));
        contact.setRespondedBy(adminId);
        contact.setRespondedAt(LocalDateTime.now());

        contact = contactRepository.save(contact);
        return convertToDto(contact, adminId);
    }

    @Override
    public ContactDto updateContactStatus(Long adminId, Long contactId, String status) {
        Contact contact = contactRepository.findByIdAndActive(contactId)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));

        Status statusEnum = Status.valueOf(status.toUpperCase());
        contact.setStatus(statusEnum);

        contact = contactRepository.save(contact);
        return convertToDto(contact, adminId);
    }

    @Override
    public Page<ContactDto> searchContact(Long adminId, String searchTerm, Pageable pageable) {
        Page<Contact> contacts = contactRepository.searchContact(searchTerm, pageable);
        return contacts.map(contact -> convertToDto(contact, adminId));
    }

    @Override
    public Page<ContactDto> getContactByCriteria(Long adminId, String status, String priority, String contactType, Pageable pageable) {
        Status statusEnum = status != null ? Status.valueOf(status.toUpperCase()) : null;
        Priority priorityEnum = priority != null ? Priority.valueOf(priority.toUpperCase()) : null;
        ContactType typeEnum = contactType != null ? ContactType.valueOf(contactType.toUpperCase()) : null;

        Page<Contact> contacts = contactRepository.findByCriteria(statusEnum, priorityEnum, typeEnum, pageable);
        return contacts.map(contact -> convertToDto(contact, adminId));
    }

    @Override
    public Map<String, Object> getContactStatistics(Long adminId) {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalActive", contactRepository.countActiveContact());
        stats.put("pending", contactRepository.countPendingContact());
        stats.put("inProgress", contactRepository.countInProgressContact());
        stats.put("resolved", contactRepository.countResolvedContact());
        stats.put("urgent", contactRepository.countUrgentContact());
        stats.put("needingResponse", contactRepository.countContactNeedingResponse());
        
        return stats;
    }

    @Override
    public boolean canUserEditContact(Long userId, Long contactId) {
        try {
            Contact contact = contactRepository.findByIdAndActive(contactId)
                    .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));
            return contact.getUser().getId().equals(userId) && contact.canBeEdited();
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean canUserDeleteContact(Long userId, Long contactId) {
        try {
            Contact contact = contactRepository.findByIdAndActive(contactId)
                    .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));
            return contact.getUser().getId().equals(userId) && contact.canBeDeleted();
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean canAdminRespondToContact(Long contactId) {
        try {
            Contact contact = contactRepository.findByIdAndActive(contactId)
                    .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));
            return contact.canBeResponded();
        } catch (Exception e) {
            return false;
        }
    }

    // Helper method to convert entity to DTO
    private ContactDto convertToDto(Contact contact, Long currentUserId) {
        ContactDto dto = new ContactDto();
        dto.setId(contact.getId());
        dto.setUserId(contact.getUser().getId());
        dto.setUserName(contact.getUser().getUsername());
        dto.setUserAvatar(contact.getUser().getAvatarUrl());
        dto.setSubject(contact.getSubject());
        dto.setContent(contact.getContent());
        dto.setContactType(contact.getContactType());
        dto.setPriority(contact.getPriority());
        dto.setStatus(contact.getStatus());
        dto.setIsAnonymous(contact.getIsAnonymous());
        dto.setContactEmail(contact.getContactEmail());
        dto.setContactPhone(contact.getContactPhone());
        dto.setAdminResponse(contact.getAdminResponse());
        dto.setRespondedBy(contact.getRespondedBy());
        dto.setRespondedAt(contact.getRespondedAt());
        dto.setIsEdited(contact.getIsEdited());
        dto.setEditedAt(contact.getEditedAt());
        dto.setIsDeleted(contact.getIsDeleted());
        dto.setDeletedAt(contact.getDeletedAt());
        dto.setCreatedAt(contact.getCreatedAt());
        dto.setUpdatedAt(contact.getUpdatedAt());
        
        // Set permission flags
        if (currentUserId != null) {
            dto.setCanEdit(canUserEditContact(currentUserId, contact.getId()));
            dto.setCanDelete(canUserDeleteContact(currentUserId, contact.getId()));
            dto.setCanRespond(canAdminRespondToContact(contact.getId()));
        }
        
        return dto;
    }
} 