import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../providers/auth_provider.dart';
import '../widgets/sso_button_widget.dart';

class LoginPage extends ConsumerStatefulWidget {
  const LoginPage({super.key});

  @override
  ConsumerState<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends ConsumerState<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _loginWithToken(String token) {
    ref.read(authNotifierProvider.notifier).login(token);
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authNotifierProvider);
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    // Listen to login error messages
    ref.listen(authNotifierProvider, (previous, next) {
      if (next.errorMessage != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(next.errorMessage!),
            backgroundColor: AppColors.error,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    });

    return Scaffold(
      body: Stack(
        children: [
          // Background Gradient Blob
          Positioned(
            top: -100,
            right: -100,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppColors.primary.withValues(alpha: 0.15),
              ),
            ),
          ),
          Positioned(
            bottom: -50,
            left: -50,
            child: Container(
              width: 250,
              height: 250,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppColors.secondary.withValues(alpha: 0.15),
              ),
            ),
          ),
          
          // Main Scrollable Content
          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24.0),
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 450),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // App Logo & Header
                      Center(
                        child: Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: AppColors.primary.withValues(alpha: 0.1),
                          ),
                          child: Icon(
                            Icons.flight_takeoff_rounded,
                            size: 48,
                            color: isDark ? AppColors.primaryLight : AppColors.primary,
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),
                      Text(
                        'Enterprise Travel',
                        textAlign: TextAlign.center,
                        style: AppTypography.h1(isDark ? Colors.white : AppColors.textPrimaryLight),
                      ),
                      Text(
                        '& Expense Manager',
                        textAlign: TextAlign.center,
                        style: AppTypography.h2(AppColors.secondary),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Sign in using your corporate credentials or single sign-on.',
                        textAlign: TextAlign.center,
                        style: AppTypography.bodyMedium(
                          isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                        ),
                      ),
                      const SizedBox(height: 32),

                      // Credentials Form Card
                      Card(
                        child: Padding(
                          padding: const EdgeInsets.all(24.0),
                          child: Form(
                            key: _formKey,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.stretch,
                              children: [
                                Text(
                                  'SSO Single Sign-On',
                                  style: AppTypography.subtitle(
                                    isDark ? Colors.white : AppColors.textPrimaryLight,
                                  ),
                                ),
                                const SizedBox(height: 16),
                                SsoButtonWidget(
                                  label: 'Sign in with Okta',
                                  icon: Icons.security,
                                  isLoading: authState.isLoading,
                                  onPressed: () => _loginWithToken('sso_employee_token'),
                                ),
                                const SizedBox(height: 12),
                                SsoButtonWidget(
                                  label: 'Sign in with Azure AD',
                                  icon: Icons.cloud_queue_sharp,
                                  isLoading: authState.isLoading,
                                  onPressed: () => _loginWithToken('sso_employee_token'),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      
                      const SizedBox(height: 24),
                      
                      // Role Sandbox Section for testing
                      Text(
                        'DEVELOPER SANDBOX',
                        textAlign: TextAlign.center,
                        style: AppTypography.caption(
                          isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                        ).copyWith(letterSpacing: 1.5),
                      ),
                      const SizedBox(height: 12),
                      Wrap(
                        alignment: WrapAlignment.center,
                        spacing: 8,
                        runSpacing: 8,
                        children: [
                          _buildSandboxChip(
                            label: 'Employee',
                            onTap: () => _loginWithToken('sso_employee_token'),
                            icon: Icons.person_outline,
                          ),
                          _buildSandboxChip(
                            label: 'Manager',
                            onTap: () => _loginWithToken('sso_manager_token'),
                            icon: Icons.supervisor_account,
                          ),
                          _buildSandboxChip(
                            label: 'Finance',
                            onTap: () => _loginWithToken('sso_finance_token'),
                            icon: Icons.account_balance,
                          ),
                          _buildSandboxChip(
                            label: 'Compliance',
                            onTap: () => _loginWithToken('sso_compliance_token'),
                            icon: Icons.verified_user_outlined,
                          ),
                          _buildSandboxChip(
                            label: 'Admin',
                            onTap: () => _loginWithToken('sso_admin_token'),
                            icon: Icons.admin_panel_settings_outlined,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSandboxChip({
    required String label,
    required VoidCallback onTap,
    required IconData icon,
  }) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return ActionChip(
      onPressed: onTap,
      avatar: Icon(icon, size: 16, color: AppColors.primary),
      label: Text(label),
      labelStyle: AppTypography.bodySmall(isDark ? Colors.white : AppColors.textPrimaryLight),
      backgroundColor: isDark ? AppColors.surfaceDark : Colors.white,
      side: BorderSide(
        color: isDark ? AppColors.borderDark : AppColors.borderLight,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
    );
  }
}
