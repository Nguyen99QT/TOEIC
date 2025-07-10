package com.leenglish.toeic.controller;

import com.leenglish.toeic.dto.MembershipPlanDto;
import com.leenglish.toeic.service.MembershipPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/membership")
@CrossOrigin(origins = "*")
public class MembershipController {

    @Autowired
    private MembershipPlanService membershipPlanService;

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
}
