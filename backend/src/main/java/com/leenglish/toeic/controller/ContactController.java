package com.leenglish.toeic.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.dto.AdminResponseRequest;
import com.leenglish.toeic.dto.ApiResponse;
import com.leenglish.toeic.dto.ContactDto;
import com.leenglish.toeic.dto.ContactRequest;
import com.leenglish.toeic.service.ContactService;
import com.leenglish.toeic.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private ContactService contactService;

    @Autowired
    private UserService userService;

    // User operations
    @PostMapping
    public ResponseEntity<ApiResponse<ContactDto>> createContact(
            @Valid @RequestBody ContactRequest request,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        ContactDto contact = contactService.createContact(user.getId(), request);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.successWithData(contact, "Contact submitted successfully"));
    }

    @PutMapping("/{contactId}")
    public ResponseEntity<ApiResponse<ContactDto>> updateContact(
            @PathVariable Long contactId,
            @Valid @RequestBody ContactRequest request,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        ContactDto contact = contactService.updateContact(user.getId(), contactId, request);
        
        return ResponseEntity.ok(ApiResponse.successWithData(contact, "Contact updated successfully"));
    }

    @DeleteMapping("/{contactId}")
    public ResponseEntity<ApiResponse<Void>> deleteContact(
            @PathVariable Long contactId,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        contactService.deleteContact(user.getId(), contactId);
        
        return ResponseEntity.ok(ApiResponse.successMessage("Contact deleted successfully"));
    }

    @GetMapping("/{contactId}")
    public ResponseEntity<ApiResponse<ContactDto>> getContactById(
            @PathVariable Long contactId,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        ContactDto contact = contactService.getContactById(contactId, user.getId());
        
        return ResponseEntity.ok(ApiResponse.successWithData(contact, "Contact retrieved successfully"));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<Page<ContactDto>>> getMyContact(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        Sort sort = Sort.by(sortDirection.equalsIgnoreCase("asc") ? 
                Sort.Direction.ASC : Sort.Direction.DESC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<ContactDto> contacts = contactService.getContactByUser(user.getId(), user.getId(), pageable);
        
        return ResponseEntity.ok(ApiResponse.successWithData(contacts, "User contacts retrieved successfully"));
    }

    // Admin operations
    @GetMapping("/admin/all")
    public ResponseEntity<ApiResponse<Page<ContactDto>>> getAllContact(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        Sort sort = Sort.by(sortDirection.equalsIgnoreCase("asc") ? 
                Sort.Direction.ASC : Sort.Direction.DESC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<ContactDto> contacts = contactService.getAllContact(user.getId(), pageable);
        
        return ResponseEntity.ok(ApiResponse.successWithData(contacts, "All contacts retrieved successfully"));
    }

    @GetMapping("/admin/status/{status}")
    public ResponseEntity<ApiResponse<Page<ContactDto>>> getContactByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        Pageable pageable = PageRequest.of(page, size);
        
        Page<ContactDto> contacts = contactService.getContactByStatus(user.getId(), status, pageable);
        
        return ResponseEntity.ok(ApiResponse.successWithData(contacts, "Contacts filtered by status retrieved successfully"));
    }

    @GetMapping("/admin/priority/{priority}")
    public ResponseEntity<ApiResponse<Page<ContactDto>>> getContactByPriority(
            @PathVariable String priority,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        Pageable pageable = PageRequest.of(page, size);
        
        Page<ContactDto> contacts = contactService.getContactByPriority(user.getId(), priority, pageable);
        
        return ResponseEntity.ok(ApiResponse.successWithData(contacts, "Contacts filtered by priority retrieved successfully"));
    }

    @GetMapping("/admin/type/{contactType}")
    public ResponseEntity<ApiResponse<Page<ContactDto>>> getContactByType(
            @PathVariable String contactType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        Pageable pageable = PageRequest.of(page, size);
        
        Page<ContactDto> contacts = contactService.getContactByType(user.getId(), contactType, pageable);
        
        return ResponseEntity.ok(ApiResponse.successWithData(contacts, "Contacts filtered by type retrieved successfully"));
    }

    @GetMapping("/admin/pending")
    public ResponseEntity<ApiResponse<Page<ContactDto>>> getPendingContact(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        Pageable pageable = PageRequest.of(page, size);
        
        Page<ContactDto> contacts = contactService.getPendingContact(user.getId(), pageable);
        
        return ResponseEntity.ok(ApiResponse.successWithData(contacts, "Pending contacts retrieved successfully"));
    }

    @GetMapping("/admin/urgent")
    public ResponseEntity<ApiResponse<Page<ContactDto>>> getUrgentContact(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        Pageable pageable = PageRequest.of(page, size);
        
        Page<ContactDto> contacts = contactService.getUrgentContact(user.getId(), pageable);
        
        return ResponseEntity.ok(ApiResponse.successWithData(contacts, "Urgent contacts retrieved successfully"));
    }

    @GetMapping("/admin/needing-response")
    public ResponseEntity<ApiResponse<Page<ContactDto>>> getContactNeedingResponse(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        Pageable pageable = PageRequest.of(page, size);
        
        Page<ContactDto> contacts = contactService.getContactNeedingResponse(user.getId(), pageable);
        
        return ResponseEntity.ok(ApiResponse.successWithData(contacts, "Contacts needing response retrieved successfully"));
    }

    @PostMapping("/admin/{contactId}/respond")
    public ResponseEntity<ApiResponse<ContactDto>> respondToContact(
            @PathVariable Long contactId,
            @Valid @RequestBody AdminResponseRequest request,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        ContactDto contact = contactService.respondToContact(user.getId(), contactId, request);
        
        return ResponseEntity.ok(ApiResponse.successWithData(contact, "Response submitted successfully"));
    }

    @PutMapping("/admin/{contactId}/status")
    public ResponseEntity<ApiResponse<ContactDto>> updateContactStatus(
            @PathVariable Long contactId,
            @RequestParam String status,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        ContactDto contact = contactService.updateContactStatus(user.getId(), contactId, status);
        
        return ResponseEntity.ok(ApiResponse.successWithData(contact, "Contact status updated successfully"));
    }

    @GetMapping("/admin/search")
    public ResponseEntity<ApiResponse<Page<ContactDto>>> searchContact(
            @RequestParam String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        Pageable pageable = PageRequest.of(page, size);
        
        Page<ContactDto> contacts = contactService.searchContact(user.getId(), searchTerm, pageable);
        
        return ResponseEntity.ok(ApiResponse.successWithData(contacts, "Contact search completed successfully"));
    }

    @GetMapping("/admin/filter")
    public ResponseEntity<ApiResponse<Page<ContactDto>>> getContactByCriteria(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String contactType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        Pageable pageable = PageRequest.of(page, size);
        
        Page<ContactDto> contacts = contactService.getContactByCriteria(user.getId(), status, priority, contactType, pageable);
        
        return ResponseEntity.ok(ApiResponse.successWithData(contacts, "Filtered contacts retrieved successfully"));
    }

    @GetMapping("/admin/statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getContactStatistics(
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        Map<String, Object> statistics = contactService.getContactStatistics(user.getId());
        
        return ResponseEntity.ok(ApiResponse.successWithData(statistics, "Contact statistics retrieved successfully"));
    }
} 