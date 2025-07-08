# TOEIC Learning Mobile App

## Tổng Quan

Ứng dụng di động TOEIC Learning được phát triển bằng Flutter, cung cấp một nền tảng học tập toàn diện cho người học chuẩn bị thi TOEIC. Ứng dụng này là phần mở rộng của hệ thống web hiện có, cho phép người dùng học tập mọi lúc mọi nơi.

## Cấu Trúc Dự Án

### Thư Mục Chính

```
mobile/
├── lib/                    # Mã nguồn chính
│   ├── main.dart           # Điểm khởi đầu ứng dụng
│   ├── models/             # Các model dữ liệu
│   ├── providers/          # State management
│   ├── screens/            # Các màn hình
│   ├── services/           # Dịch vụ API, Auth, Storage
│   └── widgets/            # Các widget tái sử dụng
├── assets/                 # Tài nguyên (hình ảnh, âm thanh)
├── pubspec.yaml            # Cấu hình và dependencies
└── README.md               # Tài liệu hướng dẫn
```

## Các Tính Năng Đã Phát Triển

### 1. Hệ Thống Xác Thực

- Đăng nhập/Đăng ký tài khoản
- Xác thực JWT với backend
- Lưu trữ session an toàn
- Quản lý profile người dùng

### 2. Học Tập TOEIC

- Bài học theo cấp độ và danh mục
- Hệ thống flashcard với hình ảnh và âm thanh
- Bài tập trắc nghiệm tương tác
- Phân loại câu hỏi theo 7 phần của bài thi TOEIC

### 3. Widget Câu Hỏi Tương Tác

- Hiển thị câu hỏi với đầy đủ thông tin (nội dung, hình ảnh, âm thanh)
- Các tùy chọn trả lời tương tác
- Hiển thị kết quả và giải thích sau khi trả lời
- Hỗ trợ các phần của bài thi TOEIC (Listening Parts 1-4, Reading Parts 5-7)

### 4. Mô Hình Dữ Liệu

- User: thông tin người dùng, phân quyền, và tiến độ học tập
- Lesson: bài học theo cấp độ và danh mục
- FlashcardSet & Flashcard: bộ thẻ học từ vựng
- Question & Answer: câu hỏi và đáp án cho các bài tập TOEIC

### 5. Giao Diện Người Dùng

- Thiết kế material responsive
- Dark mode và light mode
- UI tương tác và animations
- Hỗ trợ đa ngôn ngữ (Tiếng Anh và Tiếng Việt)

## Công Nghệ Sử Dụng

- **Flutter**: Framework chính để phát triển đa nền tảng
- **Provider**: State management
- **Dio**: HTTP client để gọi API
- **Shared Preferences**: Lưu trữ cục bộ
- **Just Audio**: Xử lý audio cho phần Listening
- **Flutter Secure Storage**: Lưu trữ an toàn cho token

## Tích Hợp với Backend

- Kết nối với Spring Boot backend qua RESTful API
- Xác thực JWT
- Đồng bộ hóa dữ liệu và tiến độ học tập
- Upload/download tài nguyên học tập

## Phát Triển Gần Đây

1. **Cập Nhật Mô Hình Dữ Liệu TOEIC**

   - Thêm các model `Question` và `Answer` để hỗ trợ bài tập TOEIC
   - Tạo enum `QuestionSection` để phân loại câu hỏi theo các phần thi

2. **Widget Câu Hỏi Tương Tác**

   - Phát triển `QuestionWidget` để hiển thị và tương tác với câu hỏi TOEIC
   - Hỗ trợ hiển thị hình ảnh và phát âm thanh
   - Hiệu ứng UI khi chọn đáp án và hiển thị kết quả

3. **Tối Ưu Hóa Hiệu Suất**
   - Lazy loading cho danh sách câu hỏi và bài học
   - Caching dữ liệu để giảm thiểu gọi API
   - Tối ưu hiển thị UI trên các thiết bị khác nhau

## Hướng Dẫn Cài Đặt và Chạy

