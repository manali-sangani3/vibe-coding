import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../providers/expenses_provider.dart';

class ExpenseListPage extends ConsumerWidget {
  const ExpenseListPage({super.key});

  String _formatDate(DateTime date) {
    final months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return '${date.day} ${months[date.month - 1]} ${date.year}';
  }

  String _formatCurrency(double amount) {
    return '₹${amount.toStringAsFixed(0).replaceAllMapped(
          RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
          (Match m) => '${m[1]},',
        )}';
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'draft':
        return AppColors.secondary;
      case 'submitted':
        return AppColors.warning;
      case 'approved':
        return AppColors.primary;
      case 'reimbursed':
        return AppColors.success;
      case 'rejected':
      case 'failed':
        return AppColors.error;
      default:
        return AppColors.textSecondaryLight;
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(expensesNotifierProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Expense Claims'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: () {
              ref.read(expensesNotifierProvider.notifier).loadExpenseClaims();
            },
          ),
        ],
      ),
      body: Builder(
        builder: (context) {
          if (state.isLoading && state.claims.isEmpty) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }

          if (state.errorMessage != null && state.claims.isEmpty) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.error_outline_rounded, size: 64, color: AppColors.error),
                    const SizedBox(height: 16),
                    Text(
                      'Failed to load expense claims',
                      style: AppTypography.h3(isDark ? Colors.white : AppColors.textPrimaryLight),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      state.errorMessage!,
                      textAlign: TextAlign.center,
                      style: AppTypography.bodyMedium(
                        isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                      ),
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton.icon(
                      onPressed: () {
                        ref.read(expensesNotifierProvider.notifier).loadExpenseClaims();
                      },
                      icon: const Icon(Icons.replay_rounded),
                      label: const Text('Try Again'),
                    ),
                  ],
                ),
              ),
            );
          }

          if (state.claims.isEmpty) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(32.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: AppColors.primary.withValues(alpha: 0.08),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.receipt_long_rounded,
                        size: 72,
                        color: AppColors.primary,
                      ),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'No expense claims yet',
                      style: AppTypography.h3(isDark ? Colors.white : AppColors.textPrimaryLight),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Submit digital expense logs, itemized receipts, and bills for finance review payouts.',
                      textAlign: TextAlign.center,
                      style: AppTypography.bodyMedium(
                        isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                      ),
                    ),
                    const SizedBox(height: 32),
                    ElevatedButton.icon(
                      onPressed: () => context.push('/expenses/new'),
                      icon: const Icon(Icons.add_rounded),
                      label: const Text('Create Expense Claim'),
                    ),
                  ],
                ),
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: () async {
              await ref.read(expensesNotifierProvider.notifier).loadExpenseClaims();
            },
            child: ListView.builder(
              padding: const EdgeInsets.all(20.0),
              itemCount: state.claims.length,
              itemBuilder: (context, index) {
                final claim = state.claims[index];
                final statusColor = _getStatusColor(claim.status);

                return Card(
                  margin: const EdgeInsets.only(bottom: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Claim ID: ${claim.id.substring(0, 8)}',
                              style: AppTypography.caption(
                                isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                              ).copyWith(fontWeight: FontWeight.bold),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: statusColor.withValues(alpha: 0.1),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                claim.status.toUpperCase(),
                                style: AppTypography.bodySmall(statusColor).copyWith(
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Text(
                          claim.travelRequest?.title ?? 'General Expenses (No Travel Request)',
                          style: AppTypography.subtitle(
                            isDark ? Colors.white : AppColors.textPrimaryLight,
                          ).copyWith(fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 6),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Submitted on:',
                              style: AppTypography.bodySmall(
                                isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                              ),
                            ),
                            Text(
                              claim.submittedAt != null
                                  ? _formatDate(claim.submittedAt!)
                                  : _formatDate(claim.createdAt),
                              style: AppTypography.bodySmall(
                                isDark ? Colors.white : AppColors.textPrimaryLight,
                              ),
                            ),
                          ],
                        ),
                        const Divider(height: 20),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              '${claim.items.length} ${claim.items.length == 1 ? 'item' : 'items'} itemized',
                              style: AppTypography.bodyMedium(
                                isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                              ),
                            ),
                            Text(
                              _formatCurrency(claim.claimAmount),
                              style: AppTypography.subtitle(AppColors.primary).copyWith(
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
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
      floatingActionButton: state.claims.isNotEmpty
          ? FloatingActionButton.extended(
              onPressed: () => context.push('/expenses/new'),
              icon: const Icon(Icons.add_rounded),
              label: const Text('New Claim'),
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
            )
          : null,
    );
  }
}
