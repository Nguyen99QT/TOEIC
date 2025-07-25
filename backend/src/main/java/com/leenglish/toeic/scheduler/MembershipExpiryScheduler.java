package com.leenglish.toeic.scheduler;

import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.enums.MembershipType;
import com.leenglish.toeic.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * ================================================================
 * MEMBERSHIP EXPIRY SCHEDULER
 * ================================================================
 * 
 * Automated service that checks and resets expired premium memberships
 * Runs every hour to ensure users are properly downgraded to FREE
 */
@Service
public class MembershipExpiryScheduler {

    @Autowired
    private UserRepository userRepository;

    /**
     * Check for expired premium memberships and reset to FREE
     * Runs every hour
     */
    @Scheduled(fixedRate = 3600000) // 1 hour = 3,600,000 milliseconds
    public void checkAndExpireMemberships() {
        try {
            LocalDateTime now = LocalDateTime.now();

            // Find all users with expired premium memberships
            List<User> expiredUsers = userRepository.findExpiredPremiumUsers(now);

            if (!expiredUsers.isEmpty()) {
                System.out.println("🕐 Found " + expiredUsers.size() + " expired premium memberships");

                for (User user : expiredUsers) {
                    // Reset to FREE membership
                    user.setMembershipType(MembershipType.FREE);
                    user.setIsPremium(false);
                    user.setPremiumExpiresAt(null);

                    userRepository.save(user);

                    System.out.println("⬇️ Reset user '" + user.getUsername() + "' from PREMIUM to FREE (expired: "
                            + user.getPremiumExpiresAt() + ")");
                }

                System.out.println("✅ Successfully processed " + expiredUsers.size() + " membership expirations");
            } else {
                System.out.println("✅ No expired memberships found at " + now);
            }

        } catch (Exception e) {
            System.err.println("❌ Error in membership expiry scheduler: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Check for memberships expiring soon (within 24 hours)
     * Runs daily at 9 AM
     */
    @Scheduled(cron = "0 0 9 * * ?")
    public void checkMembershipsExpiringSoon() {
        try {
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime tomorrow = now.plusDays(1);

            // Find users whose membership expires within 24 hours
            List<User> soonToExpireUsers = userRepository.findPremiumUsersExpiringBetween(now, tomorrow);

            if (!soonToExpireUsers.isEmpty()) {
                System.out.println("⚠️ Found " + soonToExpireUsers.size() + " memberships expiring within 24 hours");

                for (User user : soonToExpireUsers) {
                    System.out.println(
                            "⏰ User '" + user.getUsername() + "' membership expires at: " + user.getPremiumExpiresAt());
                    // TODO: Send email notification to user
                    // emailService.sendExpiryWarning(user);
                }
            }

        } catch (Exception e) {
            System.err.println("❌ Error checking memberships expiring soon: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