### Yêu Cầu

- Flutter SDK 3.10.0 trở lên
- Dart 3.0.0 trở lên
- Android Studio hoặc VS Code với Flutter extensions

### Cài Đặt

1. Clone repository:

   ```
   git clone <repository-url>
   cd TOEIC-Group-Huy/mobile
   ```

2. Cài đặt dependencies:

   ```
   flutter pub get
   ```

3. Chạy ứng dụng:
   ```
   flutter run
   ```

### Build Release

- Android:
  ```
  flutter build apk --release
  ```
- iOS:
  ```
  flutter build ios --release
  ```

## Kế Hoạch Phát Triển Tiếp Theo

1. Hoàn thiện phần nghe với trình phát âm thanh tùy chỉnh
2. Thêm tính năng theo dõi tiến độ và thống kê học tập
3. Thêm tính năng luyện thi thử toàn bộ bài thi TOEIC
4. Tối ưu hóa offline mode cho học tập không cần kết nối internet
5. Tích hợp thông báo đẩy cho lịch học và nhắc nhở

## Đóng Góp

Vui lòng đọc [CONTRIBUTING.md](../CONTRIBUTING.md) để biết chi tiết về quy trình đóng góp code.

## Liên Hệ

Nếu có bất kỳ câu hỏi hoặc đề xuất nào, vui lòng liên hệ team phát triển qua email hoặc tạo issue trong repository.

## Cấu Trúc Dữ Liệu Học Tập

### Mô Hình Quan Hệ Dữ Liệu

Ứng dụng mobile được thiết kế phản ánh cấu trúc dữ liệu của backend Java Spring Boot, với quan hệ:

```
Lesson (1) ----> (n) Exercise (1) ----> (n) Question
```

#### 1. Lesson (Bài Học)

- Đại diện cho một bài học hoàn chỉnh
- Thuộc tính chính:
  - `id`: Định danh bài học
  - `title`: Tiêu đề bài học
  - `description`: Mô tả ngắn gọn
  - `content`: Nội dung chi tiết của bài học
  - `level`: Cấp độ (BEGINNER, INTERMEDIATE, ADVANCED)
  - `imageUrl`: Hình ảnh minh họa
  - `audioUrl`: Tệp âm thanh (nếu có)
  - `isPremium`: Xác định bài học miễn phí hay trả phí
  - `orderIndex`: Thứ tự hiển thị

#### 2. Exercise (Bài Tập)

- Mỗi bài học có nhiều bài tập
- Thuộc tính chính:
  - `id`: Định danh bài tập
  - `title`: Tiêu đề bài tập
  - `description`: Mô tả hướng dẫn làm bài
  - `type`: Loại bài tập (LISTENING, READING, GRAMMAR, VOCABULARY)
  - `level`: Cấp độ khó
  - `difficultyLevel`: Mức độ khó chi tiết (1-5)
  - `points`: Điểm tối đa
  - `timeLimitSeconds`: Giới hạn thời gian làm bài
  - `audioUrl`: Tệp âm thanh cho bài tập nghe
  - `imageUrl`: Hình ảnh minh họa (nếu có)

#### 3. Question (Câu Hỏi)

- Mỗi bài tập có nhiều câu hỏi
- Thuộc tính chính:
  - `id`: Định danh câu hỏi
  - `exerciseId`: Liên kết với bài tập
  - `questionText`: Nội dung câu hỏi
  - `questionType`: Loại câu hỏi (MULTIPLE_CHOICE, FILL_IN_BLANK, MATCHING)
  - `options`: Các lựa chọn trả lời (JSON)
  - `correctAnswer`: Đáp án đúng
  - `explanation`: Giải thích đáp án
  - `audioUrl`: Tệp âm thanh (cho phần nghe)
  - `imageUrl`: Hình ảnh minh họa
  - `orderIndex`: Thứ tự hiển thị

### Luồng Tương Tác Người Dùng

