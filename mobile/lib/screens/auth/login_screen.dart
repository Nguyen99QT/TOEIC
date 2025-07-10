import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../providers/auth_provider.dart';
import '../../themes/app_theme.dart';
import '../../widgets/buttons/app_buttons.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;
  bool _rememberMe = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleLogin() async {
    if (_formKey.currentState!.validate()) {
      await ref
          .read(authProvider.notifier)
          .login(_emailController.text, _passwordController.text);

      // Check if login was successful and navigate to home
      final authState = ref.read(authProvider);
      if (authState.isAuthenticated && mounted) {
        context.go('/home');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final screenSize = MediaQuery.of(context).size;
    final isLargeScreen = screenSize.width > 600;
    final isTablet = screenSize.width > 900;

    return Scaffold(
      backgroundColor: AppColors.backgroundColor,
      body: Center(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Form(
              key: _formKey,
              child: ConstrainedBox(
                constraints: BoxConstraints(
                  maxWidth:
                      isTablet ? 800 : (isLargeScreen ? 500 : double.infinity),
                ),
                child: Card(
                  elevation: 4,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(AppRadius.lg),
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(AppSpacing.lg),
                        decoration: const BoxDecoration(
                          color: AppColors.primaryBlue,
                          borderRadius: BorderRadius.only(
                            topLeft: Radius.circular(AppRadius.lg),
                            topRight: Radius.circular(AppRadius.lg),
                          ),
                        ),
                        child: Column(
                          children: [
                            // Logo
                            Image.asset(
                              'assets/images/logo.png',
                              height: 80,
                              errorBuilder:
                                  (context, error, stackTrace) => Icon(
                                    Icons.language,
                                    size: 80,
                                    color: Colors.white,
                                  ),
                            ),
                            const SizedBox(height: AppSpacing.md),
                            Text(
                              'TOEIC Learning Platform',
                              style: AppTextStyles.h2.copyWith(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                              ),
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: AppSpacing.sm),
                            Text(
                              'Sign in to continue',
                              style: AppTextStyles.bodyMedium.copyWith(
                                color: Colors.white.withValues(alpha: 0.9),
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ],
                        ),
                      ),
                      Padding(
                        padding: EdgeInsets.all(
                          isLargeScreen ? AppSpacing.xl : AppSpacing.lg,
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            if (authState.error != null)
                              Container(
                                padding: const EdgeInsets.all(AppSpacing.md),
                                decoration: BoxDecoration(
                                  color: AppColors.errorColor.withValues(
                                    alpha: 0.1,
                                  ),
                                  borderRadius: BorderRadius.circular(
                                    AppRadius.md,
                                  ),
                                  border: Border.all(
                                    color: AppColors.errorColor,
                                  ),
                                ),
                                child: Text(
                                  authState.error!,
                                  style: const TextStyle(
                                    color: AppColors.errorColor,
                                  ),
                                ),
                              ),
                            if (authState.error != null)
                              const SizedBox(height: AppSpacing.md),

                            // Email Field
                            TextFormField(
                              controller: _emailController,
                              decoration: InputDecoration(
                                labelText: 'Email',
                                hintText: 'Enter your email',
                                prefixIcon: const Icon(Icons.email_outlined),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(
                                    AppRadius.md,
                                  ),
                                ),
                                contentPadding: const EdgeInsets.symmetric(
                                  horizontal: AppSpacing.md,
                                  vertical: AppSpacing.md,
                                ),
                              ),
                              keyboardType: TextInputType.emailAddress,
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Please enter your email';
                                }
                                if (!RegExp(
                                  r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$',
                                ).hasMatch(value)) {
                                  return 'Please enter a valid email';
                                }
                                return null;
                              },
                            ),
                            const SizedBox(height: AppSpacing.lg),

                            // Password Field
                            TextFormField(
                              controller: _passwordController,
                              obscureText: _obscurePassword,
                              decoration: InputDecoration(
                                labelText: 'Password',
                                hintText: 'Enter your password',
                                prefixIcon: const Icon(Icons.lock_outline),
                                suffixIcon: IconButton(
                                  icon: Icon(
                                    _obscurePassword
                                        ? Icons.visibility_off
                                        : Icons.visibility,
                                  ),
                                  onPressed: () {
                                    setState(() {
                                      _obscurePassword = !_obscurePassword;
                                    });
                                  },
                                ),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(
                                    AppRadius.md,
                                  ),
                                ),
                                contentPadding: const EdgeInsets.symmetric(
                                  horizontal: AppSpacing.md,
                                  vertical: AppSpacing.md,
                                ),
                              ),
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Please enter your password';
                                }
                                if (value.length < 6) {
                                  return 'Password must be at least 6 characters';
                                }
                                return null;
                              },
                            ),
                            const SizedBox(height: AppSpacing.md),

                            // Remember Me & Forgot Password
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    Checkbox(
                                      value: _rememberMe,
                                      onChanged: (value) {
                                        setState(() {
                                          _rememberMe = value ?? false;
                                        });
                                      },
                                    ),
                                    const Text('Remember me'),
                                  ],
                                ),
                                TextButton(
                                  onPressed: () {
                                    // TODO: Implement forgot password
                                  },
                                  child: const Text('Forgot Password?'),
                                ),
                              ],
                            ),
                            const SizedBox(height: AppSpacing.xl),

                            // Login Button
                            AppButton(
                              text: 'Login',
                              isLoading: authState.isLoading,
                              variant: AppButtonVariant.primary,
                              size: ButtonSize.large,
                              fullWidth: true,
                              onPressed: _handleLogin,
                            ),
                            const SizedBox(height: AppSpacing.lg),

                            // Divider
                            const Row(
                              children: [
                                Expanded(child: Divider()),
                                Padding(
                                  padding: EdgeInsets.symmetric(
                                    horizontal: AppSpacing.md,
                                  ),
                                  child: Text('OR'),
                                ),
                                Expanded(child: Divider()),
                              ],
                            ),
                            const SizedBox(height: AppSpacing.lg),

                            // Register Link
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Text("Don't have an account?"),
                                TextButton(
                                  onPressed: () {
                                    Navigator.pushNamed(context, '/register');
                                  },
                                  child: const Text('Register Now'),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
