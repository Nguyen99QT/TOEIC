package com.leenglish.toeic.repository;

import com.leenglish.toeic.domain.MembershipPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MembershipPlanRepository extends JpaRepository<MembershipPlan, Long> {

    List<MembershipPlan> findByIsActiveTrueOrderByPriceAsc();

    @Query("SELECT mp FROM MembershipPlan mp WHERE mp.isActive = true ORDER BY mp.durationDays ASC")
    List<MembershipPlan> findActivePlansOrderByDuration();

    List<MembershipPlan> findByNameContainingIgnoreCaseAndIsActiveTrue(String name);
}