1. Người dùng xem danh sách bài học trên màn hình chính
2. Chọn một bài học để xem chi tiết nội dung
3. Truy cập các bài tập liên quan đến bài học
4. Làm bài tập với nhiều câu hỏi khác nhau
5. Nhận kết quả và phản hồi ngay sau khi hoàn thành

### Màn Hình Chính Trong Ứng Dụng

- **Màn hình Lessons**: Hiển thị danh sách bài học theo danh mục/cấp độ
- **Màn hình Lesson Detail**: Chi tiết bài học và danh sách bài tập
- **Màn hình Exercise**: Hiển thị hướng dẫn và bắt đầu làm bài
- **Màn hình Questions**: Hiển thị các câu hỏi của bài tập để người dùng trả lời
- **Màn hình Results**: Tổng hợp kết quả sau khi hoàn thành bài tập

## Triển Khai Giao Diện Người Dùng Trong Flutter

### Các Màn Hình Chính

#### 1. Màn Hình Danh Sách Bài Học (LessonListScreen)

```dart
class LessonListScreen extends StatefulWidget {
  @override
  _LessonListScreenState createState() => _LessonListScreenState();
}

class _LessonListScreenState extends State<LessonListScreen> {
  List<Lesson> lessons = [];
  bool isLoading = false;

  @override
  void initState() {
    super.initState();
    _fetchLessons();
  }

  Future<void> _fetchLessons() async {
    setState(() => isLoading = true);
    try {
      // Gọi API lấy danh sách bài học
      final fetchedLessons = await ApiService().getLessons();
      setState(() => lessons = fetchedLessons);
    } catch (e) {
      // Xử lý lỗi
    } finally {
      setState(() => isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Bài Học TOEIC')),
      body: isLoading
        ? Center(child: CircularProgressIndicator())
        : ListView.builder(
            itemCount: lessons.length,
            itemBuilder: (context, index) {
              return LessonCard(
                lesson: lessons[index],
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => LessonDetailScreen(lesson: lessons[index]),
                  ),
                ),
              );
            },
          ),
    );
  }
}
```

#### 2. Màn Hình Chi Tiết Bài Học (LessonDetailScreen)

```dart
class LessonDetailScreen extends StatefulWidget {
  final Lesson lesson;

  const LessonDetailScreen({Key? key, required this.lesson}) : super(key: key);

  @override
  _LessonDetailScreenState createState() => _LessonDetailScreenState();
}

class _LessonDetailScreenState extends State<LessonDetailScreen> {
  List<Exercise> exercises = [];
  bool isLoading = false;

  @override
  void initState() {
    super.initState();
    _fetchExercises();
  }

  Future<void> _fetchExercises() async {
    setState(() => isLoading = true);
    try {
      // Gọi API lấy danh sách bài tập của bài học
      final fetchedExercises = await ApiService().getExercisesByLessonId(widget.lesson.id);
      setState(() => exercises = fetchedExercises);
    } catch (e) {
      // Xử lý lỗi
    } finally {
      setState(() => isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.lesson.title)),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hiển thị thông tin bài học
            LessonHeader(lesson: widget.lesson),

            // Nội dung bài học
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Text(
                widget.lesson.content,
                style: TextStyle(fontSize: 16),
              ),
            ),

            // Danh sách bài tập
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Text(
                'Bài tập',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
            ),

            isLoading
              ? Center(child: CircularProgressIndicator())
              : ListView.builder(
                  shrinkWrap: true,
                  physics: NeverScrollableScrollPhysics(),
                  itemCount: exercises.length,
                  itemBuilder: (context, index) {
                    return ExerciseCard(
                      exercise: exercises[index],
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => ExerciseScreen(exercise: exercises[index]),
                        ),
                      ),
                    );
                  },
                ),
          ],
        ),
      ),
    );
  }
}
```

#### 3. Màn Hình Bài Tập (ExerciseScreen)

