import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../providers/finance_queue_provider.dart';

class FinanceReimbursementQueuePage extends ConsumerWidget {
  const FinanceReimbursementQueuePage({super.key});

  Future<void> _processPayout(BuildContext context, WidgetRef ref, String claimId) async {
    final paymentRef = 'FIN-PAY-${DateTime.now().millisecondsSinceEpoch}';
    final success = await ref.read(financeQueueNotifierProvider.notifier).processPayout(claimId, paymentRef);
    if (success) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Payout processed successfully!'), backgroundColor: AppColors.success),
        );
      }
    } else {
      if (context.mounted) {
        final error = ref.read(financeQueueNotifierProvider).errorMessage ?? 'Unknown error';
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Payout failed: $error'), backgroundColor: AppColors.error),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(financeQueueNotifierProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Finance Payout Queue'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: () => ref.read(financeQueueNotifierProvider.notifier).loadPendingReimbursements(),
          ),
        ],
      ),
      body: _buildBody(context, ref, state, isDark),
    );
  }

  Widget _buildBody(BuildContext context, WidgetRef ref, FinanceQueueState state, bool isDark) {
    if (state.isLoading && state.pendingClaims.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }

    if (state.errorMessage != null && state.pendingClaims.isEmpty) {
      return Center(
        child: Text('Error loading queue: ${state.errorMessage}', style: const TextStyle(color: AppColors.error)),
      );
    }

    final claims = state.pendingClaims;
    if (claims.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.check_circle_outline_rounded, size: 64, color: AppColors.success),
            const SizedBox(height: 16),
            Text('All caught up!', style: AppTypography.h3(isDark ? Colors.white : AppColors.textPrimaryLight)),
            const SizedBox(height: 8),
            Text('No pending approved claims for payout.', style: AppTypography.bodyMedium(Colors.grey)),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: claims.length,
      itemBuilder: (context, index) {
        final claim = claims[index];
        final amount = claim['claimAmount'] ?? 0;
        final userId = claim['userId'] ?? 'Unknown User';
        return Card(
          elevation: 4,
          margin: const EdgeInsets.only(bottom: 16),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Claim #${claim['id'].toString().substring(0, 8)}', style: AppTypography.h3(isDark ? Colors.white : AppColors.textPrimaryLight)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: AppColors.success.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text('₹$amount', style: AppTypography.subtitle(AppColors.success).copyWith(fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    const Icon(Icons.person, size: 16, color: Colors.grey),
                    const SizedBox(width: 8),
                    Text('User ID: $userId', style: AppTypography.bodyMedium(isDark ? Colors.white70 : Colors.black87)),
                  ],
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: state.isProcessing ? null : () => _processPayout(context, ref, claim['id'].toString()),
                    icon: state.isProcessing
                        ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                        : const Icon(Icons.payments_rounded),
                    label: Text(state.isProcessing ? 'Processing...' : 'Process Payout'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
