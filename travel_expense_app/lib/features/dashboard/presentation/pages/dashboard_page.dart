import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../auth/presentation/providers/auth_provider.dart';

class DashboardPage extends ConsumerWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authNotifierProvider);
    final user = authState.user;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    if (user == null) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Enterprise Portal'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout_rounded),
            onPressed: () {
              ref.read(authNotifierProvider.notifier).logout();
            },
            tooltip: 'Sign Out',
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // User Header Profile Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                gradient: const LinearGradient(
                  colors: [
                    AppColors.primary,
                    AppColors.secondary,
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.primary.withValues(alpha: 0.2),
                    blurRadius: 16,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 36,
                    backgroundColor: Colors.white,
                    child: ClipOval(
                      child: Image.network(
                        user.avatarUrl ?? 'https://api.dicebear.com/7.x/adventurer/svg?seed=avatar',
                        width: 72,
                        height: 72,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) => const Icon(
                          Icons.person,
                          size: 36,
                          color: AppColors.primary,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 20),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Welcome back,',
                          style: AppTypography.bodySmall(Colors.white.withValues(alpha: 0.8)),
                        ),
                        Text(
                          user.name,
                          style: AppTypography.h2(Colors.white),
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 10,
                                vertical: 4,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.white.withValues(alpha: 0.2),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Text(
                                user.role,
                                style: AppTypography.caption(Colors.white),
                              ),
                            ),
                            if (user.department != null) ...[
                              const SizedBox(width: 8),
                              Text(
                                user.department!,
                                style: AppTypography.bodySmall(Colors.white.withValues(alpha: 0.9)),
                              ),
                            ],
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // Modules Status / Quick Actions
            Text(
              'Workspace Actions',
              style: AppTypography.subtitle(
                isDark ? Colors.white : AppColors.textPrimaryLight,
              ),
            ),
            const SizedBox(height: 16),
            
            // Grid of Modules
            GridView.count(
              crossAxisCount: MediaQuery.of(context).size.width > 600 ? 3 : 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
              children: [
                _buildActionCard(
                  context,
                  title: 'Travel Request',
                  subtitle: 'Submit & Track Requests',
                  icon: Icons.flight_takeoff_rounded,
                  color: AppColors.primary,
                ),
                _buildActionCard(
                  context,
                  title: 'Expense Claim',
                  subtitle: 'Itemize & File Receipts',
                  icon: Icons.receipt_long_rounded,
                  color: AppColors.secondary,
                ),
                _buildActionCard(
                  context,
                  title: 'Reimbursement',
                  subtitle: 'Check Payment Status',
                  icon: Icons.payments_rounded,
                  color: AppColors.success,
                ),
                if (user.role == 'Manager' || user.role == 'Admin' || user.role.contains('Executive')) ...[
                  _buildActionCard(
                    context,
                    title: 'Approvals Queue',
                    subtitle: 'Review Pending Requests',
                    icon: Icons.fact_check_rounded,
                    color: AppColors.warning,
                  ),
                ],
                _buildActionCard(
                  context,
                  title: 'Compliance Policy',
                  subtitle: 'Check Company Policies',
                  icon: Icons.gavel_rounded,
                  color: AppColors.accent,
                ),
                _buildActionCard(
                  context,
                  title: 'Audit Trails',
                  subtitle: 'View Activity logs',
                  icon: Icons.history_edu_rounded,
                  color: Colors.blueGrey,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionCard(
    BuildContext context, {
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
  }) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Card(
      child: InkWell(
        onTap: () {
          if (title == 'Travel Request') {
            context.push('/travel-requests');
          } else if (title == 'Expense Claim') {
            context.push('/expenses');
          } else if (title == 'Reimbursement') {
            context.push('/reimbursements');
          } else if (title == 'Approvals Queue') {
            context.push('/approvals');
          } else {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('$title module integration coming soon!'),
                behavior: SnackBarBehavior.floating,
              ),
            );
          }
        },
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, size: 28, color: color),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: AppTypography.subtitle(
                      isDark ? Colors.white : AppColors.textPrimaryLight,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: AppTypography.bodySmall(
                      isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
