import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/services/blog_service.dart';
import 'features/blogs/pages/blogs_page.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => BlogService()),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Blogs',
      home: BlogsPage(),
    );
  }
}
