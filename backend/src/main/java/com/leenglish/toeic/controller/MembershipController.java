package com.leenglish.toeic.controller;

import com.leenglish.toeic.dto.MembershipPlanDto;
import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.enums.MembershipType;
import com.leenglish.toeic.service.MembershipPlanService;
import com.leenglish.toeic.service.UserService;
import com.leenglish.toeic.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/membership")
@CrossOrigin(origins = "*")
public class MembershipController {

    @Autowired
    private MembershipPlanService membershipPlanService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/plans")
    public ResponseEntity<List<MembershipPlanDto>> getAllPlans() {
        List<MembershipPlanDto> plans = membershipPlanService.getAllActivePlans();
        return ResponseEntity.ok(plans);
    }

    @GetMapping("/plans/{id}")
    public ResponseEntity<MembershipPlanDto> getPlanById(@PathVariable Long id) {
        MembershipPlanDto plan = membershipPlanService.getPlanById(id);
        return ResponseEntity.ok(plan);
    }

    @GetMapping("/plans/by-duration")
    public ResponseEntity<List<MembershipPlanDto>> getPlansByDuration() {
        List<MembershipPlanDto> plans = membershipPlanService.getPlansByDuration();
        return ResponseEntity.ok(plans);
    }

    @PostMapping("/plans")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MembershipPlanDto> createPlan(@RequestBody MembershipPlanDto planDto) {
        MembershipPlanDto createdPlan = membershipPlanService.createPlan(planDto);
        return ResponseEntity.ok(createdPlan);
    }

    @PutMapping("/plans/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MembershipPlanDto> updatePlan(@PathVariable Long id, @RequestBody MembershipPlanDto planDto) {
        MembershipPlanDto updatedPlan = membershipPlanService.updatePlan(id, planDto);
        return ResponseEntity.ok(updatedPlan);
    }

    @DeleteMapping("/plans/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePlan(@PathVariable Long id) {
        membershipPlanService.deletePlan(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/upgrade")
    public ResponseEntity<String> upgradeMembership(
            @RequestParam("planId") String planId,
            @RequestParam("paypalOrderId") String paypalOrderId,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            System.out.println("📝 Membership upgrade request:");
            System.out.println("Username: " + username);
            System.out.println("Plan ID: " + planId);
            System.out.println("PayPal Order ID: " + paypalOrderId);

            // Get user by username
            Optional<User> userOptional = userService.findByUsername(username);
            if (!userOptional.isPresent()) {
                return ResponseEntity.status(404).body("User not found");
            }

            User user = userOptional.get();

            // Update user membership type to PREMIUM
            user.setMembershipType(MembershipType.PREMIUM);
            userRepository.save(user);

            System.out.println("✅ Membership upgraded successfully for user: " + username);
            return ResponseEntity.ok("Membership upgraded successfully");

        } catch (Exception e) {
            System.err.println("❌ Error upgrading membership: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error upgrading membership: " + e.getMessage());
        }
    }
}
