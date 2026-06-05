import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../providers/reimbursements_provider.dart';

class ReimbursementHistoryPage extends ConsumerWidget {
  const ReimbursementHistoryPage({super.key});

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
      case 'pending':
        return AppColors.warning;
      case 'processing':
        return AppColors.primaryLight;
      case 'paid':
        return AppColors.success;
      case 'failed':
        return AppColors.error;
      default:
        return AppColors.textSecondaryLight;
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(reimbursementsNotifierProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Reimbursement Payouts'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: () {
              ref.read(reimbursementsNotifierProvider.notifier).loadReimbursements();
            },
          ),
        ],
      ),
      body: Builder(
        builder: (context) {
          if (state.isLoading && state.reimbursements.isEmpty) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }

          if (state.errorMessage != null && state.reimbursements.isEmpty) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.error_outline_rounded, size: 64, color: AppColors.error),
                    const SizedBox(height: 16),
                    Text(
                      'Failed to load history',
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
                        ref.read(reimbursementsNotifierProvider.notifier).loadReimbursements();
                      },
                      icon: const Icon(Icons.replay_rounded),
                      label: const Text('Try Again'),
                    ),
                  ],
                ),
              ),
            );
          }

          if (state.reimbursements.isEmpty) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(32.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: AppColors.success.withValues(alpha: 0.08),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.payments_rounded,
                        size: 72,
                        color: AppColors.success,
                      ),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'No payouts tracked',
                      style: AppTypography.h3(isDark ? Colors.white : AppColors.textPrimaryLight),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Once expense claims are approved by Finance, reimbursement payout timelines will appear here.',
                      textAlign: TextAlign.center,
                      style: AppTypography.bodyMedium(
                        isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                      ),
                    ),
                  ],
                ),
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: () async {
              await ref.read(reimbursementsNotifierProvider.notifier).loadReimbursements();
            },
            child: ListView.builder(
              padding: const EdgeInsets.all(20.0),
              itemCount: state.reimbursements.length,
              itemBuilder: (context, index) {
                final payout = state.reimbursements[index];
                final statusColor = _getStatusColor(payout.status);
                final claim = payout.claim;

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
                              'Payout ID: ${payout.id.substring(0, 8)}',
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
                                payout.status.toUpperCase(),
                                style: AppTypography.bodySmall(statusColor).copyWith(
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              claim?.travelRequest?.title ?? 'General Expenses Claim',
                              style: AppTypography.subtitle(
                                isDark ? Colors.white : AppColors.textPrimaryLight,
                              ).copyWith(fontWeight: FontWeight.bold),
                            ),
                            Text(
                              claim != null ? _formatCurrency(claim.claimAmount) : '₹0',
                              style: AppTypography.subtitle(AppColors.success).copyWith(
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Associated Claim ID: ${payout.claimId.substring(0, 8)}',
                          style: AppTypography.bodySmall(
                            isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                          ),
                        ),
                        const Divider(height: 20),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Payment Method:',
                              style: AppTypography.bodySmall(
                                isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                              ),
                            ),
                            Text(
                              'Direct Bank Transfer',
                              style: AppTypography.bodySmall(
                                isDark ? Colors.white : AppColors.textPrimaryLight,
                              ).copyWith(fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Reference:',
                              style: AppTypography.bodySmall(
                                isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                              ),
                            ),
                            Text(
                              payout.paymentReference ?? 'N/A (Processing)',
                              style: AppTypography.bodySmall(
                                payout.paymentReference != null
                                    ? AppColors.primary
                                    : (isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight),
                              ).copyWith(fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              payout.status.toLowerCase() == 'paid' ? 'Paid At:' : 'Created At:',
                              style: AppTypography.bodySmall(
                                isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                              ),
                            ),
                            Text(
                              payout.paidAt != null
                                  ? _formatDate(payout.paidAt!)
                                  : _formatDate(payout.createdAt),
                              style: AppTypography.bodySmall(
                                isDark ? Colors.white : AppColors.textPrimaryLight,
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
    );
  }
}
