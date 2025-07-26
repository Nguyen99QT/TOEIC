import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/services/blog_service.dart';
import 'blog_detail_page.dart';

class BlogsPage extends StatefulWidget {
  const BlogsPage({Key? key}) : super(key: key);

  @override
  State<BlogsPage> createState() => _BlogsPageState();
}

class _BlogsPageState extends State<BlogsPage> {
  @override
  void initState() {
    super.initState();
    // Đảm bảo fetchPosts chỉ gọi sau khi widget đã build xong context
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final blogService = Provider.of<BlogService>(context, listen: false);
      if (blogService.posts.isEmpty) {
        blogService.fetchPosts();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Blogs'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              Provider.of<BlogService>(context, listen: false).fetchPosts();
            },
          ),
        ],
      ),
      body: Consumer<BlogService>(
        builder: (context, blogService, _) {
          if (blogService.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }
          if (blogService.error != null) {
            return Center(child: Text(blogService.error!));
          }
          if (blogService.posts.isEmpty) {
            return const Center(child: Text('Chưa có bài viết nào'));
          }
          return RefreshIndicator(
            onRefresh: () => blogService.fetchPosts(),
            child: ListView.builder(
              padding: const EdgeInsets.all(12),
              itemCount: blogService.posts.length,
              itemBuilder: (context, index) {
                final post = blogService.posts[index];
                return Card(
                  margin: const EdgeInsets.symmetric(vertical: 10),
                  elevation: 4,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: InkWell(
                    borderRadius: BorderRadius.circular(16),
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (context) =>
                              BlogDetailPage(blogId: post.id!.toString()),
                        ),
                      );
                    },
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        if (post.imageUrl != null && post.imageUrl!.isNotEmpty)
                          ClipRRect(
                            borderRadius: const BorderRadius.vertical(
                                top: Radius.circular(16)),
                            child: Image.network(
                              post.imageUrl!,
                              height: 180,
                              width: double.infinity,
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) =>
                                  Container(
                                height: 180,
                                color: Colors.grey[300],
                                child: const Center(
                                    child: Icon(Icons.broken_image, size: 48)),
                              ),
                            ),
                          ),
                        Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                post.title,
                                style: const TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                post.content,
                                maxLines: 3,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(
                                    fontSize: 15, color: Colors.black87),
                              ),
                              const SizedBox(height: 8),
                              Row(
                                children: [
                                  const Icon(Icons.person,
                                      size: 16, color: Colors.grey),
                                  const SizedBox(width: 4),
                                  Text(post.author,
                                      style: const TextStyle(
                                          fontSize: 13, color: Colors.grey)),
                                  const Spacer(),
                                  const Icon(Icons.calendar_today,
                                      size: 16, color: Colors.grey),
                                  const SizedBox(width: 4),
                                  Text(
                                    '${post.createdAt.day}/${post.createdAt.month}/${post.createdAt.year}',
                                    style: const TextStyle(
                                        fontSize: 13, color: Colors.grey),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          );
        },
      ),
    );
  }
}
