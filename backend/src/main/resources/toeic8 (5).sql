-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jul 17, 2025 at 12:25 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `toeic8`
--

-- --------------------------------------------------------

--
-- Table structure for table `exercises`
--

CREATE TABLE `exercises` (
  `id` bigint(20) NOT NULL,
  `audio_url` varchar(500) DEFAULT NULL,
  `correct_answer` varchar(500) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `difficulty` varchar(255) DEFAULT NULL,
  `difficulty_level` varchar(255) DEFAULT NULL,
  `explanation` varchar(1000) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `is_active` bit(1) NOT NULL,
  `is_premium` bit(1) NOT NULL,
  `lesson_id` bigint(20) DEFAULT NULL,
  `level` varchar(5) DEFAULT NULL,
  `options` varchar(2000) DEFAULT NULL,
  `order_index` int(11) DEFAULT NULL,
  `points` int(11) DEFAULT NULL,
  `question` varchar(2000) DEFAULT NULL,
  `time_limit_seconds` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `type` varchar(100) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `exercises`
--

INSERT INTO `exercises` (`id`, `audio_url`, `correct_answer`, `created_at`, `description`, `difficulty`, `difficulty_level`, `explanation`, `image_url`, `is_active`, `is_premium`, `lesson_id`, `level`, `options`, `order_index`, `points`, `question`, `time_limit_seconds`, `title`, `type`, `updated_at`) VALUES
(1, 'exercises/ex1.mp3', 'A', '2025-06-26 11:30:28.000000', 'Choose the correct greeting.', NULL, 'easy', 'Hello is a common greeting.', 'exercises/ex1.jpg', b'1', b'0', 1, 'A1', '[\"A. Hello\", \"B. Goodbye\", \"C. Thanks\", \"D. Please\"]', 1, 10, 'Which is a common English greeting?', 60, 'Exercise 1', 'multiple_choice', '2025-06-26 11:30:28.000000'),
(2, 'exercises/ex2.mp3', '1-A, 2-B', '2025-06-26 11:30:28.000000', 'Match the greeting with the language.', NULL, 'easy', '1-A, 2-B is correct.', 'exercises/ex2.jpg', b'1', b'0', 1, 'A1', '[\"1. Hello\", \"2. Goodbye\"]', 2, 10, 'Match the following:', 120, 'Exercise 2', 'matching', '2025-06-26 11:30:28.000000'),
(3, 'exercises/ex3.mp3', 'Hello', '2025-06-26 11:30:28.000000', 'Fill in the blank: \"___! How are you?\"', NULL, 'easy', 'Hello is the correct greeting.', 'exercises/ex3.jpg', b'1', b'0', 1, 'A1', '[\"Hi\", \"Hello\", \"Hey\", \"Greetings\"]', 3, 10, 'Complete the greeting.', 30, 'Exercise 3', 'fill_in_the_blank', '2025-06-26 11:30:28.000000'),
(4, 'exercises/ex4.mp3', 'A', '2025-06-26 11:30:28.000000', 'Choose the correct number.', NULL, 'easy', 'One is the first number.', 'exercises/ex4.jpg', b'1', b'0', 2, 'A1', '[\"A. One\", \"B. Two\", \"C. Three\", \"D. Four\"]', 1, 10, 'How do you say \"1\" in English?', 60, 'Exercise 4', 'multiple_choice', '2025-06-26 11:30:28.000000'),
(5, 'exercises/ex5.mp3', '1-A, 2-B', '2025-06-26 11:30:28.000000', 'Match the number with the word.', NULL, 'medium', '1-A, 2-B is correct.', 'exercises/ex5.jpg', b'1', b'0', 2, 'A1', '[\"1. One\", \"2. Two\"]', 2, 15, 'Match the following numbers:', 120, 'Exercise 5', 'matching', '2025-06-26 11:30:28.000000'),
(6, 'exercises/ex6.mp3', 'two', '2025-06-26 11:30:28.000000', 'Fill in the blank: \"I have ___ apples.\"', NULL, 'medium', 'Two is the correct number.', 'exercises/ex6.jpg', b'1', b'0', 2, 'A1', '[\"one\", \"two\", \"three\", \"four\"]', 3, 15, 'Complete the sentence.', 30, 'Exercise 6', 'fill_in_the_blank', '2025-06-26 11:30:28.000000'),
(7, 'exercises/ex7.mp3', 'A', '2025-06-26 11:30:28.000000', 'Choose the correct color.', NULL, 'hard', 'Blue is the color of the clear sky.', 'exercises/ex7.jpg', b'1', b'0', 3, 'A1', '[\"A. Blue\", \"B. Green\", \"C. Red\", \"D. Yellow\"]', 1, 20, 'What color is the sky on a clear day?', 60, 'Exercise 7', 'multiple_choice', '2025-06-26 11:30:28.000000'),
(8, 'exercises/ex8.mp3', '1-A, 2-B', '2025-06-26 11:30:28.000000', 'Match the color with the object.', NULL, 'hard', '1-A, 2-B is correct.', 'exercises/ex8.jpg', b'1', b'0', 3, 'A1', '[\"1. Red\", \"2. Blue\"]', 2, 20, 'Match the following colors:', 120, 'Exercise 8', 'matching', '2025-06-26 11:30:28.000000'),
(9, 'exercises/ex9.mp3', 'green', '2025-06-26 11:30:28.000000', 'Fill in the blank: \"The grass is ___.\"', NULL, 'easy', 'Green is the color of the grass.', 'exercises/ex9.jpg', b'1', b'0', 3, 'A1', '[\"brown\", \"green\", \"blue\", \"yellow\"]', 3, 10, 'Complete the sentence.', 30, 'Exercise 9', 'fill_in_the_blank', '2025-06-26 11:30:28.000000'),
(10, 'exercises/ex10.mp3', 'A', '2025-06-26 11:30:28.000000', 'Choose the correct family member.', NULL, 'easy', 'Cousin is the child of your uncle or aunt.', 'exercises/ex10.jpg', b'1', b'0', 4, 'A1', '[\"A. Niece\", \"B. Nephew\", \"C. Cousin\", \"D. Sibling\"]', 1, 10, 'Who is your brother or sister\'s child?', 60, 'Exercise 10', 'multiple_choice', '2025-06-26 11:30:28.000000'),
(11, 'family/match.mp3', '1-A, 2-B', '2025-06-26 11:30:28.000000', 'Match the family member with the description.', NULL, 'easy', '1-A, 2-B is correct.', 'exercises/ex11.jpg', b'1', b'0', 4, 'A1', '[\"1. Mother\", \"2. Father\"]', 2, 10, 'Match the following family members:', 120, 'Exercise 11', 'matching', '2025-06-26 11:30:28.000000'),
(12, 'family/fill.mp3', 'mother', '2025-06-26 11:30:28.000000', 'Fill in the blank: \"This is my ___.\"', NULL, 'easy', 'Mother is the correct family member.', 'exercises/ex12.jpg', b'1', b'0', 4, 'A1', '[\"mother\", \"father\", \"sister\", \"brother\"]', 3, 10, 'Complete the sentence.', 30, 'Exercise 12', 'fill_in_the_blank', '2025-06-26 11:30:28.000000'),
(13, 'food/bread.mp3', 'A', '2025-06-26 11:30:28.000000', 'Choose the correct food.', NULL, 'easy', 'Bread is a common breakfast food.', 'exercises/ex13.jpg', b'1', b'0', 5, 'A1', '[\"A. Bread\", \"B. Shirt\", \"C. Car\", \"D. House\"]', 1, 10, 'What is a common breakfast food?', 60, 'Exercise 13', 'multiple_choice', '2025-06-26 11:30:28.000000'),
(14, 'food/match.mp3', '1-A, 2-B', '2025-06-26 11:30:28.000000', 'Match the food with the category.', NULL, 'easy', '1-A, 2-B is correct.', 'exercises/ex14.jpg', b'1', b'0', 5, 'A1', '[\"1. Apple\", \"2. Carrot\"]', 2, 10, 'Match the following foods:', 120, 'Exercise 14', 'matching', '2025-06-26 11:30:28.000000'),
(15, 'food/fill.mp3', 'pizza', '2025-06-26 11:30:28.000000', 'Fill in the blank: \"I like to eat ___.\"', NULL, 'easy', 'Pizza is the correct food.', 'exercises/ex15.jpg', b'1', b'0', 5, 'A1', '[\"burger\", \"pizza\", \"salad\", \"soup\"]', 3, 10, 'Complete the sentence.', 30, 'Exercise 15', 'fill_in_the_blank', '2025-06-26 11:30:28.000000'),
(16, 'hobbies/reading.mp3', 'A', '2025-06-26 11:30:28.000000', 'Choose the correct hobby.', NULL, 'easy', 'Reading is a common indoor hobby.', 'exercises/ex16.jpg', b'1', b'0', 6, 'A1', '[\"A. Reading\", \"B. Running\", \"C. Swimming\", \"D. Cycling\"]', 1, 10, 'What is a common indoor hobby?', 60, 'Exercise 16', 'multiple_choice', '2025-06-26 11:30:28.000000'),
(17, 'hobbies/match.mp3', '1-A, 2-B', '2025-06-26 11:30:28.000000', 'Match the hobby with the activity.', NULL, 'easy', '1-A, 2-B is correct.', 'exercises/ex17.jpg', b'1', b'0', 6, 'A1', '[\"1. Painting\", \"2. Singing\"]', 2, 10, 'Match the following hobbies:', 120, 'Exercise 17', 'matching', '2025-06-26 11:30:28.000000'),
(18, 'hobbies/fill.mp3', 'jogging', '2025-06-26 11:30:28.000000', 'Fill in the blank: \"I enjoy ___ on weekends.\"', NULL, 'easy', 'Jogging is a common weekend activity.', 'exercises/ex18.jpg', b'1', b'0', 6, 'A1', '[\"jogging\", \"sleeping\", \"working\", \"studying\"]', 3, 10, 'Complete the sentence.', 30, 'Exercise 18', 'fill_in_the_blank', '2025-06-26 11:30:28.000000'),
(19, 'travel/paris.mp3', 'A', '2025-06-26 11:30:28.000000', 'Choose the correct travel destination.', NULL, 'easy', 'The Eiffel Tower is in Paris.', 'exercises/ex19.jpg', b'1', b'0', 7, 'A1', '[\"A. Paris\", \"B. London\", \"C. New York\", \"D. Tokyo\"]', 1, 10, 'Where can you see the Eiffel Tower?', 60, 'Exercise 19', 'multiple_choice', '2025-06-26 11:30:28.000000'),
(20, 'travel/match.mp3', '1-A, 2-B', '2025-06-26 11:30:28.000000', 'Match the destination with the country.', NULL, 'easy', '1-A, 2-B is correct.', 'exercises/ex20.jpg', b'1', b'0', 7, 'A1', '[\"1. Statue of Liberty\", \"2. Big Ben\"]', 2, 10, 'Match the following destinations:', 120, 'Exercise 20', 'matching', '2025-06-26 11:30:28.000000'),
(21, 'travel/fill.mp3', 'Japan', '2025-06-26 11:30:28.000000', 'Fill in the blank: \"I want to visit ___.\"', NULL, 'easy', 'Japan is a popular travel destination.', 'exercises/ex21.jpg', b'1', b'0', 7, 'A1', '[\"Japan\", \"Brazil\", \"Canada\", \"Australia\"]', 3, 10, 'Complete the sentence.', 30, 'Exercise 21', 'fill_in_the_blank', '2025-06-26 11:30:28.000000'),
(22, 'work/teacher.mp3', 'A', '2025-06-26 11:30:28.000000', 'Choose the correct job.', NULL, 'easy', 'A teacher teaches students.', 'exercises/ex22.jpg', b'1', b'0', 8, 'A1', '[\"A. Teaches\", \"B. Sings\", \"C. Dances\", \"D. Paints\"]', 1, 10, 'What does a teacher do?', 60, 'Exercise 22', 'multiple_choice', '2025-06-26 11:30:28.000000'),
(23, 'work/match.mp3', '1-A, 2-B', '2025-06-26 11:30:28.000000', 'Match the job with the description.', NULL, 'easy', '1-A, 2-B is correct.', 'exercises/ex23.jpg', b'1', b'0', 8, 'A1', '[\"1. Doctor\", \"2. Engineer\"]', 2, 10, 'Match the following jobs:', 120, 'Exercise 23', 'matching', '2025-06-26 11:30:28.000000'),
(24, 'work/fill.mp3', 'developer', '2025-06-26 11:30:28.000000', 'Fill in the blank: \"I am a ___.\"', NULL, 'easy', 'Developer is a common job in tech.', 'exercises/ex24.jpg', b'1', b'0', 8, 'A1', '[\"teacher\", \"doctor\", \"developer\", \"nurse\"]', 3, 10, 'Complete the sentence.', 30, 'Exercise 24', 'fill_in_the_blank', '2025-06-26 11:30:28.000000'),
(25, 'routine/wake.mp3', 'A', '2025-06-26 11:30:28.000000', 'Choose the correct daily routine.', NULL, 'easy', 'You wake up first thing in the morning.', 'exercises/ex25.jpg', b'1', b'0', 9, 'A1', '[\"A. Wake up\", \"B. Go to bed\", \"C. Eat dinner\", \"D. Take a shower\"]', 1, 10, 'What do you do first in the morning?', 60, 'Exercise 25', 'multiple_choice', '2025-06-26 11:30:28.000000'),
(26, 'routine/match.mp3', '1-A, 2-B', '2025-06-26 11:30:28.000000', 'Match the routine with the time.', NULL, 'easy', '1-A, 2-B is correct.', 'exercises/ex26.jpg', b'1', b'0', 9, 'A1', '[\"1. Breakfast\", \"2. Lunch\"]', 2, 10, 'Match the following routines:', 120, 'Exercise 26', 'matching', '2025-06-26 11:30:28.000000'),
(27, 'routine/fill.mp3', 'wake up', '2025-06-26 11:30:28.000000', 'Fill in the blank: \"I usually ___ at 7 AM.\"', NULL, 'easy', 'Wake up is the correct action.', 'exercises/ex27.jpg', b'1', b'0', 9, 'A1', '[\"eat\", \"sleep\", \"wake up\", \"work\"]', 3, 10, 'Complete the sentence.', 30, 'Exercise 27', 'fill_in_the_blank', '2025-06-26 11:30:28.000000'),
(28, 'weather/rain.mp3', 'A', '2025-06-26 11:30:28.000000', 'Choose the correct weather description.', NULL, 'easy', 'Wet is the correct description for rainy weather.', 'exercises/ex28.jpg', b'1', b'0', 10, 'A1', '[\"A. Wet\", \"B. Dry\", \"C. Hot\", \"D. Cold\"]', 1, 10, 'How is the weather when it\'s raining?', 60, 'Exercise 28', 'multiple_choice', '2025-06-26 11:30:28.000000'),
(29, 'weather/match.mp3', '1-A, 2-B', '2025-06-26 11:30:28.000000', 'Match the weather with the activity.', NULL, 'easy', '1-A, 2-B is correct.', 'exercises/ex29.jpg', b'1', b'0', 10, 'A1', '[\"1. Sunny\", \"2. Snowy\"]', 2, 10, 'Match the following weathers:', 120, 'Exercise 29', 'matching', '2025-06-26 11:30:28.000000'),
(30, 'weather/fill.mp3', 'raining', '2025-06-26 11:30:28.000000', 'Fill in the blank: \"It\'s ___ today, take an umbrella.\"', NULL, 'easy', 'Raining is the correct weather condition.', 'exercises/ex30.jpg', b'1', b'0', 10, 'A1', '[\"snowing\", \"raining\", \"sunny\", \"cloudy\"]', 3, 10, 'Complete the sentence.', 30, 'Exercise 30', 'fill_in_the_blank', '2025-06-26 11:30:28.000000'),
(31, 'sports/tennis.mp3', 'A', '2025-06-26 11:30:28.000000', 'Choose the correct sport.', NULL, 'easy', 'Tennis is played with a racket and ball.', 'exercises/ex31.jpg', b'1', b'0', 11, 'A1', '[\"A. Tennis\", \"B. Football\", \"C. Basketball\", \"D. Baseball\"]', 1, 10, 'What sport uses a racket and ball?', 60, 'Exercise 31', 'multiple_choice', '2025-06-26 11:30:28.000000'),
(32, 'sports/match.mp3', '1-A, 2-B', '2025-06-26 11:30:28.000000', 'Match the sport with the equipment.', NULL, 'easy', '1-A, 2-B is correct.', 'exercises/ex32.jpg', b'1', b'0', 11, 'A1', '[\"1. Golf\", \"2. Swimming\"]', 2, 10, 'Match the following sports:', 120, 'Exercise 32', 'matching', '2025-06-26 11:30:28.000000'),
(33, 'sports/fill.mp3', 'football', '2025-06-26 11:30:28.000000', 'Fill in the blank: \"I play ___ on weekends.\"', NULL, 'easy', 'Football is a popular weekend sport.', 'exercises/ex33.jpg', b'1', b'0', 11, 'A1', '[\"tennis\", \"football\", \"golf\", \"swimming\"]', 3, 10, 'Complete the sentence.', 30, 'Exercise 33', 'fill_in_the_blank', '2025-06-26 11:30:28.000000'),
(34, 'music/classical.mp3', 'A', '2025-06-26 11:30:28.000000', 'Choose the correct music genre.', NULL, 'easy', 'Beethoven is known for classical music.', 'exercises/ex34.jpg', b'1', b'0', 12, 'A1', '[\"A. Classical\", \"B. Rock\", \"C. Jazz\", \"D. Pop\"]', 1, 10, 'What genre is Beethoven\'s music?', 60, 'Exercise 34', 'multiple_choice', '2025-06-26 11:30:28.000000'),
(35, 'music/match.mp3', '1-A, 2-B', '2025-06-26 11:30:28.000000', 'Match the music genre with the description.', NULL, 'easy', '1-A, 2-B is correct.', 'exercises/ex35.jpg', b'1', b'0', 12, 'A1', '[\"1. Rock\", \"2. Jazz\"]', 2, 10, 'Match the following genres:', 120, 'Exercise 35', 'matching', '2025-06-26 11:30:28.000000'),
(36, 'music/fill.mp3', 'rock', '2025-06-26 11:30:28.000000', 'Fill in the blank: \"I love ___ music.\"', NULL, 'easy', 'Rock is my favorite music genre.', 'exercises/ex36.jpg', b'1', b'0', 12, 'A1', '[\"pop\", \"rock\", \"jazz\", \"classical\"]', 3, 10, 'Complete the sentence.', 30, 'Exercise 36', 'fill_in_the_blank', '2025-06-26 11:30:28.000000'),
(37, 'movies/drama.mp3', 'A', '2025-06-26 11:30:28.000000', 'Choose the correct movie genre.', NULL, 'easy', 'The Godfather is a famous drama film.', 'exercises/ex37.jpg', b'1', b'0', 13, 'A1', '[\"A. Action\", \"B. Drama\", \"C. Comedy\", \"D. Horror\"]', 1, 10, 'What genre is \"The Godfather\"?', 60, 'Exercise 37', 'multiple_choice', '2025-06-26 11:30:28.000000'),
(38, 'movies/match.mp3', '1-A, 2-B', '2025-06-26 11:30:28.000000', 'Match the movie with the actor.', NULL, 'easy', '1-A, 2-B is correct.', 'exercises/ex38.jpg', b'1', b'0', 13, 'A1', '[\"1. Titanic\", \"2. Avatar\"]', 2, 10, 'Match the following movies:', 120, 'Exercise 38', 'matching', '2025-06-26 11:30:28.000000'),
(39, 'movies/fill.mp3', 'Inception', '2025-06-26 11:30:28.000000', 'Fill in the blank: \"My favorite movie is ___.\"', NULL, 'easy', 'Inception is a popular movie.', 'exercises/ex39.jpg', b'1', b'0', 13, 'A1', '[\"Avatar\", \"Inception\", \"Titanic\", \"Godfather\"]', 3, 10, 'Complete the sentence.', 30, 'Exercise 39', 'fill_in_the_blank', '2025-06-26 11:30:28.000000'),
(40, 'books/fiction.mp3', 'A', '2025-06-26 11:30:28.000000', 'Choose the correct book genre.', NULL, 'easy', '\"1984\" is a famous dystopian fiction.', 'exercises/ex40.jpg', b'1', b'0', 14, 'A1', '[\"A. Fiction\", \"B. Non-Fiction\", \"C. Mystery\", \"D. Fantasy\"]', 1, 10, 'What genre is \"1984\" by George Orwell?', 60, 'Exercise 40', 'multiple_choice', '2025-06-26 11:30:28.000000'),
(41, 'books/match.mp3', '1-A, 2-B', '2025-06-26 11:30:28.000000', 'Match the book with the author.', NULL, 'easy', '1-A, 2-B is correct.', 'exercises/ex41.jpg', b'1', b'0', 14, 'A1', '[\"1. Moby Dick\", \"2. War and Peace\"]', 2, 10, 'Match the following books:', 120, 'Exercise 41', 'matching', '2025-06-26 11:30:28.000000'),
(42, 'books/fill.mp3', 'fiction', '2025-06-26 11:30:28.000000', 'Fill in the blank: \"I enjoy reading ___.\"', NULL, 'easy', 'Fiction is a popular book genre.', 'exercises/ex42.jpg', b'1', b'0', 14, 'A1', '[\"non-fiction\", \"fiction\", \"biography\", \"history\"]', 3, 10, 'Complete the sentence.', 30, 'Exercise 42', 'fill_in_the_blank', '2025-06-26 11:30:28.000000'),
(43, 'art/impressionism.mp3', 'A', '2025-06-26 11:30:28.000000', 'Choose the correct art style.', NULL, 'easy', '\"Starry Night\" is an example of Impressionism.', 'exercises/ex43.jpg', b'1', b'0', 15, 'A1', '[\"A. Impressionism\", \"B. Cubism\", \"C. Surrealism\", \"D. Abstract\"]', 1, 10, 'What style is \"Starry Night\" by Van Gogh?', 60, 'Exercise 43', 'multiple_choice', '2025-06-26 11:30:28.000000'),
(44, 'art/match.mp3', '1-A, 2-B', '2025-06-26 11:30:28.000000', 'Match the artwork with the artist.', NULL, 'easy', '1-A, 2-B is correct.', 'exercises/ex44.jpg', b'1', b'0', 15, 'A1', '[\"1. The Persistence of Memory\", \"2. The Scream\"]', 2, 10, 'Match the following artworks:', 120, 'Exercise 44', 'matching', '2025-06-26 11:30:28.000000'),
(45, 'art/fill.mp3', 'abstract', '2025-06-26 11:30:28.000000', 'Fill in the blank: \"This painting is in the ___ style.\"', NULL, 'easy', 'Abstract is a popular art style.', 'exercises/ex45.jpg', b'1', b'0', 15, 'A1', '[\"realism\", \"abstract\", \"impressionism\", \"cubism\"]', 3, 10, 'Complete the sentence.', 30, 'Exercise 45', 'fill_in_the_blank', '2025-06-26 11:30:28.000000'),
(46, 'nature/oxygen.mp3', 'A', '2025-06-26 11:30:28.000000', 'Choose the correct nature element.', NULL, 'easy', 'Trees produce oxygen.', 'exercises/ex46.jpg', b'1', b'0', 16, 'A1', '[\"A. Oxygen\", \"B. Carbon Dioxide\", \"C. Nitrogen\", \"D. Hydrogen\"]', 1, 10, 'What do trees produce?', 60, 'Exercise 46', 'multiple_choice', '2025-06-26 11:30:28.000000'),
(47, 'nature/match.mp3', '1-A, 2-B', '2025-06-26 11:30:28.000000', 'Match the nature element with the description.', NULL, 'easy', '1-A, 2-B is correct.', 'exercises/ex47.jpg', b'1', b'0', 16, 'A1', '[\"1. Water\", \"2. Fire\"]', 2, 10, 'Match the following elements:', 120, 'Exercise 47', 'matching', '2025-06-26 11:30:28.000000'),
(48, 'nature/fill.mp3', 'round', '2025-06-26 11:30:28.000000', 'Fill in the blank: \"The earth is ___.\"', NULL, 'easy', 'Round is the correct shape of the earth.', 'exercises/ex48.jpg', b'1', b'0', 16, 'A1', '[\"flat\", \"round\", \"square\", \"oval\"]', 3, 10, 'Complete the sentence.', 30, 'Exercise 48', 'fill_in_the_blank', '2025-06-26 11:30:28.000000'),
(49, 'technology/telephone.mp3', 'A', '2025-06-26 11:30:28.000000', 'Choose the correct technology.', NULL, 'easy', 'We use a telephone to make calls.', 'exercises/ex49.jpg', b'1', b'0', 17, 'A1', '[\"A. Telephone\", \"B. Television\", \"C. Radio\", \"D. Computer\"]', 1, 10, 'What device do we use to make calls?', 60, 'Exercise 49', 'multiple_choice', '2025-06-26 11:30:28.000000'),
(50, 'technology/match.mp3', '1-A, 2-B', '2025-06-26 11:30:28.000000', 'Match the technology with the function.', NULL, 'easy', '1-A, 2-B is correct.', 'exercises/ex50.jpg', b'1', b'0', 17, 'A1', '[\"1. Microwave\", \"2. Refrigerator\"]', 2, 10, 'Match the following technologies:', 120, 'Exercise 50', 'matching', '2025-06-26 11:30:28.000000'),
(51, 'technology/fill.mp3', 'computer', '2025-06-26 11:30:28.000000', 'Fill in the blank: \"I use my ___ to browse the internet.\"', NULL, 'easy', 'Computer is the correct device for browsing.', 'exercises/ex51.jpg', b'1', b'0', 17, 'A1', '[\"tablet\", \"computer\", \"phone\", \"watch\"]', 3, 10, 'Complete the sentence.', 30, 'Exercise 51', 'fill_in_the_blank', '2025-06-26 11:30:28.000000'),
(52, 'health/exercise.mp3', 'A', '2025-06-26 11:30:28.000000', 'Choose the correct health activity.', NULL, 'easy', 'Exercise is important for health.', 'exercises/ex52.jpg', b'1', b'0', 18, 'A1', '[\"A. Exercise\", \"B. Sit all day\", \"C. Eat junk food\", \"D. Sleep late\"]', 1, 10, 'What should you do to stay healthy?', 60, 'Exercise 52', 'multiple_choice', '2025-06-26 11:30:28.000000'),
(53, 'health/match.mp3', '1-A, 2-B', '2025-06-26 11:30:28.000000', 'Match the health activity with the benefit.', NULL, 'easy', '1-A, 2-B is correct.', 'exercises/ex53.jpg', b'1', b'0', 18, 'A1', '[\"1. Running\", \"2. Reading\"]', 2, 10, 'Match the following activities:', 120, 'Exercise 53', 'matching', '2025-06-26 11:30:28.000000'),
(54, 'health/fill.mp3', 'exercise', '2025-06-26 11:30:28.000000', 'Fill in the blank: \"I feel great when I ___.\"', NULL, 'easy', 'Exercise is the correct activity.', 'exercises/ex54.jpg', b'1', b'0', 18, 'A1', '[\"eat\", \"sleep\", \"exercise\", \"work\"]', 3, 10, 'Complete the sentence.', 30, 'Exercise 54', 'fill_in_the_blank', '2025-06-26 11:30:28.000000'),
(55, 'education/school.mp3', 'A', '2025-06-26 11:30:28.000000', 'Choose the correct education level.', NULL, 'easy', 'School is where you learn.', 'exercises/ex55.jpg', b'1', b'0', 19, 'A1', '[\"A. School\", \"B. Hospital\", \"C. Office\", \"D. Factory\"]', 1, 10, 'What do you call a place where you learn?', 60, 'Exercise 55', 'multiple_choice', '2025-06-26 11:30:28.000000'),
(56, 'education/match.mp3', '1-A, 2-B', '2025-06-26 11:30:28.000000', 'Match the education level with the description.', NULL, 'easy', '1-A, 2-B is correct.', 'exercises/ex56.jpg', b'1', b'0', 19, 'A1', '[\"1. Primary\", \"2. Secondary\"]', 2, 10, 'Match the following levels:', 120, 'Exercise 56', 'matching', '2025-06-26 11:30:28.000000'),
(57, 'education/fill.mp3', 'university', '2025-06-26 11:30:28.000000', 'Fill in the blank: \"I study at a ___.\"', NULL, 'easy', 'University is a higher education institution.', 'exercises/ex57.jpg', b'1', b'0', 19, 'A1', '[\"school\", \"college\", \"university\", \"institute\"]', 3, 10, 'Complete the sentence.', 30, 'Exercise 57', 'fill_in_the_blank', '2025-06-26 11:30:28.000000'),
(58, 'shopping/noodles.mp3', 'A', '2025-06-26 11:30:28.000000', 'Choose the correct shopping item.', NULL, 'easy', 'Noodles are used to cook pasta.', 'exercises/ex58.jpg', b'1', b'0', 20, 'A1', '[\"A. Noodles\", \"B. Bread\", \"C. Rice\", \"D. Flour\"]', 1, 10, 'What do you need to buy to cook pasta?', 60, 'Exercise 58', 'multiple_choice', '2025-06-26 11:30:28.000000'),
(59, 'shopping/match.mp3', '1-A, 2-B', '2025-06-26 11:30:28.000000', 'Match the shopping item with the category.', NULL, 'easy', '1-A, 2-B is correct.', 'exercises/ex59.jpg', b'1', b'0', 20, 'A1', '[\"1. Apple\", \"2. Carrot\"]', 2, 10, 'Match the following items:', 120, 'Exercise 59', 'matching', '2025-06-26 11:30:28.000000'),
(60, 'shopping/fill.mp3', 'milk', '2025-06-26 11:30:28.000000', 'Fill in the blank: \"I need to buy ___ from the store.\"', NULL, 'easy', 'Milk is a common grocery item.', 'exercises/ex60.jpg', b'1', b'0', 20, 'A1', '[\"bread\", \"milk\", \"eggs\", \"cheese\"]', 3, 10, 'Complete the sentence.', 30, 'Exercise 60', 'fill_in_the_blank', '2025-06-26 11:30:28.000000'),
(61, 'transportation/car.mp3', 'A', '2025-06-26 11:30:28.000000', 'Choose the correct transportation.', NULL, 'easy', 'A car is driven on the road.', 'exercises/ex61.jpg', b'1', b'0', 21, 'A1', '[\"A. Car\", \"B. Boat\", \"C. Plane\", \"D. Train\"]', 1, 10, 'What vehicle do you drive on the road?', 60, 'Exercise 61', 'multiple_choice', '2025-06-26 11:30:28.000000'),
(62, 'transportation/match.mp3', '1-A, 2-B', '2025-06-26 11:30:28.000000', 'Match the transportation with the description.', NULL, 'easy', '1-A, 2-B is correct.', 'exercises/ex62.jpg', b'1', b'0', 21, 'A1', '[\"1. Bicycle\", \"2. Motorcycle\"]', 2, 10, 'Match the following vehicles:', 120, 'Exercise 62', 'matching', '2025-06-26 11:30:28.000000'),
(63, 'transportation/fill.mp3', 'bus', '2025-06-26 11:30:28.000000', 'Fill in the blank: \"I go to work by ___.\"', NULL, 'easy', 'Bus is a common transportation mode.', 'exercises/ex63.jpg', b'1', b'0', 21, 'A1', '[\"car\", \"bus\", \"train\", \"bike\"]', 3, 10, 'Complete the sentence.', 30, 'Exercise 63', 'fill_in_the_blank', '2025-06-26 11:30:28.000000'),
(64, 'communication/computer.mp3', 'A', '2025-06-26 11:30:28.000000', 'Choose the correct communication tool.', NULL, 'easy', 'You use a computer to send an email.', 'exercises/ex64.jpg', b'1', b'0', 22, 'A1', '[\"A. Computer\", \"B. Refrigerator\", \"C. Washing Machine\", \"D. Microwave\"]', 1, 10, 'What do you use to send an email?', 60, 'Exercise 64', 'multiple_choice', '2025-06-26 11:30:28.000000'),
(65, 'communication/match.mp3', '1-A, 2-B', '2025-06-26 11:30:28.000000', 'Match the communication tool with the function.', NULL, 'easy', '1-A, 2-B is correct.', 'exercises/ex65.jpg', b'1', b'0', 22, 'A1', '[\"1. Phone\", \"2. Camera\"]', 2, 10, 'Match the following tools:', 120, 'Exercise 65', 'matching', '2025-06-26 11:30:28.000000'),
(66, 'communication/fill.mp3', 'phone', '2025-06-26 11:30:28.000000', 'Fill in the blank: \"I use my ___ to call my friend.\"', NULL, 'easy', 'Phone is the correct device to call.', 'exercises/ex66.jpg', b'1', b'0', 22, 'A1', '[\"tablet\", \"phone\", \"computer\", \"watch\"]', 3, 10, 'Complete the sentence.', 30, 'Exercise 66', 'fill_in_the_blank', '2025-06-26 11:30:28.000000'),
(67, 'environment/recycle.mp3', 'A', '2025-06-26 11:30:28.000000', 'Choose the correct environment action.', NULL, 'easy', 'Recycle to help the environment.', 'exercises/ex67.jpg', b'1', b'0', 23, 'A1', '[\"A. Recycle\", \"B. Waste\", \"C. Pollute\", \"D. Ignore\"]', 1, 10, 'What should you do to help the planet?', 60, 'Exercise 67', 'multiple_choice', '2025-06-26 11:30:28.000000'),
(68, 'environment/match.mp3', '1-A, 2-B', '2025-06-26 11:30:28.000000', 'Match the environment action with the benefit.', NULL, 'easy', '1-A, 2-B is correct.', 'exercises/ex68.jpg', b'1', b'0', 23, 'A1', '[\"1. Planting trees\", \"2. Driving cars\"]', 2, 10, 'Match the following actions:', 120, 'Exercise 68', 'matching', '2025-06-26 11:30:28.000000'),
(69, 'environment/fill.mp3', 'protect', '2025-06-26 11:30:28.000000', 'Fill in the blank: \"We should ___ the earth.\"', NULL, 'easy', 'Protect is the correct action for the earth.', 'exercises/ex69.jpg', b'1', b'0', 23, 'A1', '[\"destroy\", \"ignore\", \"pollute\", \"protect\"]', 3, 10, 'Complete the sentence.', 30, 'Exercise 69', 'fill_in_the_blank', '2025-06-26 11:30:28.000000'),
(70, 'society/community.mp3', 'A', '2025-06-26 11:30:28.000000', 'Choose the correct society aspect.', NULL, 'easy', 'Community is important in society.', 'exercises/ex70.jpg', b'1', b'0', 24, 'A1', '[\"A. Community\", \"B. Isolation\", \"C. Conflict\", \"D. Ignorance\"]', 1, 10, 'What is an important aspect of society?', 60, 'Exercise 70', 'multiple_choice', '2025-06-26 11:30:28.000000'),
(71, 'society/match.mp3', '1-A, 2-B', '2025-06-26 11:30:28.000000', 'Match the society aspect with the description.', NULL, 'easy', '1-A, 2-B is correct.', 'exercises/ex71.jpg', b'1', b'0', 24, 'A1', '[\"1. Education\", \"2. Propaganda\"]', 2, 10, 'Match the following aspects:', 120, 'Exercise 71', 'matching', '2025-06-26 11:30:28.000000'),
(72, 'society/fill.mp3', 'education', '2025-06-26 11:30:28.000000', 'Fill in the blank: \"In my society, we value ___.\"', NULL, 'easy', 'Education is valued in society.', 'exercises/ex72.jpg', b'1', b'0', 24, 'A1', '[\"education\", \"ignorance\", \"conflict\", \"poverty\"]', 3, 10, 'Complete the sentence.', 30, 'Exercise 72', 'fill_in_the_blank', '2025-06-26 11:30:28.000000'),
(73, 'culture/pho.mp3', 'A', '2025-06-26 11:30:28.000000', 'Choose the correct culture element.', NULL, 'easy', 'Pho is a traditional Vietnamese dish.', 'exercises/ex73.jpg', b'1', b'0', 25, 'A1', '[\"A. Pho\", \"B. Sushi\", \"C. Pasta\", \"D. Tacos\"]', 1, 10, 'What is a common Vietnamese dish?', 60, 'Exercise 73', 'multiple_choice', '2025-06-26 11:30:28.000000'),
(74, 'culture/match.mp3', '1-A, 2-B', '2025-06-26 11:30:28.000000', 'Match the culture element with the description.', NULL, 'easy', '1-A, 2-B is correct.', 'exercises/ex74.jpg', b'1', b'0', 25, 'A1', '[\"1. Kimono\", \"2. Ao Dai\"]', 2, 10, 'Match the following elements:', 120, 'Exercise 74', 'matching', '2025-06-26 11:30:28.000000'),
(75, 'culture/fill.mp3', 'pho', '2025-06-26 11:30:28.000000', 'Fill in the blank: \"My favorite food is ___.\"', NULL, 'easy', 'Pho is a popular Vietnamese food.', 'exercises/ex75.jpg', b'1', b'0', 25, 'A1', '[\"sushi\", \"pho\", \"pasta\", \"tacos\"]', 3, 10, 'Complete the sentence.', 30, 'Exercise 75', 'fill_in_the_blank', '2025-06-26 11:30:28.000000'),
(76, 'vietnamese/language.mp3', 'A', '2025-06-26 12:16:19.000000', 'What is the primary language in Vietnam?', NULL, 'easy', 'Vietnamese is the official language of Vietnam.', 'exercises/ex76.jpg', b'1', b'0', 26, 'A1', '[\"A. Vietnamese\", \"B. English\", \"C. French\", \"D. Chinese\"]', 1, 10, 'What is the primary language in Vietnam?', 60, 'Exercise 76', 'multiple_choice', '2025-06-26 12:16:19.000000'),
(77, 'indonesia/capital.mp3', 'A', '2025-06-26 12:16:19.000000', 'What is the capital of Indonesia?', NULL, 'easy', 'Jakarta is the capital of Indonesia.', 'exercises/ex77.jpg', b'1', b'0', 27, 'A1', '[\"A. Jakarta\", \"B. Bali\", \"C. Sumatra\", \"D. Kalimantan\"]', 1, 10, 'What is the capital of Indonesia?', 60, 'Exercise 77', 'multiple_choice', '2025-06-26 12:16:19.000000'),
(78, 'banhmi/ingredient.mp3', 'A', '2025-06-26 12:16:19.000000', 'What is the main ingredient in a Banh Mi?', NULL, 'easy', 'Bread is the main ingredient in a Banh Mi.', 'exercises/ex78.jpg', b'1', b'0', 28, 'A1', '[\"A. Bread\", \"B. Rice\", \"C. Noodles\", \"D. Potato\"]', 1, 10, 'What is the main ingredient in a Banh Mi?', 60, 'Exercise 78', 'multiple_choice', '2025-06-26 12:16:19.000000'),
(79, 'malaysia/capital.mp3', 'A', '2025-06-26 12:16:19.000000', 'What is the capital of Malaysia?', NULL, 'easy', 'Kuala Lumpur is the capital of Malaysia.', 'exercises/ex79.jpg', b'1', b'0', 29, 'A1', '[\"A. Kuala Lumpur\", \"B. Penang\", \"C. Malacca\", \"D. Sabah\"]', 1, 10, 'What is the capital of Malaysia?', 60, 'Exercise 79', 'multiple_choice', '2025-06-26 12:16:19.000000'),
(80, 'scuba/gas.mp3', 'B', '2025-06-26 12:16:19.000000', 'What is the primary gas in a scuba tank?', NULL, 'easy', 'Nitrogen is used in scuba tanks.', 'exercises/ex80.jpg', b'1', b'0', 30, 'A1', '[\"A. Oxygen\", \"B. Nitrogen\", \"C. Helium\", \"D. Carbon Dioxide\"]', 1, 10, 'What is the primary gas in a scuba tank?', 60, 'Exercise 80', 'multiple_choice', '2025-06-26 12:16:19.000000'),
(81, 'philippines/capital.mp3', 'A', '2025-06-26 12:20:10.000000', 'What is the capital of the Philippines?', NULL, 'easy', 'Manila is the capital of the Philippines.', 'exercises/ex81.jpg', b'1', b'0', 31, 'A1', '[\"A. Manila\", \"B. Cebu\", \"C. Davao\", \"D. Quezon City\"]', 1, 10, 'What is the capital of the Philippines?', 60, 'Exercise 81', 'multiple_choice', '2025-06-26 12:20:10.000000'),
(82, 'kimchi/ingredient.mp3', 'A', '2025-06-26 12:20:10.000000', 'What is the main ingredient in a Kimchi?', NULL, 'easy', 'Cabbage is the main ingredient in a Kimchi.', 'exercises/ex82.jpg', b'1', b'0', 32, 'A1', '[\"A. Cabbage\", \"B. Radish\", \"C. Garlic\", \"D. Ginger\"]', 1, 10, 'What is the main ingredient in a Kimchi?', 60, 'Exercise 82', 'multiple_choice', '2025-06-26 12:20:10.000000'),
(83, 'singapore/capital.mp3', 'D', '2025-06-26 12:20:10.000000', 'What is the capital of Singapore?', NULL, 'easy', 'Singapore is the capital of Singapore.', 'exercises/ex83.jpg', b'1', b'0', 33, 'A1', '[\"A. Kuala Lumpur\", \"B. Bangkok\", \"C. Hanoi\", \"D. Singapore\"]', 1, 10, 'What is the capital of Singapore?', 60, 'Exercise 83', 'multiple_choice', '2025-06-26 12:20:10.000000'),
(84, 'singapore/language.mp3', 'D', '2025-06-26 12:20:10.000000', 'What is the primary language in Singapore?', NULL, 'easy', 'English is one of the official languages of Singapore.', 'exercises/ex84.jpg', b'1', b'0', 34, 'A1', '[\"A. Mandarin\", \"B. Malay\", \"C. Tamil\", \"D. English\"]', 1, 10, 'What is the primary language in Singapore?', 60, 'Exercise 84', 'multiple_choice', '2025-06-26 12:20:10.000000'),
(85, 'brunei/capital.mp3', 'A', '2025-06-26 12:20:10.000000', 'What is the capital of Brunei?', NULL, 'easy', 'Bandar Seri Begawan is the capital of Brunei.', 'exercises/ex85.jpg', b'1', b'0', 35, 'A1', '[\"A. Bandar Seri Begawan\", \"B. Kuala Lumpur\", \"C. Jakarta\", \"D. Manila\"]', 1, 10, 'What is the capital of Brunei?', 60, 'Exercise 85', 'multiple_choice', '2025-06-26 12:20:10.000000'),
(86, 'laksa/ingredient.mp3', 'A', '2025-06-26 12:20:10.000000', 'What is the main ingredient in a Laksa?', NULL, 'easy', 'Noodles are the main ingredient in a Laksa.', 'exercises/ex86.jpg', b'1', b'0', 36, 'A1', '[\"A. Noodles\", \"B. Rice\", \"C. Bread\", \"D. Potato\"]', 1, 10, 'What is the main ingredient in a Laksa?', 60, 'Exercise 86', 'multiple_choice', '2025-06-26 12:20:10.000000'),
(87, 'myanmar/capital.mp3', 'B', '2025-06-26 12:20:10.000000', 'What is the capital of Myanmar?', NULL, 'easy', 'Naypyidaw is the capital of Myanmar.', 'exercises/ex87.jpg', b'1', b'0', 37, 'A1', '[\"A. Yangon\", \"B. Naypyidaw\", \"C. Mandalay\", \"D. Bagan\"]', 1, 10, 'What is the capital of Myanmar?', 60, 'Exercise 87', 'multiple_choice', '2025-06-26 12:20:10.000000'),
(88, 'myanmar/language.mp3', 'A', '2025-06-26 12:20:10.000000', 'What is the primary language in Myanmar?', NULL, 'easy', 'Burmese is the official language of Myanmar.', 'exercises/ex88.jpg', b'1', b'0', 38, 'A1', '[\"A. Burmese\", \"B. Thai\", \"C. Lao\", \"D. Khmer\"]', 1, 10, 'What is the primary language in Myanmar?', 60, 'Exercise 88', 'multiple_choice', '2025-06-26 12:20:10.000000'),
(89, 'cambodia/capital.mp3', 'A', '2025-06-26 12:20:10.000000', 'What is the capital of Cambodia?', NULL, 'easy', 'Phnom Penh is the capital of Cambodia.', 'exercises/ex89.jpg', b'1', b'0', 39, 'A1', '[\"A. Phnom Penh\", \"B. Siem Reap\", \"C. Battambang\", \"D. Sihanoukville\"]', 1, 10, 'What is the capital of Cambodia?', 60, 'Exercise 89', 'multiple_choice', '2025-06-26 12:20:10.000000'),
(90, 'pho/ingredient.mp3', 'A', '2025-06-26 12:20:10.000000', 'What is the main ingredient in a Pho?', NULL, 'easy', 'Noodles are the main ingredient in a Pho.', 'exercises/ex90.jpg', b'1', b'0', 40, 'A1', '[\"A. Noodles\", \"B. Rice\", \"C. Bread\", \"D. Potato\"]', 1, 10, 'What is the main ingredient in a Pho?', 60, 'Exercise 90', 'multiple_choice', '2025-06-26 12:20:10.000000');

-- --------------------------------------------------------

--
-- Table structure for table `exercise_results`
--

CREATE TABLE `exercise_results` (
  `id` bigint(20) NOT NULL,
  `answers_correct` int(11) DEFAULT 0,
  `attempt_number` int(11) DEFAULT 1,
  `created_at` datetime(6) NOT NULL,
  `is_completed` tinyint(1) DEFAULT 1,
  `percentage` decimal(5,2) DEFAULT NULL,
  `score` decimal(5,2) DEFAULT NULL,
  `time_taken` int(11) DEFAULT NULL,
  `total_questions` int(11) DEFAULT 0,
  `updated_at` datetime(6) DEFAULT NULL,
  `exercise_id` bigint(20) NOT NULL,
  `lesson_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `flashcards`
--

CREATE TABLE `flashcards` (
  `id` bigint(20) NOT NULL,
  `audio_url` varchar(255) DEFAULT NULL,
  `back_text` varchar(2000) NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `definition` varchar(255) DEFAULT NULL,
  `difficulty` enum('EASY','MEDIUM','HARD') DEFAULT NULL,
  `difficulty_level` enum('BEGINNER','INTERMEDIATE','ADVANCED') DEFAULT NULL,
  `example` varchar(255) DEFAULT NULL,
  `front_text` varchar(1000) NOT NULL,
  `hint` varchar(500) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `level` varchar(255) DEFAULT NULL,
  `order_index` int(11) NOT NULL,
  `tags` varchar(500) DEFAULT NULL,
  `term` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `flashcard_set_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `flashcards`
--

INSERT INTO `flashcards` (`id`, `audio_url`, `back_text`, `category`, `created_at`, `definition`, `difficulty`, `difficulty_level`, `example`, `front_text`, `hint`, `image_url`, `is_active`, `level`, `order_index`, `tags`, `term`, `updated_at`, `flashcard_set_id`) VALUES
(1, NULL, 'Quả táo', 'Vocabulary', '2025-06-27 10:14:07.000000', 'A round fruit with red or green skin.', 'EASY', 'BEGINNER', 'I eat an apple.', 'Apple', 'A common fruit', NULL, b'1', 'BEGINNER', 1, 'fruit, food', 'Apple', NULL, 1),
(2, NULL, 'Quyển sách', 'Vocabulary', '2025-06-27 10:14:07.000000', 'A set of written pages.', 'EASY', 'BEGINNER', 'This is my book.', 'Book', 'You read it', NULL, b'1', 'BEGINNER', 2, 'object, study', 'Book', NULL, 1),
(3, NULL, 'Xe hơi', 'Vocabulary', '2025-06-27 10:14:07.000000', 'A road vehicle with four wheels.', 'EASY', 'BEGINNER', 'The car is red.', 'Car', 'You drive it', NULL, b'1', 'BEGINNER', 3, 'vehicle, transport', 'Car', NULL, 1),
(4, NULL, 'Con chó', 'Vocabulary', '2025-06-27 10:14:07.000000', 'A common domestic animal.', 'EASY', 'BEGINNER', 'The dog barks.', 'Dog', 'A pet animal', NULL, b'1', 'BEGINNER', 4, 'animal, pet', 'Dog', NULL, 1),
(5, NULL, 'Đi', 'Vocabulary', '2025-06-27 10:14:07.000000', 'To move or travel somewhere.', 'EASY', 'BEGINNER', 'I go to school.', 'Go', 'To move from one place to another', NULL, b'1', 'BEGINNER', 1, 'verb, move', 'Go', NULL, 2),
(6, NULL, 'Ăn', 'Vocabulary', '2025-06-27 10:14:07.000000', 'To put food in your mouth and swallow it.', 'EASY', 'BEGINNER', 'They eat lunch.', 'Eat', 'To consume food', NULL, b'1', 'BEGINNER', 2, 'verb, food', 'Eat', NULL, 2),
(7, NULL, 'Đọc', 'Vocabulary', '2025-06-27 10:14:07.000000', 'To look at and understand written words.', 'EASY', 'BEGINNER', 'She reads a book.', 'Read', 'To look at and understand words', NULL, b'1', 'BEGINNER', 3, 'verb, study', 'Read', NULL, 2),
(8, NULL, 'Viết', 'Vocabulary', '2025-06-27 10:14:07.000000', 'To make letters or words on a surface.', 'EASY', 'BEGINNER', 'He writes a letter.', 'Write', 'To form letters or words', NULL, b'1', 'BEGINNER', 4, 'verb, study', 'Write', NULL, 2),
(9, NULL, 'Màu đỏ', 'Vocabulary', '2025-06-27 10:14:07.000000', 'The color of blood.', 'EASY', 'BEGINNER', 'The apple is red.', 'Red', 'A color', NULL, b'1', 'BEGINNER', 1, 'color', 'Red', NULL, 3),
(10, NULL, 'Màu xanh', 'Vocabulary', '2025-06-27 10:14:07.000000', 'The color of the sky.', 'EASY', 'BEGINNER', 'The sky is blue.', 'Blue', 'A color', NULL, b'1', 'BEGINNER', 2, 'color', 'Blue', NULL, 3),
(11, NULL, 'Màu xanh lá', 'Vocabulary', '2025-06-27 10:14:07.000000', 'The color of grass.', 'EASY', 'BEGINNER', 'The grass is green.', 'Green', 'A color', NULL, b'1', 'BEGINNER', 3, 'color', 'Green', NULL, 3),
(12, NULL, 'Màu vàng', 'Vocabulary', '2025-06-27 10:14:07.000000', 'The color of the sun.', 'EASY', 'BEGINNER', 'The sun is yellow.', 'Yellow', 'A color', NULL, b'1', 'BEGINNER', 4, 'color', 'Yellow', NULL, 3),
(13, NULL, 'Quả chuối', 'Vocabulary', '2025-06-27 10:14:07.000000', 'A long curved fruit.', 'EASY', 'BEGINNER', 'Bananas are yellow.', 'Banana', 'A yellow fruit', NULL, b'1', 'BEGINNER', 1, 'fruit, food', 'Banana', NULL, 4),
(14, NULL, 'Quả cam', 'Vocabulary', '2025-06-27 10:14:07.000000', 'A round citrus fruit.', 'EASY', 'BEGINNER', 'I like orange juice.', 'Orange', 'A citrus fruit', NULL, b'1', 'BEGINNER', 2, 'fruit, food', 'Orange', NULL, 4),
(15, NULL, 'Quả nho', 'Vocabulary', '2025-06-27 10:14:07.000000', 'A small round fruit.', 'EASY', 'BEGINNER', 'Grapes are sweet.', 'Grape', 'A small fruit', NULL, b'1', 'BEGINNER', 3, 'fruit, food', 'Grape', NULL, 4),
(16, NULL, 'Quả xoài', 'Vocabulary', '2025-06-27 10:14:07.000000', 'A sweet tropical fruit.', 'EASY', 'BEGINNER', 'Mangoes are delicious.', 'Mango', 'A tropical fruit', NULL, b'1', 'BEGINNER', 4, 'fruit, food', 'Mango', NULL, 4),
(17, NULL, 'Con mèo', 'Vocabulary', '2025-06-27 10:14:07.000000', 'A small domestic animal.', 'EASY', 'BEGINNER', 'The cat sleeps.', 'Cat', 'A pet animal', NULL, b'1', 'BEGINNER', 1, 'animal, pet', 'Cat', NULL, 5),
(18, NULL, 'Con chim', 'Vocabulary', '2025-06-27 10:14:07.000000', 'An animal with wings.', 'EASY', 'BEGINNER', 'Birds can fly.', 'Bird', 'It can fly', NULL, b'1', 'BEGINNER', 2, 'animal, bird', 'Bird', NULL, 5),
(19, NULL, 'Con cá', 'Vocabulary', '2025-06-27 10:14:07.000000', 'An animal that lives in water.', 'EASY', 'BEGINNER', 'Fish swim in water.', 'Fish', 'It swims', NULL, b'1', 'BEGINNER', 3, 'animal, fish', 'Fish', NULL, 5),
(20, NULL, 'Con ngựa', 'Vocabulary', '2025-06-27 10:14:07.000000', 'A large animal for riding.', 'EASY', 'BEGINNER', 'The horse runs fast.', 'Horse', 'It runs fast', NULL, b'1', 'BEGINNER', 4, 'animal, horse', 'Horse', NULL, 5),
(21, NULL, 'Cuộc họp', 'Business', '2025-06-27 10:14:47.000000', 'A gathering of people for discussion.', 'MEDIUM', 'INTERMEDIATE', 'We have a meeting at 9.', 'Meeting', 'Business event', NULL, b'1', 'INTERMEDIATE', 1, 'business, work', 'Meeting', NULL, 6),
(22, NULL, 'Hạn chót', 'Business', '2025-06-27 10:14:47.000000', 'The latest time for something.', 'MEDIUM', 'INTERMEDIATE', 'The deadline is tomorrow.', 'Deadline', 'Due date', NULL, b'1', 'INTERMEDIATE', 2, 'business, time', 'Deadline', NULL, 6),
(23, NULL, 'Hợp đồng', 'Business', '2025-06-27 10:14:47.000000', 'A legal agreement.', 'MEDIUM', 'INTERMEDIATE', 'Sign the contract.', 'Contract', 'Legal document', NULL, b'1', 'INTERMEDIATE', 3, 'business, legal', 'Contract', NULL, 6),
(24, NULL, 'Thăng chức', 'Business', '2025-06-27 10:14:47.000000', 'A move to a higher position.', 'MEDIUM', 'INTERMEDIATE', 'She got a promotion.', 'Promotion', 'Career advancement', NULL, b'1', 'INTERMEDIATE', 4, 'business, career', 'Promotion', NULL, 6),
(25, NULL, 'Sân bay', 'Travel', '2025-06-27 10:14:47.000000', 'A place for airplanes.', 'MEDIUM', 'INTERMEDIATE', 'I am at the airport.', 'Airport', 'Travel place', NULL, b'1', 'INTERMEDIATE', 1, 'travel, place', 'Airport', NULL, 7),
(26, NULL, 'Hộ chiếu', 'Travel', '2025-06-27 10:14:47.000000', 'An official travel document.', 'MEDIUM', 'INTERMEDIATE', 'Show your passport.', 'Passport', 'Travel document', NULL, b'1', 'INTERMEDIATE', 2, 'travel, document', 'Passport', NULL, 7),
(27, NULL, 'Hành lý', 'Travel', '2025-06-27 10:14:47.000000', 'Bags for travel.', 'MEDIUM', 'INTERMEDIATE', 'My luggage is heavy.', 'Luggage', 'Travel bags', NULL, b'1', 'INTERMEDIATE', 3, 'travel, bag', 'Luggage', NULL, 7),
(28, NULL, 'Khách du lịch', 'Travel', '2025-06-27 10:14:47.000000', 'A person who travels.', 'MEDIUM', 'INTERMEDIATE', 'Tourists visit Hanoi.', 'Tourist', 'A traveler', NULL, b'1', 'INTERMEDIATE', 4, 'travel, person', 'Tourist', NULL, 7),
(29, NULL, 'Phần mềm', 'Technology', '2025-06-27 10:14:47.000000', 'Programs for computers.', 'MEDIUM', 'INTERMEDIATE', 'Install the software.', 'Software', 'Computer program', NULL, b'1', 'INTERMEDIATE', 1, 'tech, computer', 'Software', NULL, 8),
(30, NULL, 'Phần cứng', 'Technology', '2025-06-27 10:14:47.000000', 'Physical parts of a computer.', 'MEDIUM', 'INTERMEDIATE', 'The hardware is new.', 'Hardware', 'Physical computer parts', NULL, b'1', 'INTERMEDIATE', 2, 'tech, computer', 'Hardware', NULL, 8),
(31, NULL, 'Mạng', 'Technology', '2025-06-27 10:14:47.000000', 'A system of connections.', 'MEDIUM', 'INTERMEDIATE', 'The network is down.', 'Network', 'Connection system', NULL, b'1', 'INTERMEDIATE', 3, 'tech, connection', 'Network', NULL, 8),
(32, NULL, 'Cơ sở dữ liệu', 'Technology', '2025-06-27 10:14:47.000000', 'A collection of data.', 'MEDIUM', 'INTERMEDIATE', 'Check the database.', 'Database', 'Data storage', NULL, b'1', 'INTERMEDIATE', 4, 'tech, data', 'Database', NULL, 8),
(33, NULL, 'Chúc may mắn', 'Idioms', '2025-06-27 10:14:47.000000', 'Wish someone good luck.', 'HARD', 'ADVANCED', 'Break a leg in your exam!', 'Break a leg', 'Good luck', NULL, b'1', 'ADVANCED', 1, 'idiom, luck', 'Break a leg', NULL, 9),
(34, NULL, 'Học bài', 'Idioms', '2025-06-27 10:14:47.000000', 'To study hard.', 'HARD', 'ADVANCED', 'I need to hit the books.', 'Hit the books', 'To study', NULL, b'1', 'ADVANCED', 2, 'idiom, study', 'Hit the books', NULL, 9),
(35, NULL, 'Dễ dàng', 'Idioms', '2025-06-27 10:14:47.000000', 'Something very easy.', 'HARD', 'ADVANCED', 'The test was a piece of cake.', 'Piece of cake', 'Very easy', NULL, b'1', 'ADVANCED', 3, 'idiom, easy', 'Piece of cake', NULL, 9),
(36, NULL, 'Không khỏe', 'Idioms', '2025-06-27 10:14:47.000000', 'Feeling ill.', 'HARD', 'ADVANCED', 'I feel under the weather.', 'Under the weather', 'Not feeling well', NULL, b'1', 'ADVANCED', 4, 'idiom, health', 'Under the weather', NULL, 9),
(37, NULL, 'Phát sinh', 'Vocabulary', '2025-06-27 10:14:47.000000', 'To happen or occur.', 'HARD', 'ADVANCED', 'Problems may arise.', 'Arise', 'To happen', NULL, b'1', 'ADVANCED', 1, 'verb, advanced', 'Arise', NULL, 10),
(38, NULL, 'Hiểu', 'Vocabulary', '2025-06-27 10:14:47.000000', 'To understand.', 'HARD', 'ADVANCED', 'Do you comprehend?', 'Comprehend', 'To understand', NULL, b'1', 'ADVANCED', 2, 'verb, advanced', 'Comprehend', NULL, 10),
(39, NULL, 'Đàm phán', 'Vocabulary', '2025-06-27 10:14:47.000000', 'To discuss to reach agreement.', 'HARD', 'ADVANCED', 'They negotiate the price.', 'Negotiate', 'To discuss for agreement', NULL, b'1', 'ADVANCED', 3, 'verb, advanced', 'Negotiate', NULL, 10),
(40, NULL, 'Hoàn thành', 'Vocabulary', '2025-06-27 10:14:47.000000', 'To finish something successfully.', 'HARD', 'ADVANCED', 'We accomplish our goals.', 'Accomplish', 'To finish successfully', NULL, b'1', 'ADVANCED', 4, 'verb, advanced', 'Accomplish', NULL, 10);

-- --------------------------------------------------------

--
-- Table structure for table `flashcard_sets`
--

CREATE TABLE `flashcard_sets` (
  `id` bigint(20) NOT NULL,
  `card_count` int(11) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `difficulty_level` varchar(255) DEFAULT NULL,
  `estimated_time_minutes` int(11) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `is_premium` bit(1) DEFAULT NULL,
  `is_public` bit(1) DEFAULT NULL,
  `level` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `tags` varchar(500) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `view_count` int(11) DEFAULT NULL,
  `created_by` bigint(20) DEFAULT NULL,
  `difficulty` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `flashcard_sets`
--

INSERT INTO `flashcard_sets` (`id`, `card_count`, `category`, `created_at`, `description`, `difficulty_level`, `estimated_time_minutes`, `is_active`, `is_premium`, `is_public`, `level`, `name`, `tags`, `updated_at`, `view_count`, `created_by`, `difficulty`, `title`) VALUES
(1, 4, 'Vocabulary', '2025-06-27 10:13:50.000000', 'Common nouns for beginners', 'BEGINNER', 10, b'1', b'0', b'1', 'BEGINNER', 'Basic Nouns', 'noun, basic', '2025-07-12 20:11:04.669018', 0, 1, 'BEGINNER', 'Basic Nouns'),
(2, 4, 'Vocabulary', '2025-06-27 10:13:50.000000', 'Everyday verbs', 'BEGINNER', 10, b'1', b'0', b'1', 'BEGINNER', 'Daily Verbs', 'verb, daily', '2025-07-12 20:11:04.669018', 0, 1, 'BEGINNER', 'Daily Verbs'),
(3, 4, 'Vocabulary', '2025-06-27 10:13:50.000000', 'Basic color words', 'BEGINNER', 8, b'1', b'0', b'1', 'BEGINNER', 'Colors', 'color, basic', '2025-07-12 20:11:04.669018', 0, 1, 'BEGINNER', 'Colors'),
(4, 4, 'Vocabulary', '2025-06-27 10:13:50.000000', 'Names of fruits', 'BEGINNER', 8, b'1', b'0', b'1', 'BEGINNER', 'Fruits', 'fruit, food', '2025-07-12 20:11:04.669018', 0, 1, 'BEGINNER', 'Fruits'),
(5, 4, 'Vocabulary', '2025-06-27 10:13:50.000000', 'Common animals', 'BEGINNER', 8, b'1', b'0', b'1', 'BEGINNER', 'Animals', 'animal, basic', '2025-07-12 20:11:04.669018', 0, 1, 'BEGINNER', 'Animals'),
(6, 4, 'Business', '2025-06-27 10:13:50.000000', 'Vocabulary for business', 'INTERMEDIATE', 12, b'1', b'1', b'1', 'INTERMEDIATE', 'Business English', 'business, work', '2025-07-12 20:11:04.669018', 0, 2, 'INTERMEDIATE', 'Business English'),
(7, 4, 'Travel', '2025-06-27 10:13:50.000000', 'Travel-related words', 'INTERMEDIATE', 12, b'1', b'1', b'1', 'INTERMEDIATE', 'Travel', 'travel, tourism', '2025-07-12 20:11:04.669018', 0, 2, 'INTERMEDIATE', 'Travel'),
(8, 4, 'Technology', '2025-06-27 10:13:50.000000', 'Tech vocabulary', 'INTERMEDIATE', 12, b'1', b'1', b'1', 'INTERMEDIATE', 'Technology', 'tech, IT', '2025-07-12 20:11:04.669018', 0, 2, 'INTERMEDIATE', 'Technology'),
(9, 4, 'Idioms', '2025-06-27 10:13:50.000000', 'Common English idioms', 'ADVANCED', 15, b'1', b'1', b'1', 'ADVANCED', 'Idioms', 'idiom, phrase', '2025-07-12 20:11:04.669018', 0, 2, 'ADVANCED', 'Idioms'),
(10, 4, 'Vocabulary', '2025-06-27 10:13:50.000000', 'Difficult verbs', 'ADVANCED', 15, b'1', b'1', b'1', 'ADVANCED', 'Advanced Verbs', 'verb, advanced', '2025-07-12 20:11:04.669018', 0, 2, 'ADVANCED', 'Advanced Verbs');

-- --------------------------------------------------------

--
-- Table structure for table `health_checks`
--

CREATE TABLE `health_checks` (
  `id` bigint(20) NOT NULL,
  `status` varchar(50) NOT NULL,
  `check_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `total_memory` varchar(50) DEFAULT NULL,
  `free_memory` varchar(50) DEFAULT NULL,
  `max_memory` varchar(50) DEFAULT NULL,
  `available_processors` int(11) DEFAULT NULL,
  `java_version` varchar(50) DEFAULT NULL,
  `os_name` varchar(100) DEFAULT NULL,
  `details` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lessons`
--

CREATE TABLE `lessons` (
  `id` bigint(20) NOT NULL,
  `audio_url` varchar(500) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `description` text DEFAULT NULL,
  `difficulty` varchar(50) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `is_active` bit(1) NOT NULL,
  `is_premium` bit(1) NOT NULL,
  `level` varchar(10) DEFAULT NULL,
  `order_index` int(11) DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `is_public` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lessons`
--

INSERT INTO `lessons` (`id`, `audio_url`, `content`, `created_at`, `description`, `difficulty`, `duration`, `image_url`, `is_active`, `is_premium`, `level`, `order_index`, `title`, `type`, `updated_at`, `is_public`) VALUES
(1, 'greetings/greeting-intro.mp3', 'Hello! How are you?', '2025-06-26 10:13:52.000000', 'Learn basic greetings', 'easy', 10, 'lessons/greeting.jpg', b'1', b'0', 'A1', 1, 'Lesson 1: Greetings', 'vocabulary', '2025-06-26 10:13:52.000000', b'1'),
(2, 'number/numbers-intro.mp3', 'One, two, three...', '2025-06-26 10:13:52.000000', 'Learn to count', 'easy', 10, 'lessons/numbers.jpg', b'1', b'0', 'A1', 2, 'Lesson 2: Numbers', 'vocabulary', '2025-06-26 10:13:52.000000', b'1'),
(3, 'colors/colors-intro.mp3', 'Red, blue, green...', '2025-06-26 10:13:52.000000', 'Learn about colors', 'easy', 10, 'lessons/colors.jpg', b'1', b'0', 'A1', 3, 'Lesson 3: Colors', 'vocabulary', '2025-06-26 10:13:52.000000', b'1'),
(4, 'family/family-intro.mp3', 'This is my mother...', '2025-06-26 10:13:52.000000', 'Talk about your family', 'easy', 10, 'lessons/family.jpg', b'1', b'0', 'A1', 4, 'Lesson 4: Family', 'vocabulary', '2025-06-26 10:13:52.000000', b'1'),
(5, 'food/food-intro.mp3', 'I like pizza...', '2025-06-26 10:13:52.000000', 'Discuss your favorite food', 'easy', 10, 'lessons/food.jpg', b'1', b'0', 'A1', 5, 'Lesson 5: Food', 'vocabulary', '2025-06-26 10:13:52.000000', b'1'),
(6, 'hobbies/hobbies-intro.mp3', 'I enjoy reading...', '2025-06-26 10:13:52.000000', 'Share your hobbies', 'easy', 10, 'lessons/hobbies.jpg', b'1', b'0', 'A1', 6, 'Lesson 6: Hobbies', 'vocabulary', '2025-06-26 10:13:52.000000', b'1'),
(7, 'travel/travel-intro.mp3', 'I have been to Paris...', '2025-06-26 10:13:52.000000', 'Talk about travel', 'easy', 10, 'lessons/travel.jpg', b'1', b'0', 'A1', 7, 'Lesson 7: Travel', 'vocabulary', '2025-06-26 10:13:52.000000', b'1'),
(8, 'work/work-intro.mp3', 'I am a teacher...', '2025-06-26 10:13:52.000000', 'Describe your job', 'easy', 10, 'lessons/work.jpg', b'1', b'0', 'A1', 8, 'Lesson 8: Work', 'vocabulary', '2025-06-26 10:13:52.000000', b'1'),
(9, 'routine/routine-intro.mp3', 'I wake up at 7 AM...', '2025-06-26 10:13:52.000000', 'Talk about your day', 'easy', 10, 'lessons/routine.jpg', b'1', b'0', 'A1', 9, 'Lesson 9: Daily Routine', 'vocabulary', '2025-06-26 10:13:52.000000', b'1'),
(10, 'weather/weather-intro.mp3', 'It is sunny today...', '2025-06-26 10:13:52.000000', 'Discuss the weather', 'easy', 10, 'lessons/weather.jpg', b'1', b'0', 'A1', 10, 'Lesson 10: Weather', 'vocabulary', '2025-06-26 10:13:52.000000', b'1'),
(11, 'sports/sports-intro.mp3', 'I play football...', '2025-06-26 10:13:52.000000', 'Talk about sports', 'easy', 10, 'lessons/sports.jpg', b'1', b'0', 'A1', 11, 'Lesson 11: Sports', 'vocabulary', '2025-06-26 10:13:52.000000', b'1'),
(12, 'music/music-intro.mp3', 'I love rock music...', '2025-06-26 10:13:52.000000', 'Discuss your favorite music', 'easy', 10, 'lessons/music.jpg', b'1', b'0', 'A1', 12, 'Lesson 12: Music', 'vocabulary', '2025-06-26 10:13:52.000000', b'1'),
(13, 'movies/movies-intro.mp3', 'My favorite movie is...', '2025-06-26 10:13:52.000000', 'Talk about movies', 'easy', 10, 'lessons/movies.jpg', b'1', b'0', 'A1', 13, 'Lesson 13: Movies', 'vocabulary', '2025-06-26 10:13:52.000000', b'1'),
(14, 'books/books-intro.mp3', 'I enjoy reading...', '2025-06-26 10:13:52.000000', 'Discuss your favorite books', 'easy', 10, 'lessons/books.jpg', b'1', b'0', 'A1', 14, 'Lesson 14: Books', 'vocabulary', '2025-06-26 10:13:52.000000', b'1'),
(15, 'art/art-intro.mp3', 'I like painting...', '2025-06-26 10:13:52.000000', 'Talk about art', 'easy', 10, 'lessons/art.jpg', b'1', b'0', 'A1', 15, 'Lesson 15: Art', 'vocabulary', '2025-06-26 10:13:52.000000', b'1'),
(16, 'nature/nature-intro.mp3', 'I love the mountains...', '2025-06-26 10:13:52.000000', 'Discuss nature', 'easy', 10, 'lessons/nature.jpg', b'1', b'0', 'A1', 16, 'Lesson 16: Nature', 'vocabulary', '2025-06-26 10:13:52.000000', b'1'),
(17, 'technology/technology-intro.mp3', 'I use a computer...', '2025-06-26 10:13:52.000000', 'Talk about technology', 'easy', 10, 'lessons/technology.jpg', b'1', b'0', 'A1', 17, 'Lesson 17: Technology', 'vocabulary', '2025-06-26 10:13:52.000000', b'1'),
(18, 'health/health-intro.mp3', 'I go to the gym...', '2025-06-26 10:13:52.000000', 'Discuss health', 'easy', 10, 'lessons/health.jpg', b'1', b'0', 'A1', 18, 'Lesson 18: Health', 'vocabulary', '2025-06-26 10:13:52.000000', b'1'),
(19, 'education/education-intro.mp3', 'I study at university...', '2025-06-26 10:13:52.000000', 'Talk about education', 'easy', 10, 'lessons/education.jpg', b'1', b'0', 'A1', 19, 'Lesson 19: Education', 'vocabulary', '2025-06-26 10:13:52.000000', b'1'),
(20, 'shopping/shopping-intro.mp3', 'I need to buy groceries...', '2025-06-26 10:13:52.000000', 'Discuss shopping', 'easy', 10, 'lessons/shopping.jpg', b'1', b'0', 'A1', 20, 'Lesson 20: Shopping', 'vocabulary', '2025-06-26 10:13:52.000000', b'1'),
(21, 'transportation/transportation-intro.mp3', 'I drive a car...', '2025-06-26 10:13:52.000000', 'Talk about transportation', 'easy', 10, 'lessons/transportation.jpg', b'1', b'0', 'A1', 21, 'Lesson 21: Transportation', 'vocabulary', '2025-06-26 10:13:52.000000', b'1'),
(22, 'communication/communication-intro.mp3', 'I use email and chat...', '2025-06-26 10:13:52.000000', 'Discuss communication', 'easy', 10, 'lessons/communication.jpg', b'1', b'0', 'A1', 22, 'Lesson 22: Communication', 'vocabulary', '2025-06-26 10:13:52.000000', b'1'),
(23, 'environment/environment-intro.mp3', 'We should protect nature...', '2025-06-26 10:13:52.000000', 'Talk about the environment', 'easy', 10, 'lessons/environment.jpg', b'1', b'0', 'A1', 23, 'Lesson 23: Environment', 'vocabulary', '2025-06-26 10:13:52.000000', b'1'),
(24, 'society/society-intro.mp3', 'In my society, we value...', '2025-06-26 10:13:52.000000', 'Discuss society', 'easy', 10, 'lessons/society.jpg', b'1', b'0', 'A1', 24, 'Lesson 24: Society', 'vocabulary', '2025-06-26 10:13:52.000000', b'1'),
(25, 'culture/culture-intro.mp3', 'My culture is rich in traditions...', '2025-06-26 10:13:52.000000', 'Talk about culture', 'easy', 10, 'lessons/culture.jpg', b'1', b'0', 'A1', 25, 'Lesson 25: Culture', 'vocabulary', '2025-06-26 10:13:52.000000', b'1'),
(26, 'history/history-intro.mp3', 'In history, we learn about...', '2025-06-26 10:13:52.000000', 'Discuss history', 'easy', 10, 'lessons/history.jpg', b'1', b'0', 'A1', 26, 'Lesson 26: History', 'vocabulary', '2025-06-26 10:13:52.000000', b'1'),
(27, 'science/science-intro.mp3', 'Science helps us understand the world...', '2025-06-26 10:13:52.000000', 'Talk about science', 'easy', 10, 'lessons/science.jpg', b'1', b'0', 'A1', 27, 'Lesson 27: Science', 'vocabulary', '2025-06-26 10:13:52.000000', b'1'),
(28, 'mathematics/mathematics-intro.mp3', 'Math is the language of the universe...', '2025-06-26 10:13:52.000000', 'Discuss mathematics', 'easy', 10, 'lessons/mathematics.jpg', b'1', b'0', 'A1', 28, 'Lesson 28: Mathematics', 'vocabulary', '2025-06-26 10:13:52.000000', b'1'),
(29, 'literature/literature-intro.mp3', 'Literature reflects human experiences...', '2025-06-26 10:13:52.000000', 'Talk about literature', 'easy', 10, 'lessons/literature.jpg', b'1', b'0', 'A1', 29, 'Lesson 29: Literature', 'vocabulary', '2025-06-26 10:13:52.000000', b'1'),
(30, 'philosophy/philosophy-intro.mp3', 'Philosophy explores fundamental questions...', '2025-06-26 10:13:52.000000', 'Discuss philosophy', 'easy', 10, 'lessons/philosophy.jpg', b'1', b'0', 'A1', 30, 'Lesson 30: Philosophy', 'vocabulary', '2025-06-26 10:13:52.000000', b'1'),
(31, 'travel/japan-intro.mp3', 'Let\'s explore Japan!', '2025-06-26 12:18:27.000000', 'Learn about Japan', 'easy', 10, 'lessons/japan.jpg', b'1', b'0', 'A1', 31, 'Lesson 31: Japan', 'vocabulary', '2025-06-26 12:18:27.000000', b'1'),
(32, 'travel/korea-intro.mp3', 'Let\'s explore Korea!', '2025-06-26 12:18:27.000000', 'Learn about Korea', 'easy', 10, 'lessons/korea.jpg', b'1', b'0', 'A1', 32, 'Lesson 32: Korea', 'vocabulary', '2025-06-26 12:18:27.000000', b'1'),
(33, 'travel/thailand-intro.mp3', 'Let\'s explore Thailand!', '2025-06-26 12:18:27.000000', 'Learn about Thailand', 'easy', 10, 'lessons/thailand.jpg', b'1', b'0', 'A1', 33, 'Lesson 33: Thailand', 'vocabulary', '2025-06-26 12:18:27.000000', b'1'),
(34, 'travel/laos-intro.mp3', 'Let\'s explore Laos!', '2025-06-26 12:18:27.000000', 'Learn about Laos', 'easy', 10, 'lessons/laos.jpg', b'1', b'0', 'A1', 34, 'Lesson 34: Laos', 'vocabulary', '2025-06-26 12:18:27.000000', b'1'),
(35, 'travel/cambodia-intro.mp3', 'Let\'s explore Cambodia!', '2025-06-26 12:18:27.000000', 'Learn about Cambodia', 'easy', 10, 'lessons/cambodia.jpg', b'1', b'0', 'A2', 35, 'Lesson 35: Cambodia', 'vocabulary', '2025-06-26 12:18:27.000000', b'1'),
(36, 'travel/malaysia-intro.mp3', 'Let\'s explore Malaysia!', '2025-06-26 12:18:27.000000', 'Learn about Malaysia', 'easy', 10, 'lessons/malaysia.jpg', b'1', b'0', 'A2', 36, 'Lesson 36: Malaysia', 'vocabulary', '2025-06-26 12:18:27.000000', b'1'),
(37, 'travel/singapore-intro.mp3', 'Let\'s explore Singapore!', '2025-06-26 12:18:27.000000', 'Learn about Singapore', 'easy', 10, 'lessons/singapore.jpg', b'1', b'0', 'A2', 37, 'Lesson 37: Singapore', 'vocabulary', '2025-06-26 12:18:27.000000', b'1'),
(38, 'travel/philippines-intro.mp3', 'Let\'s explore the Philippines!', '2025-06-26 12:18:27.000000', 'Learn about the Philippines', 'easy', 10, 'lessons/philippines.jpg', b'1', b'0', 'A2', 38, 'Lesson 38: Philippines', 'vocabulary', '2025-06-26 12:18:27.000000', b'1'),
(39, 'travel/indonesia-intro.mp3', 'Let\'s explore Indonesia!', '2025-06-26 12:18:27.000000', 'Learn about Indonesia', 'easy', 10, 'lessons/indonesia.jpg', b'1', b'0', 'A2', 39, 'Lesson 39: Indonesia', 'vocabulary', '2025-06-26 12:18:27.000000', b'1'),
(40, 'travel/myanmar-intro.mp3', 'Let\'s explore Myanmar!', '2025-06-26 12:18:27.000000', 'Learn about Myanmar', 'easy', 10, 'lessons/myanmar.jpg', b'1', b'0', 'A2', 40, 'Lesson 40: Myanmar', 'vocabulary', '2025-06-26 12:18:27.000000', b'1');

-- --------------------------------------------------------

--
-- Table structure for table `membership_plans`
--

CREATE TABLE `membership_plans` (
  `id` bigint(20) NOT NULL,
  `access_audio_features` bit(1) DEFAULT NULL,
  `access_premium_content` bit(1) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `currency` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `download_offline` bit(1) DEFAULT NULL,
  `duration_days` int(11) DEFAULT NULL,
  `duration_in_days` int(11) NOT NULL,
  `features` text DEFAULT NULL,
  `has_audio_access` bit(1) DEFAULT NULL,
  `has_premium_content` bit(1) DEFAULT NULL,
  `has_progress_tracking` bit(1) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `is_popular` bit(1) DEFAULT NULL,
  `max_exercises_per_day` int(11) DEFAULT NULL,
  `max_flashcards_per_set` int(11) DEFAULT NULL,
  `max_lessons_access` int(11) DEFAULT NULL,
  `max_lessons_per_day` int(11) DEFAULT NULL,
  `membership_type` enum('BASIC','PREMIUM','VIP') DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `plan_type` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `priority_support` bit(1) DEFAULT NULL,
  `unlimited_flashcards` bit(1) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` bigint(20) NOT NULL,
  `correct_answer` varchar(255) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `explanation` varchar(255) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `option_a` varchar(255) DEFAULT NULL,
  `option_b` varchar(255) DEFAULT NULL,
  `option_c` varchar(255) DEFAULT NULL,
  `option_d` varchar(255) DEFAULT NULL,
  `points` int(11) NOT NULL,
  `question_order` int(11) DEFAULT NULL,
  `question_text` varchar(500) NOT NULL,
  `question_type` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `exercise_id` bigint(20) NOT NULL,
  `difficulty_level` enum('EASY','MEDIUM','HARD') NOT NULL,
  `audio_url` varchar(500) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `correct_answer`, `created_at`, `explanation`, `is_active`, `option_a`, `option_b`, `option_c`, `option_d`, `points`, `question_order`, `question_text`, `question_type`, `updated_at`, `exercise_id`, `difficulty_level`, `audio_url`, `image_url`) VALUES
(91, 'A', '2025-07-02 10:00:00.000000', 'Good morning is used to greet someone in the morning hours.', b'1', 'Good morning', 'Good afternoon', 'Good evening', 'Good night', 10, 1, 'Which phrase do you use to greet someone in the morning?', '', '2025-07-02 10:00:00.000000', 1, 'EASY', '/audio/greetings/greetings_morning_1.mp3', '/files/images/greetings/greetings_morning_1.jpg'),
(92, 'B', '2025-07-02 10:00:00.000000', 'Goodbye is used when parting ways with someone.', b'1', 'Hello', 'Goodbye', 'Thank you', 'Excuse me', 10, 2, 'What do you say when saying goodbye to someone?', '', '2025-07-02 10:00:00.000000', 1, 'EASY', '/audio/greetings/greetings_goodbye_1.mp3', '/files/images/exercises/greetings_goodbye_1.jpg'),
(93, 'C', '2025-07-02 10:00:00.000000', 'Thank you is used to express gratitude or appreciation.', b'1', 'Sorry', 'Excuse me', 'Thank you', 'Hello', 10, 3, 'Which phrase expresses gratitude in English?', '', '2025-07-02 10:00:00.000000', 1, 'EASY', '/audio/greetings/greetings_thanks_1.mp3', '/files/images/exercises/greetings_thanks_1.jpg'),
(94, 'D', '2025-07-02 10:00:00.000000', 'Sorry means Xin lỗi.', b'1', 'A. Hello', 'B. Goodbye', 'C. Thanks', 'D. Please', 10, 4, 'Which is a common English greeting?', '', '2025-07-02 10:00:00.000000', 1, 'EASY', '/files/audio/exercises/ex1.mp3', '/files/images/exercises/ex1.jpg'),
(95, 'A', '2025-07-02 10:00:00.000000', 'Please means Làm ơn.', b'1', 'A. Hello', 'B. Goodbye', 'C. Thanks', 'D. Please', 10, 5, 'Which is a common English greeting?', '', '2025-07-02 10:00:00.000000', 1, 'EASY', '/files/audio/exercises/ex1.mp3', '/files/images/exercises/ex1.jpg'),
(96, 'A', '2025-07-02 10:00:00.000000', 'Xin chào is a greeting in Vietnamese, meaning Hello.', b'1', 'A. Hello', 'B. Goodbye', 'C. Thanks', 'D. Please', 10, 6, 'Which is a common English greeting?', '', '2025-07-02 10:00:00.000000', 1, 'EASY', '/files/audio/exercises/ex1.mp3', '/files/images/exercises/ex1.jpg'),
(97, 'A', '2025-07-02 10:00:00.000000', 'One is the written form of the number 1.', b'1', 'One', 'Two', 'Three', 'Four', 10, 1, 'How do you write the number 1 in English?', '', '2025-07-02 10:00:00.000000', 2, 'EASY', '/files/audio/exercises/numbers_one_2.mp3', '/files/images/exercises/numbers_one_2.jpg'),
(98, 'B', '2025-07-02 10:00:00.000000', 'Ten comes after nine in the number sequence.', b'1', 'Eight', 'Ten', 'Seven', 'Eleven', 10, 2, 'Which number comes after \"nine\"?', '', '2025-07-02 10:00:00.000000', 2, 'EASY', '/files/audio/exercises/numbers_sequence_2.mp3', '/files/images/exercises/numbers_sequence_2.jpg'),
(99, 'B', '2025-07-02 10:00:00.000000', '51 is larger than 15, 25, and 5.', b'1', '15', '51', '25', '5', 10, 3, 'Which of these numbers is the largest?', '', '2025-07-02 10:00:00.000000', 2, 'EASY', '/files/audio/exercises/numbers_largest_2.mp3', '/files/images/exercises/numbers_largest_2.jpg'),
(103, 'A', '2025-07-02 10:00:00.000000', 'The sky appears blue on a clear day.', b'1', 'Blue', 'Green', 'Red', 'Yellow', 10, 1, 'What color is the sky on a clear day?', '', '2025-07-02 10:00:00.000000', 3, 'EASY', '/files/audio/exercises/colors_sky_3.mp3', '/files/images/exercises/colors_sky_3.jpg'),
(104, 'B', '2025-07-02 10:00:00.000000', 'A ripe banana is typically yellow in color.', b'1', 'Green', 'Yellow', 'Red', 'Brown', 10, 2, 'What color is a ripe banana?', '', '2025-07-02 10:00:00.000000', 3, 'EASY', '/files/audio/exercises/colors_banana_3.mp3', '/files/images/exercises/colors_banana_3.jpg'),
(105, 'C', '2025-07-02 10:00:00.000000', 'Red means stop at traffic lights.', b'1', 'Yellow', 'Green', 'Red', 'Blue', 10, 3, 'Which color is associated with stopping at traffic lights?', '', '2025-07-02 10:00:00.000000', 3, 'EASY', '/files/audio/exercises/colors_traffic_3.mp3', '/files/images/colors_traffic_3.jpg'),
(106, 'A', '2025-07-02 10:00:00.000000', 'Grass is green.', b'1', 'A. Blue', 'B. Green', 'C. Red', 'D. Yellow', 10, 4, 'What color is the sky on a clear day?', '', '2025-07-02 10:00:00.000000', 3, 'EASY', '/files/audio/exercises/ex7.mp3', '/files/images/exercises/ex7.jpg'),
(107, 'D', '2025-07-02 10:00:00.000000', 'The sun is yellow.', b'1', 'A. Blue', 'B. Green', 'C. Red', 'D. Yellow', 10, 5, 'What color is the sky on a clear day?', '', '2025-07-02 10:00:00.000000', 3, 'EASY', '/files/audio/exercises/ex7.mp3', '/files/images/exercises/ex7.jpg'),
(108, 'A', '2025-07-02 10:00:00.000000', 'Snow is white.', b'1', 'A. Blue', 'B. Green', 'C. Red', 'D. Yellow', 10, 6, 'What color is the sky on a clear day?', '', '2025-07-02 10:00:00.000000', 3, 'EASY', '/files/audio/exercises/ex7.mp3', '/files/images/exercises/ex7.jpg'),
(109, 'C', '2025-07-02 10:00:00.000000', 'Your father\'s sister is your aunt.', b'1', 'Mother', 'Sister', 'Aunt', 'Cousin', 10, 1, 'Who is your father\'s sister?', '', '2025-07-02 10:00:00.000000', 4, 'EASY', '/files/audio/exercises/family_aunt_4.mp3', '/files/images/exercises/family_aunt_4.jpg'),
(110, 'B', '2025-07-02 10:00:00.000000', 'Your parents\' other male child is your brother.', b'1', 'Sister', 'Brother', 'Cousin', 'Uncle', 10, 2, 'What do you call your parents\' male child who is not you?', '', '2025-07-02 10:00:00.000000', 4, 'EASY', '/files/audio/exercises/family_brother_4.mp3', '/files/images/exercises/family_brother_4.jpg'),
(111, 'C', '2025-07-02 10:00:00.000000', 'Your mother\'s father is your grandfather.', b'1', 'Father', 'Uncle', 'Grandfather', 'Brother', 10, 3, 'What do you call your mother\'s father?', '', '2025-07-02 10:00:00.000000', 4, 'EASY', '/files/audio/exercises/family_grandfather_4.mp3', '/files/images/exercises/family_grandfather_4.jpg'),
(115, 'A', '2025-07-02 10:00:00.000000', 'Cereal is a common breakfast food in many countries.', b'1', 'Cereal', 'Steak', 'Pizza', 'Cake', 15, 1, 'What is a common breakfast food?', '', '2025-07-02 10:00:00.000000', 5, 'EASY', '/files/audio/exercises/food_breakfast_5.mp3', '/files/images/exercises/food_breakfast_5.jpg'),
(116, 'B', '2025-07-02 10:00:00.000000', 'An apple is a fruit, while the others are vegetables.', b'1', 'Carrot', 'Apple', 'Potato', 'Onion', 15, 2, 'Which of these is a fruit?', '', '2025-07-02 10:00:00.000000', 5, 'EASY', '/files/audio/exercises/food_fruit_5.mp3', '/files/images/exercises/food_fruit_5.jpg'),
(117, 'A', '2025-07-02 10:00:00.000000', 'Water is what people typically drink when they are thirsty.', b'1', 'Water', 'Sand', 'Salt', 'Stone', 15, 3, 'What do you drink when you are thirsty?', '', '2025-07-02 10:00:00.000000', 5, 'EASY', '/files/audio/exercises/food_water_5.mp3', '/files/images/exercises/food_water_5.jpg'),
(118, 'C', '2025-07-02 10:00:00.000000', 'Jupiter is the largest planet.', b'1', 'A. Bread', 'B. Shirt', 'C. Car', 'D. House', 15, 4, 'What is a common breakfast food?', '', '2025-07-02 10:00:00.000000', 5, 'EASY', '/files/audio/food/bread.mp3', '/files/images/exercises/ex13.jpg'),
(119, 'C', '2025-07-02 10:00:00.000000', 'Diamond is the hardest natural substance.', b'1', 'A. Bread', 'B. Shirt', 'C. Car', 'D. House', 15, 5, 'What is a common breakfast food?', '', '2025-07-02 10:00:00.000000', 5, 'EASY', '/files/audio/food/bread.mp3', '/files/images/exercises/ex13.jpg'),
(120, 'A', '2025-07-02 10:00:00.000000', 'Au is the chemical symbol for gold.', b'1', 'A. Bread', 'B. Shirt', 'C. Car', 'D. House', 15, 6, 'What is a common breakfast food?', '', '2025-07-02 10:00:00.000000', 5, 'EASY', '/files/audio/food/bread.mp3', '/files/images/exercises/ex13.jpg'),
(121, 'B', '2025-07-02 10:00:00.000000', 'Mandarin Chinese has the most native speakers in the world.', b'1', 'English', 'Mandarin', 'Spanish', 'Hindi', 15, 1, 'What is the most widely spoken language in the world?', '', '2025-07-02 10:00:00.000000', 6, 'EASY', '/files/audio/exercises/languages_mandarin_6.mp3', '/files/images/exercises/languages_mandarin_6.jpg'),
(122, 'B', '2025-07-02 10:00:00.000000', 'Portuguese is the official language of Brazil.', b'1', 'Spanish', 'Portuguese', 'English', 'French', 15, 2, 'What is the main language spoken in Brazil?', '', '2025-07-02 10:00:00.000000', 6, 'EASY', '/files/audio/exercises/languages_portuguese_6.mp3', '/files/images/exercises/languages_portuguese_6.jpg'),
(123, 'A', '2025-07-02 10:00:00.000000', 'Russian uses the Cyrillic alphabet.', b'1', 'Russian', 'German', 'Arabic', 'Hindi', 15, 3, 'Which language uses the Cyrillic alphabet?', '', '2025-07-02 10:00:00.000000', 6, 'EASY', '/files/audio/exercises/languages_cyrillic_6.mp3', '/files/images/exercises/languages_cyrillic_6.jpg'),
(124, 'A', '2025-07-02 10:00:00.000000', 'Arabic is the primary language in Egypt.', b'1', 'Arabic', 'English', 'French', 'Spanish', 15, 4, 'What is the primary language in Egypt?', '', '2025-07-02 10:00:00.000000', 6, 'EASY', NULL, NULL),
(125, 'A', '2025-07-02 10:00:00.000000', 'Russian is the primary language in Russia.', b'1', 'Russian', 'Ukrainian', 'Belarusian', 'Kazakh', 15, 5, 'What is the primary language in Russia?', '', '2025-07-02 10:00:00.000000', 6, 'EASY', NULL, NULL),
(126, 'A', '2025-07-02 10:00:00.000000', 'Spanish is the primary language in Argentina.', b'1', 'Spanish', 'Portuguese', 'Italian', 'French', 15, 6, 'What is the primary language in Argentina?', '', '2025-07-02 10:00:00.000000', 6, 'EASY', NULL, NULL),
(127, 'C', '2025-07-02 10:00:00.000000', 'Tokyo is the capital of Japan.', b'1', 'Beijing', 'Seoul', 'Tokyo', 'Bangkok', 20, 1, 'What is the capital of Japan?', '', '2025-07-02 10:00:00.000000', 7, 'EASY', '/files/audio/exercises/travel_tokyo_7.mp3', '/files/images/exercises/travel_tokyo_7.jpg'),
(128, 'B', '2025-07-02 10:00:00.000000', 'A passport is required for international travel.', b'1', 'ID card', 'Passport', 'Driver\'s license', 'Credit card', 20, 2, 'What document do you need to travel to another country?', '', '2025-07-02 10:00:00.000000', 7, 'EASY', '/files/audio/exercises/travel_passport_7.mp3', '/files/images/exercises/travel_passport_7.jpg'),
(129, 'A', '2025-07-02 10:00:00.000000', 'Airplanes take off and land at airports.', b'1', 'Airport', 'Train station', 'Bus terminal', 'Harbor', 20, 3, 'Where do airplanes take off and land?', '', '2025-07-02 10:00:00.000000', 7, 'EASY', '/files/audio/exercises/travel_airport_7.mp3', '/files/images/exercises/travel_airport_7.jpg'),
(133, 'B', '2025-07-02 10:00:00.000000', 'An apple is a fruit, while the others are vegetables.', b'1', 'Carrot', 'Apple', 'Potato', 'Onion', 15, 2, 'Which of these is a fruit?', '', '2025-07-02 10:00:00.000000', 5, 'EASY', '/files/audio/exercises/food_fruit_5.mp3', '/files/images/exercises/food_fruit_5.jpg'),
(134, 'A', '2025-07-02 10:00:00.000000', 'Water is what people typically drink when they are thirsty.', b'1', 'Water', 'Sand', 'Salt', 'Stone', 15, 3, 'What do you drink when you are thirsty?', '', '2025-07-02 10:00:00.000000', 5, 'EASY', '/files/audio/exercises/food_water_5.mp3', '/files/images/exercises/food_water_5.jpg'),
(135, 'C', '2025-07-02 10:00:00.000000', 'Jupiter is the largest planet.', b'1', 'A. Bread', 'B. Shirt', 'C. Car', 'D. House', 15, 4, 'What is a common breakfast food?', '', '2025-07-02 10:00:00.000000', 5, 'EASY', '/files/audio/food/bread.mp3', '/files/images/exercises/ex13.jpg'),
(136, 'C', '2025-07-02 10:00:00.000000', 'Diamond is the hardest natural substance.', b'1', 'A. Bread', 'B. Shirt', 'C. Car', 'D. House', 15, 5, 'What is a common breakfast food?', '', '2025-07-02 10:00:00.000000', 5, 'EASY', '/files/audio/food/bread.mp3', '/files/images/exercises/ex13.jpg'),
(137, 'A', '2025-07-02 10:00:00.000000', 'Au is the chemical symbol for gold.', b'1', 'A. Bread', 'B. Shirt', 'C. Car', 'D. House', 15, 6, 'What is a common breakfast food?', '', '2025-07-02 10:00:00.000000', 5, 'EASY', '/files/audio/food/bread.mp3', '/files/images/exercises/ex13.jpg'),
(138, 'B', '2025-07-02 10:00:00.000000', 'Mandarin Chinese has the most native speakers in the world.', b'1', 'English', 'Mandarin', 'Spanish', 'Hindi', 15, 1, 'What is the most widely spoken language in the world?', '', '2025-07-02 10:00:00.000000', 6, 'EASY', '/files/audio/exercises/languages_mandarin_6.mp3', '/files/images/exercises/languages_mandarin_6.jpg'),
(139, 'B', '2025-07-02 10:00:00.000000', 'Portuguese is the official language of Brazil.', b'1', 'Spanish', 'Portuguese', 'English', 'French', 15, 2, 'What is the main language spoken in Brazil?', '', '2025-07-02 10:00:00.000000', 6, 'EASY', '/files/audio/exercises/languages_portuguese_6.mp3', '/files/images/exercises/languages_portuguese_6.jpg'),
(140, 'A', '2025-07-02 10:00:00.000000', 'Russian uses the Cyrillic alphabet.', b'1', 'Russian', 'German', 'Arabic', 'Hindi', 15, 3, 'Which language uses the Cyrillic alphabet?', '', '2025-07-02 10:00:00.000000', 6, 'EASY', '/files/audio/exercises/languages_cyrillic_6.mp3', '/files/images/exercises/languages_cyrillic_6.jpg'),
(141, 'A', '2025-07-02 10:00:00.000000', 'Arabic is the primary language in Egypt.', b'1', 'Arabic', 'English', 'French', 'Spanish', 15, 4, 'What is the primary language in Egypt?', '', '2025-07-02 10:00:00.000000', 6, 'EASY', NULL, NULL),
(142, 'A', '2025-07-02 10:00:00.000000', 'Russian is the primary language in Russia.', b'1', 'Russian', 'Ukrainian', 'Belarusian', 'Kazakh', 15, 5, 'What is the primary language in Russia?', '', '2025-07-02 10:00:00.000000', 6, 'EASY', NULL, NULL),
(143, 'A', '2025-07-02 10:00:00.000000', 'Spanish is the primary language in Argentina.', b'1', 'Spanish', 'Portuguese', 'Italian', 'French', 15, 6, 'What is the primary language in Argentina?', '', '2025-07-02 10:00:00.000000', 6, 'EASY', NULL, NULL),
(144, 'C', '2025-07-02 10:00:00.000000', 'Tokyo is the capital of Japan.', b'1', 'Beijing', 'Seoul', 'Tokyo', 'Bangkok', 20, 1, 'What is the capital of Japan?', '', '2025-07-02 10:00:00.000000', 7, 'EASY', '/files/audio/exercises/travel_tokyo_7.mp3', '/files/images/exercises/travel_tokyo_7.jpg'),
(145, 'B', '2025-07-02 10:00:00.000000', 'A passport is required for international travel.', b'1', 'ID card', 'Passport', 'Driver\'s license', 'Credit card', 20, 2, 'What document do you need to travel to another country?', '', '2025-07-02 10:00:00.000000', 7, 'EASY', '/files/audio/exercises/travel_passport_7.mp3', '/files/images/exercises/travel_passport_7.jpg'),
(146, 'A', '2025-07-02 10:00:00.000000', 'Airplanes take off and land at airports.', b'1', 'Airport', 'Train station', 'Bus terminal', 'Harbor', 20, 3, 'Where do airplanes take off and land?', '', '2025-07-02 10:00:00.000000', 7, 'EASY', '/files/audio/exercises/travel_airport_7.mp3', '/files/images/exercises/travel_airport_7.jpg'),
(147, 'C', '2025-07-02 10:00:00.000000', 'Canberra is the capital of Australia.', b'1', 'Sydney', 'Melbourne', 'Canberra', 'Brisbane', 20, 4, 'What is the capital of Australia?', '', '2025-07-02 10:00:00.000000', 7, 'EASY', NULL, NULL),
(148, 'A', '2025-07-02 10:00:00.000000', 'Bangkok is the capital of Thailand.', b'1', 'Bangkok', 'Chiang Mai', 'Phuket', 'Krabi', 20, 5, 'What is the capital of Thailand?', '', '2025-07-02 10:00:00.000000', 7, 'EASY', NULL, NULL),
(149, 'A', '2025-07-02 10:00:00.000000', 'Hanoi is the capital of Vietnam.', b'1', 'Hanoi', 'Ho Chi Minh City', 'Da Nang', 'Hai Phong', 20, 6, 'What is the capital of Vietnam?', '', '2025-07-02 10:00:00.000000', 7, 'EASY', NULL, NULL),
(150, 'A', '2025-07-02 10:00:00.000000', 'Rice is the main ingredient in sushi.', b'1', 'Rice', 'Noodles', 'Bread', 'Potato', 20, 1, 'What is the main ingredient in sushi?', '', '2025-07-02 10:00:00.000000', 8, 'EASY', NULL, NULL),
(151, 'A', '2025-07-02 10:00:00.000000', 'Flour is the main ingredient in bread.', b'1', 'Flour', 'Sugar', 'Salt', 'Yeast', 20, 2, 'What is the main ingredient in bread?', '', '2025-07-02 10:00:00.000000', 8, 'EASY', NULL, NULL),
(152, 'A', '2025-07-02 10:00:00.000000', 'Cocoa is the main ingredient in chocolate.', b'1', 'Cocoa', 'Sugar', 'Milk', 'Vanilla', 20, 3, 'What is the main ingredient in chocolate?', '', '2025-07-02 10:00:00.000000', 8, 'EASY', NULL, NULL),
(153, 'C', '2025-07-02 10:00:00.000000', 'Avocado is the main ingredient in guacamole.', b'1', 'Tomato', 'Onion', 'Avocado', 'Pepper', 20, 4, 'What is the main ingredient in guacamole?', '', '2025-07-02 10:00:00.000000', 8, 'EASY', NULL, NULL),
(154, 'A', '2025-07-02 10:00:00.000000', 'Basil is the main ingredient in pesto.', b'1', 'Basil', 'Parsley', 'Cilantro', 'Mint', 20, 5, 'What is the main ingredient in pesto?', '', '2025-07-02 10:00:00.000000', 8, 'EASY', NULL, NULL),
(155, 'A', '2025-07-02 10:00:00.000000', 'Chickpeas are the main ingredient in hummus.', b'1', 'Chickpeas', 'Lentils', 'Beans', 'Peas', 20, 6, 'What is the main ingredient in hummus?', '', '2025-07-02 10:00:00.000000', 8, 'EASY', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `questions_backup`
--

CREATE TABLE `questions_backup` (
  `id` bigint(20) NOT NULL,
  `correct_answer` varchar(255) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `explanation` varchar(255) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `option_a` varchar(255) DEFAULT NULL,
  `option_b` varchar(255) DEFAULT NULL,
  `option_c` varchar(255) DEFAULT NULL,
  `option_d` varchar(255) DEFAULT NULL,
  `points` int(11) NOT NULL,
  `question_order` int(11) DEFAULT NULL,
  `question_text` varchar(500) NOT NULL,
  `question_type` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `exercise_id` bigint(20) NOT NULL,
  `difficulty_level` enum('EASY','MEDIUM','HARD') NOT NULL,
  `audio_url` varchar(500) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `questions_backup`
--

INSERT INTO `questions_backup` (`id`, `correct_answer`, `created_at`, `explanation`, `is_active`, `option_a`, `option_b`, `option_c`, `option_d`, `points`, `question_order`, `question_text`, `question_type`, `updated_at`, `exercise_id`, `difficulty_level`, `audio_url`, `image_url`) VALUES
(116, 'B', '2025-07-02 10:00:00.000000', '2 is the smallest prime number.', b'1', 'A. Bread', 'B. Shirt', 'C. Car', 'D. House', 15, 2, 'What is a common breakfast food?', '', '2025-07-02 10:00:00.000000', 5, 'EASY', '/files/audio/food/bread.mp3', '/files/images/exercises/ex13.jpg'),
(117, 'D', '2025-07-02 10:00:00.000000', 'The Pacific Ocean is the largest.', b'1', 'A. Bread', 'B. Shirt', 'C. Car', 'D. House', 15, 3, 'What is a common breakfast food?', '', '2025-07-02 10:00:00.000000', 5, 'EASY', '/files/audio/food/bread.mp3', '/files/images/exercises/ex13.jpg'),
(118, 'C', '2025-07-02 10:00:00.000000', 'Jupiter is the largest planet.', b'1', 'A. Bread', 'B. Shirt', 'C. Car', 'D. House', 15, 4, 'What is a common breakfast food?', '', '2025-07-02 10:00:00.000000', 5, 'EASY', '/files/audio/food/bread.mp3', '/files/images/exercises/ex13.jpg'),
(119, 'C', '2025-07-02 10:00:00.000000', 'Diamond is the hardest natural substance.', b'1', 'A. Bread', 'B. Shirt', 'C. Car', 'D. House', 15, 5, 'What is a common breakfast food?', '', '2025-07-02 10:00:00.000000', 5, 'EASY', '/files/audio/food/bread.mp3', '/files/images/exercises/ex13.jpg'),
(120, 'A', '2025-07-02 10:00:00.000000', 'Au is the chemical symbol for gold.', b'1', 'A. Bread', 'B. Shirt', 'C. Car', 'D. House', 15, 6, 'What is a common breakfast food?', '', '2025-07-02 10:00:00.000000', 5, 'EASY', '/files/audio/food/bread.mp3', '/files/images/exercises/ex13.jpg'),
(121, 'B', '2025-07-02 10:00:00.000000', 'Mandarin is the most widely spoken language.', b'1', 'English', 'Mandarin', 'Spanish', 'Hindi', 15, 1, 'What is the most widely spoken language in the world?', '', '2025-07-02 10:00:00.000000', 6, 'EASY', NULL, NULL),
(122, 'B', '2025-07-02 10:00:00.000000', 'Portuguese is the main language in Brazil.', b'1', 'Spanish', 'Portuguese', 'English', 'French', 15, 2, 'What is the main language spoken in Brazil?', '', '2025-07-02 10:00:00.000000', 6, 'EASY', NULL, NULL),
(123, 'A', '2025-07-02 10:00:00.000000', 'English is the most spoken language in the USA.', b'1', 'English', 'Spanish', 'Chinese', 'French', 15, 3, 'What is the most spoken language in the USA?', '', '2025-07-02 10:00:00.000000', 6, 'EASY', NULL, NULL),
(124, 'A', '2025-07-02 10:00:00.000000', 'Arabic is the primary language in Egypt.', b'1', 'Arabic', 'English', 'French', 'Spanish', 15, 4, 'What is the primary language in Egypt?', '', '2025-07-02 10:00:00.000000', 6, 'EASY', NULL, NULL),
(125, 'A', '2025-07-02 10:00:00.000000', 'Russian is the primary language in Russia.', b'1', 'Russian', 'Ukrainian', 'Belarusian', 'Kazakh', 15, 5, 'What is the primary language in Russia?', '', '2025-07-02 10:00:00.000000', 6, 'EASY', NULL, NULL),
(126, 'A', '2025-07-02 10:00:00.000000', 'Spanish is the primary language in Argentina.', b'1', 'Spanish', 'Portuguese', 'Italian', 'French', 15, 6, 'What is the primary language in Argentina?', '', '2025-07-02 10:00:00.000000', 6, 'EASY', NULL, NULL),
(127, 'C', '2025-07-02 10:00:00.000000', 'Tokyo is the capital of Japan.', b'1', 'Beijing', 'Seoul', 'Tokyo', 'Bangkok', 20, 1, 'What is the capital of Japan?', '', '2025-07-02 10:00:00.000000', 7, 'EASY', NULL, NULL),
(128, 'A', '2025-07-02 10:00:00.000000', 'Beijing is the capital of China.', b'1', 'Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 20, 2, 'What is the capital of China?', '', '2025-07-02 10:00:00.000000', 7, 'EASY', NULL, NULL),
(129, 'D', '2025-07-02 10:00:00.000000', 'Ottawa is the capital of Canada.', b'1', 'Toronto', 'Vancouver', 'Montreal', 'Ottawa', 20, 3, 'What is the capital of Canada?', '', '2025-07-02 10:00:00.000000', 7, 'EASY', NULL, NULL),
(130, 'C', '2025-07-02 10:00:00.000000', 'Canberra is the capital of Australia.', b'1', 'Sydney', 'Melbourne', 'Canberra', 'Brisbane', 20, 4, 'What is the capital of Australia?', '', '2025-07-02 10:00:00.000000', 7, 'EASY', NULL, NULL),
(131, 'A', '2025-07-02 10:00:00.000000', 'Bangkok is the capital of Thailand.', b'1', 'Bangkok', 'Chiang Mai', 'Phuket', 'Krabi', 20, 5, 'What is the capital of Thailand?', '', '2025-07-02 10:00:00.000000', 7, 'EASY', NULL, NULL),
(132, 'A', '2025-07-02 10:00:00.000000', 'Hanoi is the capital of Vietnam.', b'1', 'Hanoi', 'Ho Chi Minh City', 'Da Nang', 'Hai Phong', 20, 6, 'What is the capital of Vietnam?', '', '2025-07-02 10:00:00.000000', 7, 'EASY', NULL, NULL),
(133, 'B', '2025-07-02 10:00:00.000000', '2 is the smallest prime number.', b'1', 'A. Bread', 'B. Shirt', 'C. Car', 'D. House', 15, 2, 'What is a common breakfast food?', '', '2025-07-02 10:00:00.000000', 5, 'EASY', '/files/audio/food/bread.mp3', '/files/images/exercises/ex13.jpg'),
(134, 'D', '2025-07-02 10:00:00.000000', 'The Pacific Ocean is the largest.', b'1', 'A. Bread', 'B. Shirt', 'C. Car', 'D. House', 15, 3, 'What is a common breakfast food?', '', '2025-07-02 10:00:00.000000', 5, 'EASY', '/files/audio/food/bread.mp3', '/files/images/exercises/ex13.jpg'),
(135, 'C', '2025-07-02 10:00:00.000000', 'Jupiter is the largest planet.', b'1', 'A. Bread', 'B. Shirt', 'C. Car', 'D. House', 15, 4, 'What is a common breakfast food?', '', '2025-07-02 10:00:00.000000', 5, 'EASY', '/files/audio/food/bread.mp3', '/files/images/exercises/ex13.jpg'),
(136, 'C', '2025-07-02 10:00:00.000000', 'Diamond is the hardest natural substance.', b'1', 'A. Bread', 'B. Shirt', 'C. Car', 'D. House', 15, 5, 'What is a common breakfast food?', '', '2025-07-02 10:00:00.000000', 5, 'EASY', '/files/audio/food/bread.mp3', '/files/images/exercises/ex13.jpg'),
(137, 'A', '2025-07-02 10:00:00.000000', 'Au is the chemical symbol for gold.', b'1', 'A. Bread', 'B. Shirt', 'C. Car', 'D. House', 15, 6, 'What is a common breakfast food?', '', '2025-07-02 10:00:00.000000', 5, 'EASY', '/files/audio/food/bread.mp3', '/files/images/exercises/ex13.jpg'),
(138, 'B', '2025-07-02 10:00:00.000000', 'Mandarin is the most widely spoken language.', b'1', 'English', 'Mandarin', 'Spanish', 'Hindi', 15, 1, 'What is the most widely spoken language in the world?', '', '2025-07-02 10:00:00.000000', 6, 'EASY', NULL, NULL),
(139, 'B', '2025-07-02 10:00:00.000000', 'Portuguese is the main language in Brazil.', b'1', 'Spanish', 'Portuguese', 'English', 'French', 15, 2, 'What is the main language spoken in Brazil?', '', '2025-07-02 10:00:00.000000', 6, 'EASY', NULL, NULL),
(140, 'A', '2025-07-02 10:00:00.000000', 'English is the most spoken language in the USA.', b'1', 'English', 'Spanish', 'Chinese', 'French', 15, 3, 'What is the most spoken language in the USA?', '', '2025-07-02 10:00:00.000000', 6, 'EASY', NULL, NULL),
(141, 'A', '2025-07-02 10:00:00.000000', 'Arabic is the primary language in Egypt.', b'1', 'Arabic', 'English', 'French', 'Spanish', 15, 4, 'What is the primary language in Egypt?', '', '2025-07-02 10:00:00.000000', 6, 'EASY', NULL, NULL),
(142, 'A', '2025-07-02 10:00:00.000000', 'Russian is the primary language in Russia.', b'1', 'Russian', 'Ukrainian', 'Belarusian', 'Kazakh', 15, 5, 'What is the primary language in Russia?', '', '2025-07-02 10:00:00.000000', 6, 'EASY', NULL, NULL),
(143, 'A', '2025-07-02 10:00:00.000000', 'Spanish is the primary language in Argentina.', b'1', 'Spanish', 'Portuguese', 'Italian', 'French', 15, 6, 'What is the primary language in Argentina?', '', '2025-07-02 10:00:00.000000', 6, 'EASY', NULL, NULL),
(144, 'C', '2025-07-02 10:00:00.000000', 'Tokyo is the capital of Japan.', b'1', 'Beijing', 'Seoul', 'Tokyo', 'Bangkok', 20, 1, 'What is the capital of Japan?', '', '2025-07-02 10:00:00.000000', 7, 'EASY', NULL, NULL),
(145, 'A', '2025-07-02 10:00:00.000000', 'Beijing is the capital of China.', b'1', 'Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 20, 2, 'What is the capital of China?', '', '2025-07-02 10:00:00.000000', 7, 'EASY', NULL, NULL),
(146, 'D', '2025-07-02 10:00:00.000000', 'Ottawa is the capital of Canada.', b'1', 'Toronto', 'Vancouver', 'Montreal', 'Ottawa', 20, 3, 'What is the capital of Canada?', '', '2025-07-02 10:00:00.000000', 7, 'EASY', NULL, NULL),
(147, 'C', '2025-07-02 10:00:00.000000', 'Canberra is the capital of Australia.', b'1', 'Sydney', 'Melbourne', 'Canberra', 'Brisbane', 20, 4, 'What is the capital of Australia?', '', '2025-07-02 10:00:00.000000', 7, 'EASY', NULL, NULL),
(148, 'A', '2025-07-02 10:00:00.000000', 'Bangkok is the capital of Thailand.', b'1', 'Bangkok', 'Chiang Mai', 'Phuket', 'Krabi', 20, 5, 'What is the capital of Thailand?', '', '2025-07-02 10:00:00.000000', 7, 'EASY', NULL, NULL),
(149, 'A', '2025-07-02 10:00:00.000000', 'Hanoi is the capital of Vietnam.', b'1', 'Hanoi', 'Ho Chi Minh City', 'Da Nang', 'Hai Phong', 20, 6, 'What is the capital of Vietnam?', '', '2025-07-02 10:00:00.000000', 7, 'EASY', NULL, NULL),
(150, 'A', '2025-07-02 10:00:00.000000', 'Rice is the main ingredient in sushi.', b'1', 'Rice', 'Noodles', 'Bread', 'Potato', 20, 1, 'What is the main ingredient in sushi?', '', '2025-07-02 10:00:00.000000', 8, 'EASY', NULL, NULL),
(151, 'A', '2025-07-02 10:00:00.000000', 'Flour is the main ingredient in bread.', b'1', 'Flour', 'Sugar', 'Salt', 'Yeast', 20, 2, 'What is the main ingredient in bread?', '', '2025-07-02 10:00:00.000000', 8, 'EASY', NULL, NULL),
(152, 'A', '2025-07-02 10:00:00.000000', 'Cocoa is the main ingredient in chocolate.', b'1', 'Cocoa', 'Sugar', 'Milk', 'Vanilla', 20, 3, 'What is the main ingredient in chocolate?', '', '2025-07-02 10:00:00.000000', 8, 'EASY', NULL, NULL),
(153, 'C', '2025-07-02 10:00:00.000000', 'Avocado is the main ingredient in guacamole.', b'1', 'Tomato', 'Onion', 'Avocado', 'Pepper', 20, 4, 'What is the main ingredient in guacamole?', '', '2025-07-02 10:00:00.000000', 8, 'EASY', NULL, NULL),
(154, 'A', '2025-07-02 10:00:00.000000', 'Basil is the main ingredient in pesto.', b'1', 'Basil', 'Parsley', 'Cilantro', 'Mint', 20, 5, 'What is the main ingredient in pesto?', '', '2025-07-02 10:00:00.000000', 8, 'EASY', NULL, NULL),
(155, 'A', '2025-07-02 10:00:00.000000', 'Chickpeas are the main ingredient in hummus.', b'1', 'Chickpeas', 'Lentils', 'Beans', 'Peas', 20, 6, 'What is the main ingredient in hummus?', '', '2025-07-02 10:00:00.000000', 8, 'EASY', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `questions_backup_full`
--

CREATE TABLE `questions_backup_full` (
  `id` bigint(20) NOT NULL,
  `correct_answer` varchar(255) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `explanation` varchar(255) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `option_a` varchar(255) DEFAULT NULL,
  `option_b` varchar(255) DEFAULT NULL,
  `option_c` varchar(255) DEFAULT NULL,
  `option_d` varchar(255) DEFAULT NULL,
  `points` int(11) NOT NULL,
  `question_order` int(11) DEFAULT NULL,
  `question_text` varchar(500) NOT NULL,
  `question_type` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `exercise_id` bigint(20) NOT NULL,
  `difficulty_level` enum('EASY','MEDIUM','HARD') NOT NULL,
  `audio_url` varchar(500) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `questions_backup_full`
--

INSERT INTO `questions_backup_full` (`id`, `correct_answer`, `created_at`, `explanation`, `is_active`, `option_a`, `option_b`, `option_c`, `option_d`, `points`, `question_order`, `question_text`, `question_type`, `updated_at`, `exercise_id`, `difficulty_level`, `audio_url`, `image_url`) VALUES
(116, 'B', '2025-07-02 10:00:00.000000', 'Match 1-A, 2-B correctly.', b'1', 'A. Bread', 'B. Shirt', 'C. Car', 'D. House', 15, 2, 'Match the number with the word.', '', '2025-07-02 10:00:00.000000', 5, 'EASY', 'exercises/ex5.mp3', 'exercises/ex5.jpg'),
(117, 'D', '2025-07-02 10:00:00.000000', 'Match 1-A, 2-B correctly.', b'1', 'A. Bread', 'B. Shirt', 'C. Car', 'D. House', 15, 3, 'Match the number with the word.', '', '2025-07-02 10:00:00.000000', 5, 'EASY', 'exercises/ex5.mp3', 'exercises/ex5.jpg'),
(118, 'C', '2025-07-02 10:00:00.000000', 'Match 1-A, 2-B correctly.', b'1', 'A. Bread', 'B. Shirt', 'C. Car', 'D. House', 15, 4, 'Match the number with the word.', '', '2025-07-02 10:00:00.000000', 5, 'EASY', 'exercises/ex5.mp3', 'exercises/ex5.jpg'),
(119, 'C', '2025-07-02 10:00:00.000000', 'Match 1-A, 2-B correctly.', b'1', 'A. Bread', 'B. Shirt', 'C. Car', 'D. House', 15, 5, 'Match the number with the word.', '', '2025-07-02 10:00:00.000000', 5, 'EASY', 'exercises/ex5.mp3', 'exercises/ex5.jpg'),
(120, 'A', '2025-07-02 10:00:00.000000', 'Match 1-A, 2-B correctly.', b'1', 'A. Bread', 'B. Shirt', 'C. Car', 'D. House', 15, 6, 'Match the number with the word.', '', '2025-07-02 10:00:00.000000', 5, 'EASY', 'exercises/ex5.mp3', 'exercises/ex5.jpg'),
(121, 'B', '2025-07-02 10:00:00.000000', 'Two is the correct number to use in this sentence.', b'1', 'English', 'Mandarin', 'Spanish', 'Hindi', 15, 1, 'Complete the sentence: \"I have ___ apples.\"', '', '2025-07-02 10:00:00.000000', 6, 'EASY', 'exercises/ex6.mp3', 'exercises/ex6.jpg'),
(122, 'B', '2025-07-02 10:00:00.000000', 'Two is the correct number to use in this sentence.', b'1', 'Spanish', 'Portuguese', 'English', 'French', 15, 2, 'Complete the sentence: \"I have ___ apples.\"', '', '2025-07-02 10:00:00.000000', 6, 'EASY', 'exercises/ex6.mp3', 'exercises/ex6.jpg'),
(123, 'A', '2025-07-02 10:00:00.000000', 'Two is the correct number to use in this sentence.', b'1', 'English', 'Spanish', 'Chinese', 'French', 15, 3, 'Complete the sentence: \"I have ___ apples.\"', '', '2025-07-02 10:00:00.000000', 6, 'EASY', 'exercises/ex6.mp3', 'exercises/ex6.jpg'),
(124, 'A', '2025-07-02 10:00:00.000000', 'Two is the correct number to use in this sentence.', b'1', 'Arabic', 'English', 'French', 'Spanish', 15, 4, 'Complete the sentence: \"I have ___ apples.\"', '', '2025-07-02 10:00:00.000000', 6, 'EASY', 'exercises/ex6.mp3', 'exercises/ex6.jpg'),
(125, 'A', '2025-07-02 10:00:00.000000', 'Two is the correct number to use in this sentence.', b'1', 'Russian', 'Ukrainian', 'Belarusian', 'Kazakh', 15, 5, 'Complete the sentence: \"I have ___ apples.\"', '', '2025-07-02 10:00:00.000000', 6, 'EASY', 'exercises/ex6.mp3', 'exercises/ex6.jpg'),
(126, 'A', '2025-07-02 10:00:00.000000', 'Two is the correct number to use in this sentence.', b'1', 'Spanish', 'Portuguese', 'Italian', 'French', 15, 6, 'Complete the sentence: \"I have ___ apples.\"', '', '2025-07-02 10:00:00.000000', 6, 'EASY', 'exercises/ex6.mp3', 'exercises/ex6.jpg'),
(127, 'A', '2025-07-02 10:00:00.000000', 'Blue is the color of the clear sky.', b'1', 'Blue', 'Green', 'Red', 'Yellow', 20, 1, 'What color is the sky on a clear day?', '', '2025-07-02 10:00:00.000000', 7, 'EASY', 'exercises/ex7.mp3', 'exercises/ex7.jpg'),
(128, 'A', '2025-07-02 10:00:00.000000', 'Blue is the color of the clear sky.', b'1', 'Blue', 'Green', 'Red', 'Yellow', 20, 2, 'What color is the sky on a clear day?', '', '2025-07-02 10:00:00.000000', 7, 'EASY', 'exercises/ex7.mp3', 'exercises/ex7.jpg'),
(129, 'A', '2025-07-02 10:00:00.000000', 'Blue is the color of the clear sky.', b'1', 'Blue', 'Green', 'Red', 'Yellow', 20, 3, 'What color is the sky on a clear day?', '', '2025-07-02 10:00:00.000000', 7, 'EASY', 'exercises/ex7.mp3', 'exercises/ex7.jpg'),
(130, 'A', '2025-07-02 10:00:00.000000', 'Blue is the color of the clear sky.', b'1', 'Blue', 'Green', 'Red', 'Yellow', 20, 4, 'What color is the sky on a clear day?', '', '2025-07-02 10:00:00.000000', 7, 'EASY', 'exercises/ex7.mp3', 'exercises/ex7.jpg'),
(131, 'A', '2025-07-02 10:00:00.000000', 'Blue is the color of the clear sky.', b'1', 'Blue', 'Green', 'Red', 'Yellow', 20, 5, 'What color is the sky on a clear day?', '', '2025-07-02 10:00:00.000000', 7, 'EASY', 'exercises/ex7.mp3', 'exercises/ex7.jpg'),
(132, 'A', '2025-07-02 10:00:00.000000', 'Blue is the color of the clear sky.', b'1', 'Blue', 'Green', 'Red', 'Yellow', 20, 6, 'What color is the sky on a clear day?', '', '2025-07-02 10:00:00.000000', 7, 'EASY', 'exercises/ex7.mp3', 'exercises/ex7.jpg'),
(133, 'B', '2025-07-02 10:00:00.000000', 'Match 1-A, 2-B correctly.', b'1', 'A. Bread', 'B. Shirt', 'C. Car', 'D. House', 15, 2, 'Match the number with the word.', '', '2025-07-02 10:00:00.000000', 5, 'EASY', 'exercises/ex5.mp3', 'exercises/ex5.jpg'),
(134, 'D', '2025-07-02 10:00:00.000000', 'Match 1-A, 2-B correctly.', b'1', 'A. Bread', 'B. Shirt', 'C. Car', 'D. House', 15, 3, 'Match the number with the word.', '', '2025-07-02 10:00:00.000000', 5, 'EASY', 'exercises/ex5.mp3', 'exercises/ex5.jpg'),
(135, 'C', '2025-07-02 10:00:00.000000', 'Match 1-A, 2-B correctly.', b'1', 'A. Bread', 'B. Shirt', 'C. Car', 'D. House', 15, 4, 'Match the number with the word.', '', '2025-07-02 10:00:00.000000', 5, 'EASY', 'exercises/ex5.mp3', 'exercises/ex5.jpg'),
(136, 'C', '2025-07-02 10:00:00.000000', 'Match 1-A, 2-B correctly.', b'1', 'A. Bread', 'B. Shirt', 'C. Car', 'D. House', 15, 5, 'Match the number with the word.', '', '2025-07-02 10:00:00.000000', 5, 'EASY', 'exercises/ex5.mp3', 'exercises/ex5.jpg'),
(137, 'A', '2025-07-02 10:00:00.000000', 'Match 1-A, 2-B correctly.', b'1', 'A. Bread', 'B. Shirt', 'C. Car', 'D. House', 15, 6, 'Match the number with the word.', '', '2025-07-02 10:00:00.000000', 5, 'EASY', 'exercises/ex5.mp3', 'exercises/ex5.jpg'),
(138, 'B', '2025-07-02 10:00:00.000000', 'Two is the correct number to use in this sentence.', b'1', 'English', 'Mandarin', 'Spanish', 'Hindi', 15, 1, 'Complete the sentence: \"I have ___ apples.\"', '', '2025-07-02 10:00:00.000000', 6, 'EASY', 'exercises/ex6.mp3', 'exercises/ex6.jpg'),
(139, 'B', '2025-07-02 10:00:00.000000', 'Two is the correct number to use in this sentence.', b'1', 'Spanish', 'Portuguese', 'English', 'French', 15, 2, 'Complete the sentence: \"I have ___ apples.\"', '', '2025-07-02 10:00:00.000000', 6, 'EASY', 'exercises/ex6.mp3', 'exercises/ex6.jpg'),
(140, 'A', '2025-07-02 10:00:00.000000', 'Two is the correct number to use in this sentence.', b'1', 'English', 'Spanish', 'Chinese', 'French', 15, 3, 'Complete the sentence: \"I have ___ apples.\"', '', '2025-07-02 10:00:00.000000', 6, 'EASY', 'exercises/ex6.mp3', 'exercises/ex6.jpg'),
(141, 'A', '2025-07-02 10:00:00.000000', 'Two is the correct number to use in this sentence.', b'1', 'Arabic', 'English', 'French', 'Spanish', 15, 4, 'Complete the sentence: \"I have ___ apples.\"', '', '2025-07-02 10:00:00.000000', 6, 'EASY', 'exercises/ex6.mp3', 'exercises/ex6.jpg'),
(142, 'A', '2025-07-02 10:00:00.000000', 'Two is the correct number to use in this sentence.', b'1', 'Russian', 'Ukrainian', 'Belarusian', 'Kazakh', 15, 5, 'Complete the sentence: \"I have ___ apples.\"', '', '2025-07-02 10:00:00.000000', 6, 'EASY', 'exercises/ex6.mp3', 'exercises/ex6.jpg'),
(143, 'A', '2025-07-02 10:00:00.000000', 'Two is the correct number to use in this sentence.', b'1', 'Spanish', 'Portuguese', 'Italian', 'French', 15, 6, 'Complete the sentence: \"I have ___ apples.\"', '', '2025-07-02 10:00:00.000000', 6, 'EASY', 'exercises/ex6.mp3', 'exercises/ex6.jpg'),
(144, 'A', '2025-07-02 10:00:00.000000', 'Blue is the color of the clear sky.', b'1', 'Blue', 'Green', 'Red', 'Yellow', 20, 1, 'What color is the sky on a clear day?', '', '2025-07-02 10:00:00.000000', 7, 'EASY', 'exercises/ex7.mp3', 'exercises/ex7.jpg'),
(145, 'A', '2025-07-02 10:00:00.000000', 'Blue is the color of the clear sky.', b'1', 'Blue', 'Green', 'Red', 'Yellow', 20, 2, 'What color is the sky on a clear day?', '', '2025-07-02 10:00:00.000000', 7, 'EASY', 'exercises/ex7.mp3', 'exercises/ex7.jpg'),
(146, 'A', '2025-07-02 10:00:00.000000', 'Blue is the color of the clear sky.', b'1', 'Blue', 'Green', 'Red', 'Yellow', 20, 3, 'What color is the sky on a clear day?', '', '2025-07-02 10:00:00.000000', 7, 'EASY', 'exercises/ex7.mp3', 'exercises/ex7.jpg'),
(147, 'A', '2025-07-02 10:00:00.000000', 'Blue is the color of the clear sky.', b'1', 'Blue', 'Green', 'Red', 'Yellow', 20, 4, 'What color is the sky on a clear day?', '', '2025-07-02 10:00:00.000000', 7, 'EASY', 'exercises/ex7.mp3', 'exercises/ex7.jpg'),
(148, 'A', '2025-07-02 10:00:00.000000', 'Blue is the color of the clear sky.', b'1', 'Blue', 'Green', 'Red', 'Yellow', 20, 5, 'What color is the sky on a clear day?', '', '2025-07-02 10:00:00.000000', 7, 'EASY', 'exercises/ex7.mp3', 'exercises/ex7.jpg'),
(149, 'A', '2025-07-02 10:00:00.000000', 'Blue is the color of the clear sky.', b'1', 'Blue', 'Green', 'Red', 'Yellow', 20, 6, 'What color is the sky on a clear day?', '', '2025-07-02 10:00:00.000000', 7, 'EASY', 'exercises/ex7.mp3', 'exercises/ex7.jpg'),
(150, 'A', '2025-07-02 10:00:00.000000', 'Rice is the main ingredient in sushi.', b'1', 'Rice', 'Noodles', 'Bread', 'Potato', 20, 1, 'What is the main ingredient in sushi?', '', '2025-07-02 10:00:00.000000', 8, 'EASY', NULL, NULL),
(151, 'A', '2025-07-02 10:00:00.000000', 'Flour is the main ingredient in bread.', b'1', 'Flour', 'Sugar', 'Salt', 'Yeast', 20, 2, 'What is the main ingredient in bread?', '', '2025-07-02 10:00:00.000000', 8, 'EASY', NULL, NULL),
(152, 'A', '2025-07-02 10:00:00.000000', 'Cocoa is the main ingredient in chocolate.', b'1', 'Cocoa', 'Sugar', 'Milk', 'Vanilla', 20, 3, 'What is the main ingredient in chocolate?', '', '2025-07-02 10:00:00.000000', 8, 'EASY', NULL, NULL),
(153, 'C', '2025-07-02 10:00:00.000000', 'Avocado is the main ingredient in guacamole.', b'1', 'Tomato', 'Onion', 'Avocado', 'Pepper', 20, 4, 'What is the main ingredient in guacamole?', '', '2025-07-02 10:00:00.000000', 8, 'EASY', NULL, NULL),
(154, 'A', '2025-07-02 10:00:00.000000', 'Basil is the main ingredient in pesto.', b'1', 'Basil', 'Parsley', 'Cilantro', 'Mint', 20, 5, 'What is the main ingredient in pesto?', '', '2025-07-02 10:00:00.000000', 8, 'EASY', NULL, NULL),
(155, 'A', '2025-07-02 10:00:00.000000', 'Chickpeas are the main ingredient in hummus.', b'1', 'Chickpeas', 'Lentils', 'Beans', 'Peas', 20, 6, 'What is the main ingredient in hummus?', '', '2025-07-02 10:00:00.000000', 8, 'EASY', NULL, NULL),
(201, 'A', '2025-07-08 12:00:00.000000', 'The audio plays a classical music piece by Beethoven.', b'1', 'Classical', 'Rock', 'Jazz', 'Pop', 10, 1, 'Listen to the audio. What type of music is being played?', '', '2025-07-08 12:00:00.000000', 34, 'EASY', 'music/classical.mp3', 'exercises/ex34.jpg'),
(202, 'A', '2025-07-08 12:00:00.000000', 'The audio describes the Eiffel Tower in Paris.', b'1', 'Eiffel Tower', 'Statue of Liberty', 'Big Ben', 'Sydney Opera House', 10, 1, 'Listen to the audio. What famous landmark is described?', '', '2025-07-08 12:00:00.000000', 19, 'EASY', 'travel/paris.mp3', 'exercises/ex19.jpg'),
(203, 'A', '2025-07-08 12:00:00.000000', 'The audio describes the blue color of the sky.', b'1', 'Blue', 'Green', 'Red', 'Yellow', 10, 1, 'Look at the image and listen. What color is being described?', '', '2025-07-08 12:00:00.000000', 7, 'MEDIUM', 'exercises/ex7.mp3', 'exercises/ex7.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `question_update_log`
--

CREATE TABLE `question_update_log` (
  `id` int(11) NOT NULL,
  `exercise_id` int(11) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `question_update_log`
--

INSERT INTO `question_update_log` (`id`, `exercise_id`, `action`, `timestamp`) VALUES
(1, 0, 'Update completed. Added questions for exercises with 1 question. Total updated: 0', '2025-07-10 12:21:59');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `country` varchar(50) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `gender` enum('MALE','FEMALE','OTHER') DEFAULT NULL,
  `is_active` bit(1) NOT NULL,
  `is_premium` bit(1) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `membership_type` enum('BASIC','PREMIUM','VIP') DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `premium_expires_at` datetime(6) DEFAULT NULL,
  `profile_picture_url` varchar(500) DEFAULT NULL,
  `role` enum('USER','COLLABORATOR','ADMIN') NOT NULL,
  `total_score` int(11) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `username` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `country`, `created_at`, `date_of_birth`, `email`, `full_name`, `gender`, `is_active`, `is_premium`, `last_login`, `membership_type`, `password_hash`, `phone`, `premium_expires_at`, `profile_picture_url`, `role`, `total_score`, `updated_at`, `username`) VALUES
(1, 'VN', '2025-06-01 10:00:00.000000', '1990-01-15', 'admin@leenglish.com', 'System Administrator', 'MALE', b'1', b'1', '2025-06-21 14:00:00.000000', NULL, '$2a$12$UphTMB.7a00/9KN44NnhC.T/Uhede1rXJ9ym34L2/k3Mq.yI6sZ4C', '+84-901-234-567', '2026-06-01 10:00:00.000000', 'https://robohash.org/admin?set=set1&size=200x200', 'ADMIN', 0, '2025-06-21 14:00:00.000000', 'admin'),
(2, 'VN', '2025-06-02 11:00:00.000000', '1995-03-22', 'user1@example.com', 'Nguyễn Văn An', 'MALE', b'1', b'0', '2025-06-21 13:30:00.000000', NULL, '$2a$12$urj6e0rHs7.3IFYN7xkIMu.eUbXgXnDByOHnQHvnaCpB5WoXtoZYW', '+84-901-111-111', NULL, 'https://robohash.org/user1?set=set2&size=200x200', 'USER', 125, '2025-06-21 13:30:00.000000', 'user1'),
(3, 'US', '2025-06-03 12:00:00.000000', '1988-07-10', 'john@example.com', 'John Smith', 'MALE', b'1', b'1', '2025-06-21 12:15:00.000000', NULL, '$2a$10$N.fO7.F2.1bq9A2Kqf9Cue3YYs/Q.RK6XEtzPJ6K8LQGXg.Yy5GZq', '+1-555-0123', '2025-12-03 12:00:00.000000', 'https://robohash.org/john?set=set3&size=200x200', 'USER', 285, '2025-06-21 12:15:00.000000', 'johnsmith'),
(4, 'UK', '2025-06-04 13:00:00.000000', '1992-11-05', 'jane@example.com', 'Jane Wilson', 'FEMALE', b'1', b'1', '2025-06-21 11:45:00.000000', NULL, '$2a$10$N.fO7.F2.1bq9A2Kqf9Cue3YYs/Q.RK6XEtzPJ6K8LQGXg.Yy5GZq', '+44-20-7946-0958', '2025-12-04 13:00:00.000000', 'https://robohash.org/jane?set=set4&size=200x200', 'USER', 195, '2025-06-21 11:45:00.000000', 'janewilson'),
(5, 'VN', '2025-06-05 14:00:00.000000', '1993-09-18', 'collaborator@example.com', 'binh', 'FEMALE', b'1', b'0', '2025-06-21 10:30:00.000000', NULL, '$2a$12$JQU1nnqLvnkQw3pX1DFw..8WKlrwk2V7kfKO.WYhL8rIShEwCWuR2', '+84-901-555-555', NULL, 'https://robohash.org/collab?set=set1&size=200x200', 'COLLABORATOR', 75, '2025-06-21 10:30:00.000000', 'collaborator1'),
(6, 'CA', '2025-06-06 15:00:00.000000', '1987-04-25', 'mike@example.com', 'Mike Johnson', 'MALE', b'1', b'0', '2025-06-20 16:20:00.000000', NULL, '$2a$12$ligz1vF1woQKMIAUnja1keP.g3acOKwsThYUSipfN/AYghfuenlMm', '+1-604-555-0199', NULL, 'https://robohash.org/mike?set=set2&size=200x200', 'USER', 45, '2025-06-20 16:20:00.000000', 'mikej'),
(7, NULL, '2025-06-26 07:56:57.000000', NULL, 'haha@gmail.com', 'haha', NULL, b'1', b'0', NULL, NULL, '$2a$12$lWGNxFdC7E0J6XEJ.ebLOupaC04WfSm3bmw2Eg.9jP1oqZn5dXfCS', NULL, NULL, 'https://robohash.org/LE9.png?set=set4', 'USER', 0, '2025-06-26 07:56:57.000000', 'haha'),
(8, NULL, '2025-07-04 07:57:15.000000', NULL, 'huyplumber@gmail.com', 'Huy Yuhron', NULL, b'1', b'0', NULL, NULL, '$2a$12$JHWOZjgzgpQ1Nf3MI2QKY.GdPeNSyNTXUbEgzp59x3utWpwimykCy', NULL, NULL, 'https://robohash.org/handsomeboy', 'USER', 0, '2025-07-04 07:57:15.000000', 'huyplum'),
(9, NULL, '2025-07-05 11:20:26.000000', NULL, 'huydu@gmail.com', 'Huy Du', NULL, b'1', b'0', NULL, NULL, '$2a$12$8vO1rC4khkdBZPlyq/RcrOKolytJ8EJE7uIQ6UBdO9TmgsnfCjFVS', NULL, NULL, NULL, 'USER', 0, '2025-07-05 11:20:26.000000', 'huyduu19'),
(10, NULL, '2025-07-17 07:31:57.000000', NULL, 'huhu@gmail.com', 'huhu a', 'OTHER', b'1', b'0', NULL, NULL, '$2a$12$l602fx2GP2lUSIIj41EDiOw/FFm6NKabJROfTn6MmbNBzAIYE27Tm', '12112346', NULL, NULL, 'USER', 0, '2025-07-17 07:31:57.000000', 'huhu');

-- --------------------------------------------------------

--
-- Table structure for table `user_activities`
--

CREATE TABLE `user_activities` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `description` text DEFAULT NULL,
  `duration_minutes` int(11) DEFAULT NULL,
  `exercise_id` bigint(20) DEFAULT NULL,
  `flashcard_set_id` bigint(20) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `lesson_id` bigint(20) DEFAULT NULL,
  `points_earned` int(11) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `activity_type` enum('LESSON_COMPLETED','PRACTICE_TEST','FLASHCARD_STUDY','EXERCISE_COMPLETED','ACHIEVEMENT_EARNED','LOGIN','STREAK_MILESTONE','SCORE_IMPROVEMENT','QUESTION_ANSWERED') NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_activities`
--

INSERT INTO `user_activities` (`id`, `created_at`, `description`, `duration_minutes`, `exercise_id`, `flashcard_set_id`, `is_active`, `lesson_id`, `points_earned`, `score`, `title`, `activity_type`, `user_id`) VALUES
(1, '2025-06-30 15:52:46.000000', 'Completed Listening Exercise #1', 15, 101, NULL, b'1', 201, 10, 85, 'Listening Exercise 1', 'EXERCISE_COMPLETED', 1),
(2, '2025-06-30 15:52:46.000000', 'Studied 20 vocabulary flashcards', 10, NULL, 301, b'1', NULL, 5, NULL, 'Vocabulary Flashcards', 'FLASHCARD_STUDY', 2),
(3, '2025-06-30 15:52:46.000000', 'Finished Grammar Lesson: Present Perfect', 20, NULL, NULL, b'1', 202, 8, 90, 'Grammar Lesson: Present Perfect', 'LESSON_COMPLETED', 1),
(4, '2025-06-30 15:52:46.000000', 'Completed TOEIC Practice Test #1', 60, NULL, NULL, b'1', NULL, 95, NULL, 'TOEIC Practice Test #1', 'PRACTICE_TEST', 3),
(5, '2025-06-30 15:52:46.000000', 'Login Streak: 7 days', NULL, NULL, NULL, b'1', NULL, NULL, NULL, '7-Day Streak', 'STREAK_MILESTONE', 4),
(6, '2025-07-04 10:05:32.000000', 'Score: 5/5 (100,0%)', NULL, 1, NULL, b'1', NULL, 25, 100, 'Completed: Exercise 1', 'EXERCISE_COMPLETED', 8),
(7, '2025-07-04 10:06:22.000000', 'Score: 4/5 (80,0%)', NULL, 1, NULL, b'1', NULL, 20, 80, 'Completed: Exercise 1', 'EXERCISE_COMPLETED', 8),
(8, '2025-07-04 10:07:07.000000', 'Score: 5/5 (100,0%)', NULL, 1, NULL, b'1', NULL, 25, 100, 'Completed: Exercise 1', 'EXERCISE_COMPLETED', 8),
(9, '2025-07-04 14:59:26.000000', 'Score: 6/6 (100,0%)', NULL, 1, NULL, b'1', NULL, 30, 100, 'Completed: Exercise 1', 'EXERCISE_COMPLETED', 8),
(10, '2025-07-04 15:00:10.000000', 'Score: 2/6 (33,3%)', NULL, 1, NULL, b'1', NULL, 10, 33, 'Completed: Exercise 1', 'EXERCISE_COMPLETED', 8),
(11, '2025-07-15 12:24:00.000000', 'Completed Listening Exercise #1', 15, 1, NULL, NULL, 1, 10, 85, 'Listening Exercise 1', 'EXERCISE_COMPLETED', 8),
(12, '2025-07-15 12:24:00.000000', 'Studied 20 vocabulary flashcards', 10, NULL, NULL, NULL, NULL, 5, NULL, 'Vocabulary Flashcards', 'FLASHCARD_STUDY', 8),
(13, '2025-07-15 12:24:00.000000', 'Finished Grammar Lesson: Present Perfect', 20, NULL, NULL, NULL, 2, 8, 90, 'Grammar Lesson: Present Perfect', 'LESSON_COMPLETED', 8);

-- --------------------------------------------------------

--
-- Table structure for table `user_exercise_attempts`
--

CREATE TABLE `user_exercise_attempts` (
  `id` bigint(20) NOT NULL,
  `attempt_number` int(11) DEFAULT NULL,
  `completed_at` datetime(6) DEFAULT NULL,
  `correct_answers` int(11) DEFAULT NULL,
  `score` double DEFAULT NULL,
  `started_at` datetime(6) DEFAULT NULL,
  `status` varchar(30) NOT NULL,
  `time_taken` int(11) DEFAULT NULL,
  `total_questions` int(11) NOT NULL,
  `exercise_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_exercise_results`
--

CREATE TABLE `user_exercise_results` (
  `id` bigint(20) NOT NULL,
  `answers_correct` int(11) NOT NULL,
  `completed_at` datetime(6) NOT NULL,
  `score` int(11) NOT NULL,
  `time_taken` int(11) DEFAULT NULL,
  `total_questions` int(11) NOT NULL,
  `exercise_id` bigint(20) NOT NULL,
  `lesson_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_exercise_results`
--

INSERT INTO `user_exercise_results` (`id`, `answers_correct`, `completed_at`, `score`, `time_taken`, `total_questions`, `exercise_id`, `lesson_id`, `user_id`) VALUES
(1, 1, '2025-07-05 05:39:20.000000', 17, 60, 6, 1, 1, 7),
(2, 1, '2025-07-05 11:32:27.000000', 17, 60, 6, 8, 3, 9),
(3, 1, '2025-07-05 11:33:13.000000', 17, 60, 6, 8, 3, 9),
(4, 0, '2025-07-05 11:44:18.000000', 0, 60, 12, 7, 3, 9),
(5, 0, '2025-07-06 07:03:56.000000', 0, 60, 6, 4, 2, 9),
(6, 1, '2025-07-06 07:08:16.000000', 17, 60, 6, 4, 2, 9),
(7, 2, '2025-07-09 09:15:59.000000', 33, 60, 6, 4, 2, 9),
(8, 1, '2025-07-10 09:35:03.000000', 17, 60, 6, 4, 2, 8),
(9, 2, '2025-07-10 14:42:08.000000', 67, 60, 3, 2, 1, 9),
(10, 3, '2025-07-10 16:44:44.000000', 50, 60, 6, 8, 3, 9),
(11, 3, '2025-07-10 16:45:47.000000', 33, 60, 9, 7, 3, 9),
(12, 0, '2025-07-10 16:46:14.000000', 0, 60, 6, 8, 3, 9),
(13, 1, '2025-07-10 16:46:39.000000', 11, 60, 9, 7, 3, 9),
(14, 1, '2025-07-10 16:48:02.000000', 11, 60, 9, 7, 3, 9),
(15, 5, '2025-07-15 12:24:00.000000', 100, NULL, 5, 1, 1, 8),
(16, 3, '2025-07-17 06:47:29.000000', 100, 600, 3, 4, 2, 8),
(17, 1, '2025-07-17 08:07:26.000000', 33, 600, 3, 4, 2, 10),
(18, 2, '2025-07-17 08:29:26.000000', 33, 600, 6, 1, 1, 10),
(19, 1, '2025-07-17 08:36:24.000000', 33, 600, 3, 4, 2, 10),
(20, 2, '2025-07-17 08:46:29.000000', 67, 600, 3, 4, 2, 10),
(21, 3, '2025-07-17 08:46:57.000000', 100, 600, 3, 4, 2, 10),
(22, 1, '2025-07-17 08:51:13.000000', 33, 600, 3, 4, 2, 10),
(23, 1, '2025-07-17 08:52:05.000000', 33, 600, 3, 4, 2, 10),
(24, 2, '2025-07-17 08:56:37.000000', 67, 600, 3, 4, 2, 10),
(25, 2, '2025-07-17 08:57:08.000000', 67, 600, 3, 4, 2, 10),
(26, 0, '2025-07-17 09:04:53.000000', 0, 600, 3, 4, 2, 10),
(27, 0, '2025-07-17 09:05:42.000000', 0, 600, 3, 4, 2, 10),
(28, 2, '2025-07-17 09:15:27.000000', 67, 600, 3, 4, 2, 10),
(29, 0, '2025-07-17 09:15:58.000000', 0, 600, 3, 4, 2, 10),
(30, 0, '2025-07-17 09:20:27.000000', 0, 600, 3, 4, 2, 10),
(31, 1, '2025-07-17 09:27:20.000000', 33, 600, 3, 2, 1, 10),
(32, 0, '2025-07-17 09:33:17.000000', 0, 600, 3, 4, 2, 10),
(33, 0, '2025-07-17 09:33:59.000000', 0, 600, 3, 4, 2, 10),
(34, 0, '2025-07-17 09:39:17.000000', 0, 600, 3, 4, 2, 10),
(35, 1, '2025-07-17 09:39:52.000000', 33, 600, 3, 4, 2, 10),
(36, 0, '2025-07-17 09:55:31.000000', 0, 600, 3, 4, 2, 10),
(37, 0, '2025-07-17 09:56:43.000000', 0, 600, 3, 4, 2, 10),
(38, 0, '2025-07-17 09:57:57.000000', 0, 600, 3, 4, 2, 10),
(39, 1, '2025-07-17 10:05:36.000000', 33, 600, 3, 4, 2, 10);

-- --------------------------------------------------------

--
-- Table structure for table `user_feedback`
--

CREATE TABLE `user_feedback` (
  `id` bigint(20) NOT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `rating` int(11) NOT NULL,
  `submitted_at` datetime(6) NOT NULL,
  `exercise_id` bigint(20) DEFAULT NULL,
  `lesson_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_feedback`
--

INSERT INTO `user_feedback` (`id`, `comment`, `rating`, `submitted_at`, `exercise_id`, `lesson_id`, `user_id`) VALUES
(1, 'good', 5, '2025-07-05 11:46:56.000000', 7, 3, 9),
(2, 'ok', 5, '2025-07-06 07:08:28.000000', 4, 2, 9),
(3, 'good 1', 5, '2025-07-09 09:16:15.000000', 4, 2, 9),
(4, NULL, 5, '2025-07-14 11:59:24.000000', 4, 2, 8),
(5, NULL, 5, '2025-07-14 11:59:55.000000', 4, 2, 8),
(6, NULL, 5, '2025-07-14 11:59:58.000000', 4, 2, 8),
(7, NULL, 5, '2025-07-14 12:00:40.000000', 4, 2, 8),
(8, NULL, 1, '2025-07-14 12:02:08.000000', 4, 2, 8),
(9, NULL, 3, '2025-07-14 12:30:07.000000', 4, 2, 8),
(10, NULL, 2, '2025-07-14 12:30:41.000000', 4, 2, 8),
(11, NULL, 2, '2025-07-14 12:30:52.000000', 4, 2, 8),
(12, NULL, 2, '2025-07-14 12:35:55.000000', 4, 2, 8),
(13, NULL, 5, '2025-07-14 13:28:07.000000', 4, 2, 8),
(14, NULL, 1, '2025-07-14 13:32:04.000000', 4, 2, 8),
(15, NULL, 1, '2025-07-14 16:34:43.000000', 2, 1, 8),
(16, NULL, 3, '2025-07-14 17:25:21.000000', 2, 1, 8),
(17, NULL, 5, '2025-07-14 17:38:41.000000', 4, 2, 8),
(18, NULL, 5, '2025-07-14 18:05:15.000000', 4, 2, 8),
(19, NULL, 4, '2025-07-15 03:30:26.000000', 4, 2, 8),
(20, 'aaaaa', 3, '2025-07-15 03:43:51.000000', 4, 2, 8),
(21, 'Great lesson!', 5, '2025-07-15 12:24:00.000000', 1, 1, 8),
(22, 'hahah', 5, '2025-07-15 11:20:44.000000', 2, 1, 8),
(23, 'huhuhu', 5, '2025-07-17 09:56:56.000000', 4, 2, 10);

-- --------------------------------------------------------

--
-- Table structure for table `user_lesson_progress`
--

CREATE TABLE `user_lesson_progress` (
  `id` bigint(20) NOT NULL,
  `completed_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `last_accessed_at` datetime(6) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `progress_percentage` int(11) NOT NULL,
  `started_at` datetime(6) DEFAULT NULL,
  `status` varchar(50) NOT NULL,
  `time_spent_minutes` int(11) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `lesson_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_lesson_progress`
--

INSERT INTO `user_lesson_progress` (`id`, `completed_at`, `created_at`, `last_accessed_at`, `notes`, `progress_percentage`, `started_at`, `status`, `time_spent_minutes`, `updated_at`, `lesson_id`, `user_id`) VALUES
(1, NULL, '2025-07-15 12:24:00.000000', NULL, NULL, 100, NULL, 'completed', NULL, NULL, 1, 8),
(2, NULL, '2025-07-15 12:24:00.000000', NULL, NULL, 80, NULL, 'in_progress', NULL, NULL, 2, 8),
(3, NULL, '2025-07-15 12:24:00.000000', NULL, NULL, 50, NULL, 'in_progress', NULL, NULL, 3, 8),
(4, '2025-07-17 10:05:36.000000', '2025-07-17 09:55:31.000000', '2025-07-17 10:05:36.000000', NULL, 100, '2025-07-17 09:55:31.000000', 'COMPLETED', 20, '2025-07-17 10:05:36.000000', 2, 10);

-- --------------------------------------------------------

--
-- Table structure for table `user_memberships`
--

CREATE TABLE `user_memberships` (
  `id` bigint(20) NOT NULL,
  `auto_renew` bit(1) DEFAULT NULL,
  `cancellation_reason` varchar(255) DEFAULT NULL,
  `cancelled_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `end_date` date NOT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `payment_status` varchar(255) DEFAULT NULL,
  `start_date` date NOT NULL,
  `status` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `membership_plan_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_question_answers`
--

CREATE TABLE `user_question_answers` (
  `id` bigint(20) NOT NULL,
  `is_correct` bit(1) NOT NULL,
  `selected_answer` varchar(255) DEFAULT NULL,
  `question_id` bigint(20) NOT NULL,
  `result_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_question_answers`
--

INSERT INTO `user_question_answers` (`id`, `is_correct`, `selected_answer`, `question_id`, `result_id`) VALUES
(1, b'1', 'A', 97, 9),
(2, b'0', 'A', 98, 9),
(3, b'1', 'B', 99, 9),
(4, b'1', 'A', 150, 10),
(5, b'0', 'C', 151, 10),
(6, b'1', 'A', 152, 10),
(7, b'0', 'A', 153, 10),
(8, b'1', 'A', 154, 10),
(9, b'0', 'C', 155, 10),
(10, b'1', 'C', 127, 11),
(11, b'1', 'C', 144, 11),
(12, b'0', 'C', 128, 11),
(13, b'1', 'B', 145, 11),
(14, b'0', 'B', 129, 11),
(15, b'0', 'B', 146, 11),
(16, b'0', 'B', 147, 11),
(17, b'0', 'C', 150, 12),
(18, b'0', 'C', 151, 12),
(19, b'0', 'C', 152, 12),
(20, b'0', 'D', 153, 12),
(21, b'0', 'D', 154, 12),
(22, b'0', 'C', 155, 12),
(23, b'1', 'C', 127, 13),
(24, b'1', 'C', 127, 14),
(25, b'1', 'C', 109, 16),
(26, b'1', 'B', 110, 16),
(27, b'1', 'C', 111, 16),
(28, b'0', 'B', 109, 17),
(29, b'0', 'C', 110, 17),
(30, b'1', 'C', 111, 17),
(31, b'1', 'A', 91, 18),
(32, b'0', 'A', 92, 18),
(33, b'1', 'C', 93, 18),
(34, b'0', 'B', 94, 18),
(35, b'0', 'D', 95, 18),
(36, b'0', 'C', 96, 18),
(37, b'0', 'B', 109, 19),
(38, b'0', 'C', 110, 19),
(39, b'1', 'C', 111, 19),
(40, b'0', 'D', 109, 20),
(41, b'1', 'B', 110, 20),
(42, b'1', 'C', 111, 20),
(43, b'1', 'C', 109, 21),
(44, b'1', 'B', 110, 21),
(45, b'1', 'C', 111, 21),
(46, b'0', 'B', 109, 22),
(47, b'0', 'C', 110, 22),
(48, b'1', 'C', 111, 22),
(49, b'0', 'D', 109, 23),
(50, b'0', 'C', 110, 23),
(51, b'1', 'C', 111, 23),
(52, b'1', 'C', 109, 24),
(53, b'0', 'D', 110, 24),
(54, b'1', 'C', 111, 24),
(55, b'1', 'C', 109, 25),
(56, b'0', 'D', 110, 25),
(57, b'1', 'C', 111, 25),
(58, b'0', 'D', 109, 26),
(59, b'0', 'D', 110, 26),
(60, b'0', 'D', 111, 26),
(61, b'0', 'D', 109, 27),
(62, b'0', 'D', 110, 27),
(63, b'0', 'D', 111, 27),
(64, b'1', 'C', 109, 28),
(65, b'0', 'C', 110, 28),
(66, b'1', 'C', 111, 28),
(67, b'0', 'D', 109, 29),
(68, b'0', 'D', 110, 29),
(69, b'0', 'D', 111, 29),
(70, b'0', 'D', 109, 30),
(71, b'0', 'D', 110, 30),
(72, b'0', 'D', 111, 30),
(73, b'0', 'D', 97, 31),
(74, b'0', 'D', 98, 31),
(75, b'1', 'B', 99, 31),
(76, b'0', 'D', 109, 32),
(77, b'0', 'D', 110, 32),
(78, b'0', 'D', 111, 32),
(79, b'0', 'D', 109, 33),
(80, b'0', 'D', 110, 33),
(81, b'0', 'D', 111, 33),
(82, b'0', 'D', 109, 34),
(83, b'0', 'D', 110, 34),
(84, b'0', 'D', 111, 34),
(85, b'0', 'B', 109, 35),
(86, b'0', 'C', 110, 35),
(87, b'1', 'C', 111, 35),
(88, b'0', 'D', 109, 36),
(89, b'0', 'D', 110, 36),
(90, b'0', 'D', 111, 36),
(91, b'0', 'D', 109, 37),
(92, b'0', 'D', 110, 37),
(93, b'0', 'D', 111, 37),
(94, b'0', 'D', 109, 38),
(95, b'0', 'D', 110, 38),
(96, b'0', 'D', 111, 38),
(97, b'0', 'A', 109, 39),
(98, b'0', 'C', 110, 39),
(99, b'1', 'C', 111, 39);

-- --------------------------------------------------------

--
-- Table structure for table `user_question_answers_backup`
--

CREATE TABLE `user_question_answers_backup` (
  `id` bigint(20) NOT NULL,
  `is_correct` bit(1) NOT NULL,
  `selected_answer` varchar(255) DEFAULT NULL,
  `question_id` bigint(20) NOT NULL,
  `result_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_question_answers_backup`
--

INSERT INTO `user_question_answers_backup` (`id`, `is_correct`, `selected_answer`, `question_id`, `result_id`) VALUES
(1, b'1', 'A', 91, 1),
(2, b'1', 'A', 150, 2),
(3, b'1', 'A', 150, 3),
(4, b'0', 'A', 127, 4),
(5, b'0', 'A', 109, 5),
(6, b'0', 'D', 109, 6),
(7, b'0', 'C', 110, 6),
(8, b'0', 'B', 111, 6),
(9, b'1', 'D', 112, 6),
(10, b'0', 'D', 113, 6),
(11, b'1', 'C', 109, 7),
(12, b'0', 'C', 110, 7),
(13, b'0', 'C', 111, 7),
(14, b'0', 'C', 112, 7),
(15, b'0', 'C', 113, 7),
(16, b'1', 'C', 114, 7),
(17, b'0', 'D', 109, 8),
(18, b'0', 'C', 110, 8),
(19, b'0', 'D', 111, 8),
(20, b'0', 'A', 112, 8),
(21, b'1', 'B', 113, 8),
(22, b'0', 'D', 114, 8);

-- --------------------------------------------------------

--
-- Table structure for table `user_stats`
--

CREATE TABLE `user_stats` (
  `id` bigint(20) NOT NULL,
  `average_score` decimal(5,2) NOT NULL DEFAULT 0.00,
  `created_at` datetime(6) NOT NULL,
  `highest_score` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `last_study_date` datetime(6) DEFAULT NULL,
  `lessons_completed` int(11) NOT NULL DEFAULT 0,
  `practice_tests` int(11) NOT NULL DEFAULT 0,
  `study_streak` int(11) NOT NULL DEFAULT 0,
  `total_flashcards_studied` int(11) NOT NULL DEFAULT 0,
  `total_study_time` int(11) NOT NULL DEFAULT 0,
  `updated_at` datetime(6) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_stats`
--

INSERT INTO `user_stats` (`id`, `average_score`, `created_at`, `highest_score`, `is_active`, `last_study_date`, `lessons_completed`, `practice_tests`, `study_streak`, `total_flashcards_studied`, `total_study_time`, `updated_at`, `user_id`) VALUES
(1, 85.50, '2025-06-30 15:30:16.000000', 950, 1, '2025-06-30 15:30:16.000000', 12, 5, 7, 120, 300, '2025-06-30 15:30:16.000000', 1),
(2, 78.00, '2025-06-30 15:30:16.000000', 850, 1, '2025-06-30 15:30:16.000000', 10, 3, 5, 100, 250, '2025-06-30 15:30:16.000000', 2),
(3, 92.75, '2025-06-30 15:30:16.000000', 980, 1, '2025-06-30 15:30:16.000000', 15, 7, 10, 150, 400, '2025-06-30 15:30:16.000000', 3),
(4, 70.00, '2025-06-30 15:30:16.000000', 800, 1, '2025-06-30 15:30:16.000000', 8, 2, 3, 80, 180, '2025-06-30 15:30:16.000000', 4),
(5, 88.25, '2025-06-30 15:30:16.000000', 970, 1, '2025-06-30 15:30:16.000000', 14, 6, 9, 140, 350, '2025-06-30 15:30:16.000000', 5),
(6, 85.50, '2025-07-15 12:24:00.000000', 950, 1, NULL, 12, 5, 7, 120, 300, '2025-07-15 12:24:00.000000', 8);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `exercises`
--
ALTER TABLE `exercises`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKes9e0n86cjfb0l6349clxvxc1` (`lesson_id`);

--
-- Indexes for table `exercise_results`
--
ALTER TABLE `exercise_results`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_exercise_attempt` (`user_id`,`exercise_id`,`attempt_number`),
  ADD KEY `idx_user_exercise` (`user_id`,`exercise_id`),
  ADD KEY `idx_lesson_user` (`lesson_id`,`user_id`),
  ADD KEY `idx_exercise_completion` (`exercise_id`,`is_completed`);

--
-- Indexes for table `flashcards`
--
ALTER TABLE `flashcards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKob8kpup4qkh3734j7imlsl2hu` (`flashcard_set_id`);

--
-- Indexes for table `flashcard_sets`
--
ALTER TABLE `flashcard_sets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK1s8x1irthn2o421vb54f3ubrq` (`created_by`);

--
-- Indexes for table `health_checks`
--
ALTER TABLE `health_checks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_health_check_time` (`check_time`),
  ADD KEY `idx_health_status` (`status`);

--
-- Indexes for table `lessons`
--
ALTER TABLE `lessons`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `membership_plans`
--
ALTER TABLE `membership_plans`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_nconflq2x1uvxvs7sc0mnmh4` (`name`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKh5a0kaygr150d8lqep5u1tmwr` (`exercise_id`);

--
-- Indexes for table `questions_backup`
--
ALTER TABLE `questions_backup`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKh5a0kaygr150d8lqep5u1tmwr` (`exercise_id`);

--
-- Indexes for table `questions_backup_full`
--
ALTER TABLE `questions_backup_full`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKh5a0kaygr150d8lqep5u1tmwr` (`exercise_id`);

--
-- Indexes for table `question_update_log`
--
ALTER TABLE `question_update_log`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`),
  ADD UNIQUE KEY `UK_r43af9ap4edm43mmtq01oddj6` (`username`),
  ADD KEY `idx_username` (`username`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_role` (`role`);

--
-- Indexes for table `user_activities`
--
ALTER TABLE `user_activities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKbe7yq8t74yxeoarmxlxevoped` (`user_id`);

--
-- Indexes for table `user_exercise_attempts`
--
ALTER TABLE `user_exercise_attempts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKjkn4lyhdch3xfw41w9fp9fbpi` (`exercise_id`),
  ADD KEY `FKibglq9977xq7ddd1wi5974bbj` (`user_id`);

--
-- Indexes for table `user_exercise_results`
--
ALTER TABLE `user_exercise_results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKaimiqickm7wta4m2mmv8ec2a2` (`exercise_id`),
  ADD KEY `FKfsffoafjs5fmqq1tc6sp6t99` (`lesson_id`),
  ADD KEY `FKlmvgfq8njonu9i0xu7cgjyaaj` (`user_id`);

--
-- Indexes for table `user_feedback`
--
ALTER TABLE `user_feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKqr87kbapyfdp19mkwxyg65rv7` (`exercise_id`),
  ADD KEY `FK4d190twdlu4gu033gpqmo0clw` (`lesson_id`),
  ADD KEY `FK3n07h1s6qfyeyybysc1hcsxu` (`user_id`);

--
-- Indexes for table `user_lesson_progress`
--
ALTER TABLE `user_lesson_progress`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKkm3wlef4wdkrsdwkbly0sid0l` (`lesson_id`),
  ADD KEY `FK15tdn9l75kjm9imsarb223k9q` (`user_id`);

--
-- Indexes for table `user_memberships`
--
ALTER TABLE `user_memberships`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKhe1hvgjpdth3xh0p4ogsl7c01` (`membership_plan_id`),
  ADD KEY `FK3aftj3ypdb19itnsapcxykedv` (`user_id`);

--
-- Indexes for table `user_question_answers`
--
ALTER TABLE `user_question_answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK85c3uofrm1xg4x2x9nd5gr067` (`question_id`),
  ADD KEY `FKsp1cg7i2idwrqemeu33ay642o` (`result_id`);

--
-- Indexes for table `user_question_answers_backup`
--
ALTER TABLE `user_question_answers_backup`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK85c3uofrm1xg4x2x9nd5gr067` (`question_id`),
  ADD KEY `FKsp1cg7i2idwrqemeu33ay642o` (`result_id`);

--
-- Indexes for table `user_stats`
--
ALTER TABLE `user_stats`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_cgfgfs7fk42h7ck71lrs42sou` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `exercises`
--
ALTER TABLE `exercises`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT for table `exercise_results`
--
ALTER TABLE `exercise_results`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `flashcards`
--
ALTER TABLE `flashcards`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `flashcard_sets`
--
ALTER TABLE `flashcard_sets`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `health_checks`
--
ALTER TABLE `health_checks`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lessons`
--
ALTER TABLE `lessons`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `membership_plans`
--
ALTER TABLE `membership_plans`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=204;

--
-- AUTO_INCREMENT for table `questions_backup`
--
ALTER TABLE `questions_backup`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=156;

--
-- AUTO_INCREMENT for table `questions_backup_full`
--
ALTER TABLE `questions_backup_full`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=204;

--
-- AUTO_INCREMENT for table `question_update_log`
--
ALTER TABLE `question_update_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `user_activities`
--
ALTER TABLE `user_activities`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `user_exercise_attempts`
--
ALTER TABLE `user_exercise_attempts`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_exercise_results`
--
ALTER TABLE `user_exercise_results`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `user_feedback`
--
ALTER TABLE `user_feedback`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `user_lesson_progress`
--
ALTER TABLE `user_lesson_progress`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user_memberships`
--
ALTER TABLE `user_memberships`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_question_answers`
--
ALTER TABLE `user_question_answers`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

--
-- AUTO_INCREMENT for table `user_question_answers_backup`
--
ALTER TABLE `user_question_answers_backup`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `user_stats`
--
ALTER TABLE `user_stats`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `exercises`
--
ALTER TABLE `exercises`
  ADD CONSTRAINT `FKes9e0n86cjfb0l6349clxvxc1` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`);

--
-- Constraints for table `exercise_results`
--
ALTER TABLE `exercise_results`
  ADD CONSTRAINT `FKasrpyx26t374nb78dknkkgb9i` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKlkccy7n0tdswuwmwukcs0sucd` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`),
  ADD CONSTRAINT `FKovjx6jepaj4a9yqr8qi46wgef` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`);

--
-- Constraints for table `flashcards`
--
ALTER TABLE `flashcards`
  ADD CONSTRAINT `FKob8kpup4qkh3734j7imlsl2hu` FOREIGN KEY (`flashcard_set_id`) REFERENCES `flashcard_sets` (`id`);

--
-- Constraints for table `flashcard_sets`
--
ALTER TABLE `flashcard_sets`
  ADD CONSTRAINT `FK1s8x1irthn2o421vb54f3ubrq` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `FKh5a0kaygr150d8lqep5u1tmwr` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`);

--
-- Constraints for table `user_activities`
--
ALTER TABLE `user_activities`
  ADD CONSTRAINT `FKbe7yq8t74yxeoarmxlxevoped` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `user_exercise_attempts`
--
ALTER TABLE `user_exercise_attempts`
  ADD CONSTRAINT `FKibglq9977xq7ddd1wi5974bbj` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKjkn4lyhdch3xfw41w9fp9fbpi` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`);

--
-- Constraints for table `user_exercise_results`
--
ALTER TABLE `user_exercise_results`
  ADD CONSTRAINT `FKaimiqickm7wta4m2mmv8ec2a2` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`),
  ADD CONSTRAINT `FKfsffoafjs5fmqq1tc6sp6t99` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`),
  ADD CONSTRAINT `FKlmvgfq8njonu9i0xu7cgjyaaj` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `user_feedback`
--
ALTER TABLE `user_feedback`
  ADD CONSTRAINT `FK3n07h1s6qfyeyybysc1hcsxu` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FK4d190twdlu4gu033gpqmo0clw` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`),
  ADD CONSTRAINT `FKqr87kbapyfdp19mkwxyg65rv7` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`);

--
-- Constraints for table `user_lesson_progress`
--
ALTER TABLE `user_lesson_progress`
  ADD CONSTRAINT `FK15tdn9l75kjm9imsarb223k9q` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKkm3wlef4wdkrsdwkbly0sid0l` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`);

--
-- Constraints for table `user_memberships`
--
ALTER TABLE `user_memberships`
  ADD CONSTRAINT `FK3aftj3ypdb19itnsapcxykedv` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKhe1hvgjpdth3xh0p4ogsl7c01` FOREIGN KEY (`membership_plan_id`) REFERENCES `membership_plans` (`id`);

--
-- Constraints for table `user_question_answers`
--
ALTER TABLE `user_question_answers`
  ADD CONSTRAINT `FK85c3uofrm1xg4x2x9nd5gr067` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`),
  ADD CONSTRAINT `FKsp1cg7i2idwrqemeu33ay642o` FOREIGN KEY (`result_id`) REFERENCES `user_exercise_results` (`id`);

--
-- Constraints for table `user_stats`
--
ALTER TABLE `user_stats`
  ADD CONSTRAINT `FKj277c5rcqlsvwkk3hj39e2b74` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
