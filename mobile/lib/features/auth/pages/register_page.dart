import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:toeic_mobile/core/services/auth_service.dart';

class RegisterPage extends ConsumerStatefulWidget {
  const RegisterPage({super.key});

  @override
  ConsumerState<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends ConsumerState<RegisterPage>
    with TickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _usernameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _phoneController = TextEditingController();

  bool _isLoading = false;
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;
  String _selectedGender = '';

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
    _firstNameController.dispose();
    _lastNameController.dispose();
    _usernameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _phoneController.dispose();
    _logoAnimationController.dispose();
    _formAnimationController.dispose();
    super.dispose();
  }

  Future<void> _handleRegister() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final result = await AuthService.instance.register(
        username: _usernameController.text.trim(),
        email: _emailController.text.trim(),
        password: _passwordController.text,
        fullName:
            '${_firstNameController.text.trim()} ${_lastNameController.text.trim()}',
        firstName: _firstNameController.text.trim(),
        lastName: _lastNameController.text.trim(),
        gender: _selectedGender.isNotEmpty ? _selectedGender : null,
        phoneNumber: _phoneController.text.trim().isNotEmpty
            ? _phoneController.text.trim()
            : null,
      );

      if (result.success) {
        if (mounted) {
          _showSuccessSnackBar('Registration successful! Please login.');
          Future.delayed(const Duration(seconds: 2), () {
            if (mounted) {
              context.go('/login');
            }
          });
        }
      } else {
        if (mounted) {
          _showErrorSnackBar(result.error ?? 'Registration failed');
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

  void _showSuccessSnackBar(String message) {
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
                Icons.check_circle_outline,
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
        backgroundColor: const Color(0xFF10B981),
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
                const SizedBox(height: 20),

                // Animated Logo Section
                _buildAnimatedLogoSection(),

                const SizedBox(height: 30),

                // Animated Registration Form Card
                _buildAnimatedRegisterCard(),
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
                  height: 100,
                  width: 100,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(25),
                    border: Border.all(
                      color: Colors.white.withOpacity(0.3),
                      width: 2,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        blurRadius: 25,
                        offset: const Offset(0, 12),
                        spreadRadius: 3,
                      ),
                    ],
                  ),
                  child: const Icon(
                    Icons.person_add,
                    size: 50,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 20),
                const Text(
                  'Join LeEnglish',
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    letterSpacing: -0.5,
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Create your account to start learning',
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

  Widget _buildAnimatedRegisterCard() {
    return AnimatedBuilder(
      animation: _formAnimationController,
      builder: (context, child) {
        return SlideTransition(
          position: _formSlideAnimation,
          child: FadeTransition(
            opacity: _formOpacityAnimation,
            child: Container(
              padding: const EdgeInsets.all(28),
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
                          'Create Account ',
                          style: TextStyle(
                            fontSize: 26,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF1A202C),
                            letterSpacing: -0.5,
                          ),
                        ),
                        const Text(
                          '✨',
                          style: TextStyle(fontSize: 26),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Fill in your details to get started',
                      style: TextStyle(
                        fontSize: 16,
                        color: Color(0xFF718096),
                        fontWeight: FontWeight.w400,
                      ),
                    ),
                    const SizedBox(height: 28),

                    // Name fields
                    Row(
                      children: [
                        Expanded(
                          child: _buildEnhancedTextField(
                            controller: _firstNameController,
                            label: 'First Name',
                            hint: 'Enter first name',
                            prefixIcon: Icons.person_outline,
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'Please enter your first name';
                              }
                              return null;
                            },
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: _buildEnhancedTextField(
                            controller: _lastNameController,
                            label: 'Last Name',
                            hint: 'Enter last name',
                            prefixIcon: Icons.person_outline,
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'Please enter your last name';
                              }
                              return null;
                            },
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),

                    // Username field
                    _buildEnhancedTextField(
                      controller: _usernameController,
                      label: 'Username',
                      hint: 'Choose a username',
                      prefixIcon: Icons.account_circle_outlined,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter a username';
                        }
                        if (value.length < 3) {
                          return 'Username must be at least 3 characters';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 20),

                    // Email field
                    _buildEnhancedTextField(
                      controller: _emailController,
                      label: 'Email',
                      hint: 'Enter your email address',
                      prefixIcon: Icons.email_outlined,
                      keyboardType: TextInputType.emailAddress,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter your email';
                        }
                        if (!value.contains('@') || !value.contains('.')) {
                          return 'Please enter a valid email';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 20),

                    // Password field
                    _buildEnhancedTextField(
                      controller: _passwordController,
                      label: 'Password',
                      hint: 'Create a password',
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
                          return 'Please enter a password';
                        }
                        if (value.length < 6) {
                          return 'Password must be at least 6 characters';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 20),

                    // Confirm Password field
                    _buildEnhancedTextField(
                      controller: _confirmPasswordController,
                      label: 'Confirm Password',
                      hint: 'Confirm your password',
                      prefixIcon: Icons.lock_outline,
                      obscureText: _obscureConfirmPassword,
                      suffixIcon: IconButton(
                        icon: Icon(
                          _obscureConfirmPassword ? Icons.visibility_off : Icons.visibility,
                          color: Colors.grey[600],
                        ),
                        onPressed: () {
                          setState(() => _obscureConfirmPassword = !_obscureConfirmPassword);
                        },
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please confirm your password';
                        }
                        if (value != _passwordController.text) {
                          return 'Passwords do not match';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 20),

                    // Gender Selection
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Gender (Optional)',
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF1A202C),
                            letterSpacing: 0.2,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF8FAFC),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: const Color(0xFFE5E7EB)),
                          ),
                          child: Row(
                            children: [
                              Expanded(
                                child: _buildGenderOption('MALE', 'Male', Icons.male),
                              ),
                              Expanded(
                                child: _buildGenderOption('FEMALE', 'Female', Icons.female),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),

                    // Phone field
                    _buildEnhancedTextField(
                      controller: _phoneController,
                      label: 'Phone Number (Optional)',
                      hint: 'Enter your phone number',
                      prefixIcon: Icons.phone_outlined,
                      keyboardType: TextInputType.phone,
                    ),
                    const SizedBox(height: 32),

                    // Create Account Button
                    _buildCreateAccountButton(),

                    const SizedBox(height: 24),

                    // Sign In Link
                    _buildSignInLink(),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildGenderOption(String value, String label, IconData icon) {
    final isSelected = _selectedGender == value;
    return GestureDetector(
      onTap: () {
        setState(() => _selectedGender = value);
      },
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF667eea).withOpacity(0.1) : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? const Color(0xFF667eea) : Colors.transparent,
            width: 2,
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 20,
              color: isSelected ? const Color(0xFF667eea) : Colors.grey[600],
            ),
            const SizedBox(width: 8),
            Text(
              label,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: isSelected ? const Color(0xFF667eea) : Colors.grey[700],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEnhancedTextField({
    required TextEditingController controller,
    required String label,
    required String hint,
    required IconData prefixIcon,
    bool obscureText = false,
    Widget? suffixIcon,
    TextInputType? keyboardType,
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
            keyboardType: keyboardType,
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

  Widget _buildCreateAccountButton() {
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
        onPressed: _isLoading ? null : _handleRegister,
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
                'Create Account',
                style: TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.5,
                ),
              ),
      ),
    );
  }

  Widget _buildSignInLink() {
    return Center(
      child: TextButton(
        onPressed: () => context.go('/login'),
        child: RichText(
          text: const TextSpan(
            text: "Already have an account? ",
            style: TextStyle(
              color: Color(0xFF718096),
              fontSize: 14,
              fontWeight: FontWeight.w400,
            ),
            children: [
              TextSpan(
                text: 'Sign in',
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