```dart
class ExerciseScreen extends StatefulWidget {
  final Exercise exercise;

  const ExerciseScreen({Key? key, required this.exercise}) : super(key: key);

  @override
  _ExerciseScreenState createState() => _ExerciseScreenState();
}

class _ExerciseScreenState extends State<ExerciseScreen> {
  List<Question> questions = [];
  bool isLoading = false;
  bool isStarted = false;

  @override
  void initState() {
    super.initState();
    _fetchQuestions();
  }

  Future<void> _fetchQuestions() async {
    setState(() => isLoading = true);
    try {
      // Gọi API lấy danh sách câu hỏi của bài tập
      final fetchedQuestions = await ApiService().getQuestionsByExerciseId(widget.exercise.id);
      setState(() => questions = fetchedQuestions);
    } catch (e) {
      // Xử lý lỗi
    } finally {
      setState(() => isLoading = false);
    }
  }

  void _startExercise() {
    setState(() => isStarted = true);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.exercise.title)),
      body: isLoading
        ? Center(child: CircularProgressIndicator())
        : !isStarted
          ? ExerciseIntroView(
              exercise: widget.exercise,
              onStart: _startExercise,
            )
          : QuestionListScreen(questions: questions),
    );
  }
}
```

#### 4. Màn Hình Câu Hỏi (QuestionListScreen)

```dart
class QuestionListScreen extends StatefulWidget {
  final List<Question> questions;

  const QuestionListScreen({Key? key, required this.questions}) : super(key: key);

  @override
  _QuestionListScreenState createState() => _QuestionListScreenState();
}

class _QuestionListScreenState extends State<QuestionListScreen> {
  final PageController _pageController = PageController();
  final Map<int, Answer> _selectedAnswers = {};
  int _currentQuestionIndex = 0;
  bool _showResults = false;

  void _onAnswerSelected(int questionIndex, Answer answer) {
    setState(() {
      _selectedAnswers[questionIndex] = answer;
    });
  }

  void _submitExercise() {
    setState(() => _showResults = true);
    // Gửi kết quả lên server
    _saveExerciseResult();
  }

  Future<void> _saveExerciseResult() async {
    // Tính điểm và gửi kết quả
    int correctAnswers = _selectedAnswers.values.where((answer) => answer.isCorrect).length;
    try {
      await ApiService().submitExerciseResult(
        exerciseId: widget.questions.first.exercise.id,
        score: correctAnswers,
        totalQuestions: widget.questions.length,
        answers: _selectedAnswers,
      );
    } catch (e) {
      // Xử lý lỗi
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Câu hỏi ${_currentQuestionIndex + 1}/${widget.questions.length}'),
        actions: [
          if (!_showResults)
            TextButton(
              onPressed: _submitExercise,
              child: Text('Nộp bài', style: TextStyle(color: Colors.white)),
            ),
        ],
      ),
      body: Column(
        children: [
          // Thanh tiến trình
          LinearProgressIndicator(
            value: (_currentQuestionIndex + 1) / widget.questions.length,
            backgroundColor: Colors.grey[300],
            valueColor: AlwaysStoppedAnimation<Color>(Colors.blue),
          ),

          // Danh sách câu hỏi
          Expanded(
            child: PageView.builder(
              controller: _pageController,
              itemCount: widget.questions.length,
              onPageChanged: (index) {
                setState(() => _currentQuestionIndex = index);
              },
              itemBuilder: (context, index) {
                return QuestionWidget(
                  question: widget.questions[index],
                  onAnswerSelected: (answer) => _onAnswerSelected(index, answer),
                  showResult: _showResults,
                  selectedAnswer: _selectedAnswers[index],
                );
              },
            ),
          ),

          // Nút điều hướng
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                if (_currentQuestionIndex > 0)
                  ElevatedButton(
                    onPressed: () {
                      _pageController.previousPage(
                        duration: Duration(milliseconds: 300),
                        curve: Curves.easeInOut,
                      );
                    },
                    child: Text('Câu trước'),
                  )
                else
                  SizedBox(width: 100),

                if (_currentQuestionIndex < widget.questions.length - 1)
                  ElevatedButton(
                    onPressed: () {
                      _pageController.nextPage(
                        duration: Duration(milliseconds: 300),
                        curve: Curves.easeInOut,
                      );
                    },
                    child: Text('Câu tiếp'),
                  )
                else
                  ElevatedButton(
                    onPressed: _showResults ? () {
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(
                          builder: (context) => ResultScreen(
                            selectedAnswers: _selectedAnswers,
                            questions: widget.questions,
                          ),
                        ),
                      );
                    } : _submitExercise,
                    child: Text(_showResults ? 'Xem kết quả' : 'Nộp bài'),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
```

