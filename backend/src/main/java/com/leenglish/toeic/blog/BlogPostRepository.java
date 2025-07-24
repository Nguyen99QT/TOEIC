package com.leenglish.toeic.blog;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    List<BlogPost> findByTitleContainingIgnoreCase(String title);

    List<BlogPost> findByHiddenFalseOrHiddenIsNullOrderByCreatedAtDesc();

    List<BlogPost> findByTitleContainingIgnoreCaseAndHiddenFalseOrHiddenIsNull(String title);

    List<BlogPost> findAllByOrderByCreatedAtDesc();
}
