package com.leenglish.toeic.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.leenglish.toeic.domain.FlashcardSet;
import com.leenglish.toeic.domain.Lesson;
import com.leenglish.toeic.repository.FlashcardSetRepository;
import com.leenglish.toeic.repository.LessonRepository;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner seedData(LessonRepository lessonRepo, FlashcardSetRepository flashcardSetRepo) {
        return args -> {
            if (lessonRepo.count() == 0) {
                Lesson lesson1 = new Lesson();
                lesson1.setTitle("A1 Sample Lesson");
                lesson1.setDescription("Basic lesson for A1");
                lesson1.setLevel("A1");
                lesson1.setIsPremium(false);
                lesson1.setOrderIndex(1);
                lesson1.setIsActive(true);
                lessonRepo.save(lesson1);

                Lesson lesson2 = new Lesson();
                lesson2.setTitle("B1 Sample Lesson");
                lesson2.setDescription("Intermediate lesson for B1");
                lesson2.setLevel("B1");
                lesson2.setIsPremium(false);
                lesson2.setOrderIndex(2);
                lesson2.setIsActive(true);
                lessonRepo.save(lesson2);

                Lesson lesson3 = new Lesson();
                lesson3.setTitle("C1 Premium Lesson");
                lesson3.setDescription("Premium lesson for C1");
                lesson3.setLevel("C1");
                lesson3.setIsPremium(true);
                lesson3.setOrderIndex(3);
                lesson3.setIsActive(true);
                lessonRepo.save(lesson3);
            }
            if (flashcardSetRepo.count() == 0) {
                FlashcardSet set1 = new FlashcardSet();
                set1.setName("Business Vocabulary");
                set1.setDescription("Workplace words");
                set1.setDifficultyLevel("INTERMEDIATE");
                set1.setIsPremium(false);
                set1.setIsActive(true);
                set1.setIsPublic(true);
                set1.setEstimatedTimeMinutes(15);
                set1.setTags("business");
                set1.setViewCount(0);
                flashcardSetRepo.save(set1);

                FlashcardSet set2 = new FlashcardSet();
                set2.setName("Travel & Tourism");
                set2.setDescription("Travel words");
                set2.setDifficultyLevel("BEGINNER");
                set2.setIsPremium(false);
                set2.setIsActive(true);
                set2.setIsPublic(true);
                set2.setEstimatedTimeMinutes(10);
                set2.setTags("travel");
                set2.setViewCount(0);
                flashcardSetRepo.save(set2);
            }
        };
    }
}