### Các Widget Tái Sử Dụng

#### 1. LessonCard

```dart
class LessonCard extends StatelessWidget {
  final Lesson lesson;
  final VoidCallback onTap;

  const LessonCard({
    Key? key,
    required this.lesson,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      elevation: 3,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hình ảnh bài học
            if (lesson.imageUrl != null)
              ClipRRect(
                borderRadius: BorderRadius.vertical(top: Radius.circular(12)),
                child: Image.network(
                  lesson.imageUrl!,
                  height: 150,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(
                    height: 150,
                    color: Colors.grey[300],
                    child: Icon(Icons.image, size: 50, color: Colors.grey[500]),
                  ),
                ),
              ),

            Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Cấp độ và trạng thái premium
                  Row(
                    children: [
                      Container(
                        padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.blue[100],
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Text(
                          lesson.level,
                          style: TextStyle(
                            color: Colors.blue[800],
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                        ),
                      ),
                      SizedBox(width: 8),
                      if (lesson.isPremium)
                        Container(
                          padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.amber[100],
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Row(
                            children: [
                              Icon(Icons.star, size: 12, color: Colors.amber[800]),
                              SizedBox(width: 4),
                              Text(
                                'Premium',
                                style: TextStyle(
                                  color: Colors.amber[800],
                                  fontWeight: FontWeight.bold,
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                        ),
                    ],
                  ),
                  SizedBox(height: 8),

                  // Tiêu đề bài học
                  Text(
                    lesson.title,
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 4),

                  // Mô tả ngắn
                  Text(
                    lesson.description,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[700],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

### Tổ Chức State Management

Ứng dụng sử dụng Provider để quản lý trạng thái:

```dart
class LessonProvider extends ChangeNotifier {
  List<Lesson> _lessons = [];
  bool _isLoading = false;

  List<Lesson> get lessons => _lessons;
  bool get isLoading => _isLoading;

  Future<void> fetchLessons() async {
    _isLoading = true;
    notifyListeners();

    try {
      final fetchedLessons = await ApiService().getLessons();
      _lessons = fetchedLessons;
    } catch (e) {
      // Xử lý lỗi
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Các phương thức khác để quản lý lessons
}

class ExerciseProvider extends ChangeNotifier {
  Map<int, List<Exercise>> _exercisesByLesson = {};
  int? _currentLessonId;
  bool _isLoading = false;

  List<Exercise> get exercises =>
    _currentLessonId != null ? _exercisesByLesson[_currentLessonId] ?? [] : [];
  bool get isLoading => _isLoading;

  Future<void> fetchExercisesByLessonId(int lessonId) async {
    _currentLessonId = lessonId;

    if (_exercisesByLesson.containsKey(lessonId)) {
      notifyListeners();
      return;
    }

    _isLoading = true;
    notifyListeners();

    try {
      final fetchedExercises = await ApiService().getExercisesByLessonId(lessonId);
      _exercisesByLesson[lessonId] = fetchedExercises;
    } catch (e) {
      // Xử lý lỗi
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Các phương thức khác để quản lý exercises
}
```

### Mô Hình Điều Hướng Màn Hình

Luồng điều hướng giữa các màn hình được cấu trúc như sau:

```
DashboardScreen
    ├── LessonListScreen
    │       └── LessonDetailScreen
    │               └── ExerciseScreen
    │                       └── QuestionListScreen
    │                               └── ResultScreen
    ├── FlashcardScreen
    │       └── FlashcardDetailScreen
    └── ProfileScreen
            └── UserProgressScreen
```
