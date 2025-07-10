package com.leenglish.toeic.service;

import com.leenglish.toeic.domain.MembershipPlan;
import com.leenglish.toeic.dto.MembershipPlanDto;
import com.leenglish.toeic.repository.MembershipPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class MembershipPlanService {

    @Autowired
    private MembershipPlanRepository membershipPlanRepository;

    public List<MembershipPlanDto> getAllActivePlans() {
        List<MembershipPlan> plans = membershipPlanRepository.findByIsActiveTrueOrderByPriceAsc();
        return plans.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<MembershipPlanDto> getPlansByDuration() {
        List<MembershipPlan> plans = membershipPlanRepository.findActivePlansOrderByDuration();
        return plans.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public MembershipPlanDto getPlanById(Long id) {
        Optional<MembershipPlan> planOpt = membershipPlanRepository.findById(id);
        if (!planOpt.isPresent()) {
            throw new RuntimeException("MembershipPlan not found with id: " + id);
        }
        return convertToDto(planOpt.get());
    }

    public MembershipPlanDto createPlan(MembershipPlanDto planDto) {
        MembershipPlan plan = new MembershipPlan();
        plan.setName(planDto.getName());
        plan.setDescription(planDto.getDescription());
        plan.setPrice(planDto.getPrice());
        plan.setCurrency(planDto.getCurrency());
        plan.setDurationDays(planDto.getDurationDays());
        plan.setMaxExercisesPerDay(planDto.getMaxExercisesPerDay());
        plan.setMaxLessonsPerDay(planDto.getMaxLessonsPerDay());
        plan.setMaxFlashcardsPerSet(planDto.getMaxFlashcardsPerSet());
        plan.setHasAudioAccess(planDto.getHasAudioAccess());
        plan.setHasPremiumContent(planDto.getHasPremiumContent());
        plan.setHasProgressTracking(planDto.getHasProgressTracking());
        plan.setIsActive(true);
        plan.setCreatedAt(LocalDateTime.now());
        plan.setUpdatedAt(LocalDateTime.now());

        MembershipPlan savedPlan = membershipPlanRepository.save(plan);
        return convertToDto(savedPlan);
    }

    public MembershipPlanDto updatePlan(Long id, MembershipPlanDto planDto) {
        Optional<MembershipPlan> planOpt = membershipPlanRepository.findById(id);
        if (!planOpt.isPresent()) {
            throw new RuntimeException("MembershipPlan not found with id: " + id);
        }

        MembershipPlan plan = planOpt.get();
        plan.setName(planDto.getName());
        plan.setDescription(planDto.getDescription());
        plan.setPrice(planDto.getPrice());
        plan.setCurrency(planDto.getCurrency());
        plan.setDurationDays(planDto.getDurationDays());
        plan.setMaxExercisesPerDay(planDto.getMaxExercisesPerDay());
        plan.setMaxLessonsPerDay(planDto.getMaxLessonsPerDay());
        plan.setMaxFlashcardsPerSet(planDto.getMaxFlashcardsPerSet());
        plan.setHasAudioAccess(planDto.getHasAudioAccess());
        plan.setHasPremiumContent(planDto.getHasPremiumContent());
        plan.setHasProgressTracking(planDto.getHasProgressTracking());
        plan.setUpdatedAt(LocalDateTime.now());

        MembershipPlan updatedPlan = membershipPlanRepository.save(plan);
        return convertToDto(updatedPlan);
    }

    public void deletePlan(Long id) {
        Optional<MembershipPlan> planOpt = membershipPlanRepository.findById(id);
        if (!planOpt.isPresent()) {
            throw new RuntimeException("MembershipPlan not found with id: " + id);
        }

        MembershipPlan plan = planOpt.get();
        plan.setIsActive(false);
        plan.setUpdatedAt(LocalDateTime.now());
        membershipPlanRepository.save(plan);
    }

    private MembershipPlanDto convertToDto(MembershipPlan plan) {
        return new MembershipPlanDto(
                plan.getId(),
                plan.getName(),
                plan.getDescription(),
                plan.getPrice(),
                plan.getCurrency(),
                plan.getDurationDays(),
                plan.getMaxExercisesPerDay(),
                plan.getMaxLessonsPerDay(),
                plan.getMaxFlashcardsPerSet(),
                plan.getHasAudioAccess(),
                plan.getHasPremiumContent(),
                plan.getHasProgressTracking(),
                plan.getIsActive(),
                plan.getCreatedAt(),
                plan.getUpdatedAt());
    }
}
