package com.leenglish.toeic.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.leenglish.toeic.domain.Lesson;
import com.leenglish.toeic.domain.FlashcardSet;
import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.enums.Role;
import com.leenglish.toeic.repository.LessonRepository;
import com.leenglish.toeic.repository.FlashcardSetRepository;
import com.leenglish.toeic.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private LessonRepository lessonRepository;
    
    @Autowired
    private FlashcardSetRepository flashcardSetRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize Admin User
        if (userRepository.findByUsername("admin").isEmpty()) {
            System.out.println("🔧 Creating admin user...");
            
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@toeic.com");
            admin.setPasswordHash(passwordEncoder.encode("password"));
            admin.setFullName("Administrator");
            admin.setRole(Role.ADMIN);
            admin.setIsActive(true);
            admin.setIsEmailVerified(true);
            admin.setTotalScore(0);
            admin.setIsPremium(false);
            
            userRepository.save(admin);
            System.out.println("✅ Created admin user with username: admin, password: password");
        }
        // Initialize Lessons
        if (lessonRepository.count() == 0) {
            System.out.println("? Initializing sample lessons...");
            
            Lesson lesson1 = new Lesson();
            lesson1.setTitle("Basic Greetings");
            lesson1.setDescription("Learn essential greeting phrases for TOEIC");
            lesson1.setContent("Sample content for basic greetings lesson");
            lesson1.setDifficulty("BEGINNER");
            lesson1.setDuration(15);
            lesson1.setIsPublic(true);
            lesson1.setIsActive(true);
            lesson1.setIsPremium(false);
            lesson1.setType("VOCABULARY");
            
            Lesson lesson2 = new Lesson();
            lesson2.setTitle("Business English Phrases");
            lesson2.setDescription("Common phrases used in business environments");
            lesson2.setContent("Sample content for business English lesson");
            lesson2.setDifficulty("INTERMEDIATE");
            lesson2.setDuration(25);
            lesson2.setIsPublic(true);
            lesson2.setIsActive(true);
            lesson2.setIsPremium(false);
            lesson2.setType("BUSINESS");
            
            Lesson lesson3 = new Lesson();
            lesson3.setTitle("Advanced Vocabulary");
            lesson3.setDescription("Complex vocabulary for advanced TOEIC learners");
            lesson3.setContent("Sample content for advanced vocabulary lesson");
            lesson3.setDifficulty("ADVANCED");
            lesson3.setDuration(35);
            lesson3.setIsPublic(true);
            lesson3.setIsActive(true);
            lesson3.setIsPremium(true);
            lesson3.setType("VOCABULARY");
            
            Lesson lesson4 = new Lesson();
            lesson4.setTitle("Listening Comprehension");
            lesson4.setDescription("Improve your listening skills for TOEIC");
            lesson4.setContent("Sample content for listening comprehension lesson");
            lesson4.setDifficulty("INTERMEDIATE");
            lesson4.setDuration(30);
            lesson4.setIsPublic(true);
            lesson4.setIsActive(true);
            lesson4.setIsPremium(false);
            lesson4.setType("LISTENING");
            
            lessonRepository.save(lesson1);
            lessonRepository.save(lesson2);
            lessonRepository.save(lesson3);
            lessonRepository.save(lesson4);
            
            System.out.println("? Created 4 sample lessons");
        }
        
        // Initialize FlashcardSets
        if (flashcardSetRepository.count() == 0) {
            System.out.println("? Initializing sample flashcard sets...");
            
            FlashcardSet set1 = new FlashcardSet();
            set1.setTitle("Essential Greetings");
            set1.setDescription("Basic greeting vocabulary for beginners");
            set1.setCategory("VOCABULARY");
            set1.setDifficulty("BEGINNER");
            set1.setIsPublic(true);
            set1.setIsActive(true);
            set1.setIsPremium(false);
            
            FlashcardSet set2 = new FlashcardSet();
            set2.setTitle("Common Phrases");
            set2.setDescription("Everyday phrases for conversation");
            set2.setCategory("PHRASES");
            set2.setDifficulty("BEGINNER");
            set2.setIsPublic(true);
            set2.setIsActive(true);
            set2.setIsPremium(false);
            
            FlashcardSet set3 = new FlashcardSet();
            set3.setTitle("Advanced Vocabulary");
            set3.setDescription("Complex words for advanced learners");
            set3.setCategory("VOCABULARY");
            set3.setDifficulty("ADVANCED");
            set3.setIsPublic(true);
            set3.setIsActive(true);
            set3.setIsPremium(true);
            
            FlashcardSet set4 = new FlashcardSet();
            set4.setTitle("Business Terms");
            set4.setDescription("Professional vocabulary for workplace");
            set4.setCategory("BUSINESS");
            set4.setDifficulty("INTERMEDIATE");
            set4.setIsPublic(true);
            set4.setIsActive(true);
            set4.setIsPremium(false);
            
            flashcardSetRepository.save(set1);
            flashcardSetRepository.save(set2);
            flashcardSetRepository.save(set3);
            flashcardSetRepository.save(set4);
            
            System.out.println("? Created 4 sample flashcard sets");
        }
    }
}