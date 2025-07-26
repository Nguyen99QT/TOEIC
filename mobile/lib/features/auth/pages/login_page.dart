import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:toeic_mobile/core/services/auth_service.dart';
import '../providers/auth_provider.dart';

class LoginPage extends ConsumerStatefulWidget {
  const LoginPage({super.key});

  @override
  ConsumerState<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends ConsumerState<LoginPage>
    with TickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  bool _obscurePassword = true;
  bool _rememberPassword = false;

  late AnimationController _logoAnimationController;
  late AnimationController _formAnimationController;
  late Animation<double> _logoScaleAnimation;
  late Animation<double> _logoOpacityAnimation;
  late Animation<Offset> _formSlideAnimation;
  late Animation<double> _formOpacityAnimation;

  @override
  void initState() {
    super.initState();
    _initializeAnimations();
    _startAnimations();
  }

  void _initializeAnimations() {
    _logoAnimationController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );

    _formAnimationController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    );

    _logoScaleAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _logoAnimationController,
      curve: Curves.elasticOut,
    ));

    _logoOpacityAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _logoAnimationController,
      curve: const Interval(0.0, 0.6, curve: Curves.easeInOut),
    ));

    _formSlideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.3),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _formAnimationController,
      curve: Curves.easeOutCubic,
    ));

    _formOpacityAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _formAnimationController,
      curve: const Interval(0.2, 1.0, curve: Curves.easeInOut),
    ));
  }

  void _startAnimations() {
    _logoAnimationController.forward();
    Future.delayed(const Duration(milliseconds: 300), () {
      _formAnimationController.forward();
    });
  }

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    _logoAnimationController.dispose();
    _formAnimationController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final success = await ref.read(authProvider.notifier).login(
        _usernameController.text.trim(),
        _passwordController.text,
      );

      if (success) {
        if (mounted) {
          context.go('/dashboard');
        }
      } else {
        if (mounted) {
          final error = ref.read(authProvider).error;
          _showErrorSnackBar(error ?? 'Login failed');
        }
      }
    } catch (e) {
      if (mounted) {
        _showErrorSnackBar('An error occurred: ${e.toString()}');
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  void _showErrorSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.2),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(
                Icons.error_outline,
                color: Colors.white,
                size: 20,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                message,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ],
        ),
        backgroundColor: const Color(0xFFEF4444),
        behavior: SnackBarBehavior.floating,
        margin: const EdgeInsets.all(16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        elevation: 8,
        duration: const Duration(seconds: 4),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              const Color(0xFF667eea),
              const Color(0xFF764ba2),
              const Color(0xFFf093fb),
            ],
            stops: const [0.0, 0.5, 1.0],
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 40),

                // Animated Logo Section
                _buildAnimatedLogoSection(),

                const SizedBox(height: 40),

                // Animated Login Form Card
                _buildAnimatedLoginCard(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildAnimatedLogoSection() {
    return AnimatedBuilder(
      animation: _logoAnimationController,
      builder: (context, child) {
        return Transform.scale(
          scale: _logoScaleAnimation.value,
          child: Opacity(
            opacity: _logoOpacityAnimation.value,
            child: Column(
              children: [
                // Enhanced Logo Container
                Container(
                  height: 120,
                  width: 120,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(30),
                    border: Border.all(
                      color: Colors.white.withOpacity(0.3),
                      width: 2,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        blurRadius: 30,
                        offset: const Offset(0, 15),
                        spreadRadius: 5,
                      ),
                    ],
                  ),
                  child: const Icon(
                    Icons.school,
                    size: 60,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 24),
                const Text(
                  'LeEnglish',
                  style: TextStyle(
                    fontSize: 36,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    letterSpacing: -0.5,
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'TOEIC Learning Platform',
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.white,
                    fontWeight: FontWeight.w300,
                    letterSpacing: 0.5,
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildAnimatedLoginCard() {
    return AnimatedBuilder(
      animation: _formAnimationController,
      builder: (context, child) {
        return SlideTransition(
          position: _formSlideAnimation,
          child: FadeTransition(
            opacity: _formOpacityAnimation,
            child: Container(
              padding: const EdgeInsets.all(32),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.15),
                    blurRadius: 40,
                    offset: const Offset(0, 20),
                    spreadRadius: 5,
                  ),
                ],
              ),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Welcome text with emoji
                    Row(
                      children: [
                        const Text(
                          'Welcome Back! ',
                          style: TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF1A202C),
                            letterSpacing: -0.5,
                          ),
                        ),
                        const Text(
                          '🚀',
                          style: TextStyle(fontSize: 28),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Sign in to continue your learning journey',
                      style: TextStyle(
                        fontSize: 16,
                        color: Color(0xFF718096),
                        fontWeight: FontWeight.w400,
                      ),
                    ),
                    const SizedBox(height: 32),

                    // Username field
                    _buildEnhancedTextField(
                      controller: _usernameController,
                      label: 'Username or Email',
                      hint: 'Enter your username or email',
                      prefixIcon: Icons.person_outline,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter your username or email';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 20),

                    // Password field
                    _buildEnhancedTextField(
                      controller: _passwordController,
                      label: 'Password',
                      hint: 'Enter your password',
                      prefixIcon: Icons.lock_outline,
                      obscureText: _obscurePassword,
                      suffixIcon: IconButton(
                        icon: Icon(
                          _obscurePassword ? Icons.visibility_off : Icons.visibility,
                          color: Colors.grey[600],
                        ),
                        onPressed: () {
                          setState(() => _obscurePassword = !_obscurePassword);
                        },
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter your password';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 20),

                    // Remember Password & Forgot Password
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Transform.scale(
                              scale: 0.9,
                              child: Checkbox(
                                value: _rememberPassword,
                                onChanged: (value) {
                                  setState(() => _rememberPassword = value ?? false);
                                },
                                activeColor: const Color(0xFF667eea),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(4),
                                ),
                              ),
                            ),
                            const Text(
                              'Remember me',
                              style: TextStyle(
                                fontSize: 14,
                                color: Color(0xFF4A5568),
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                        TextButton(
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Row(
                                  children: [
                                    const Icon(Icons.info_outline, color: Colors.white),
                                    const SizedBox(width: 8),
                                    const Text('Forgot password feature coming soon!'),
                                  ],
                                ),
                                backgroundColor: const Color(0xFF667eea),
                                behavior: SnackBarBehavior.floating,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                            );
                          },
                          child: const Text(
                            'Forgot password?',
                            style: TextStyle(
                              fontSize: 14,
                              color: Color(0xFF667eea),
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 32),

                    // Sign In Button
                    _buildSignInButton(),

                    const SizedBox(height: 24),

                    // Sign Up Link
                    _buildSignUpLink(),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildEnhancedTextField({
    required TextEditingController controller,
    required String label,
    required String hint,
    required IconData prefixIcon,
    bool obscureText = false,
    Widget? suffixIcon,
    String? Function(String?)? validator,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w600,
            color: Color(0xFF1A202C),
            letterSpacing: 0.2,
          ),
        ),
        const SizedBox(height: 10),
        Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.grey.withOpacity(0.08),
                blurRadius: 12,
                offset: const Offset(0, 4),
                spreadRadius: 2,
              ),
            ],
          ),
          child: TextFormField(
            controller: controller,
            obscureText: obscureText,
            validator: validator,
            style: const TextStyle(
              fontSize: 16,
              color: Color(0xFF2D3748),
              fontWeight: FontWeight.w500,
            ),
            decoration: InputDecoration(
              hintText: hint,
              hintStyle: const TextStyle(
                color: Color(0xFF9CA3AF),
                fontSize: 15,
                fontWeight: FontWeight.w400,
              ),
              prefixIcon: Container(
                margin: const EdgeInsets.all(12),
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: const Color(0xFF667eea).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(
                  prefixIcon,
                  color: const Color(0xFF667eea),
                  size: 20,
                ),
              ),
              suffixIcon: suffixIcon,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: BorderSide.none,
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: BorderSide.none,
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: const BorderSide(color: Color(0xFF667eea), width: 2),
              ),
              errorBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: const BorderSide(color: Color(0xFFEF4444), width: 2),
              ),
              focusedErrorBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: const BorderSide(color: Color(0xFFEF4444), width: 2),
              ),
              contentPadding: const EdgeInsets.symmetric(
                horizontal: 20,
                vertical: 20,
              ),
              filled: true,
              fillColor: const Color(0xFFF8FAFC),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSignInButton() {
    return Container(
      width: double.infinity,
      height: 56,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        gradient: const LinearGradient(
          colors: [Color(0xFF667eea), Color(0xFF764ba2)],
          begin: Alignment.centerLeft,
          end: Alignment.centerRight,
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF667eea).withOpacity(0.4),
            blurRadius: 20,
            offset: const Offset(0, 8),
            spreadRadius: 2,
          ),
        ],
      ),
      child: ElevatedButton(
        onPressed: _isLoading ? null : _handleLogin,
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.transparent,
          foregroundColor: Colors.white,
          shadowColor: Colors.transparent,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          elevation: 0,
        ),
        child: _isLoading
            ? const SizedBox(
                height: 24,
                width: 24,
                child: CircularProgressIndicator(
                  color: Colors.white,
                  strokeWidth: 2.5,
                ),
              )
            : const Text(
                'Sign In',
                style: TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.5,
                ),
              ),
      ),
    );
  }

  Widget _buildSignUpLink() {
    return Center(
      child: TextButton(
        onPressed: () => context.go('/register'),
        child: RichText(
          text: const TextSpan(
            text: "Don't have an account? ",
            style: TextStyle(
              color: Color(0xFF718096),
              fontSize: 14,
              fontWeight: FontWeight.w400,
            ),
            children: [
              TextSpan(
                text: 'Sign up',
                style: TextStyle(
                  color: Color(0xFF667eea),
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
