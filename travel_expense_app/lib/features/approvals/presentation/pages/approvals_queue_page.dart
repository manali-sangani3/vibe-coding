import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../auth/presentation/providers/auth_provider.dart';
import '../providers/approvals_provider.dart';
import '../providers/expense_approvals_provider.dart';

class ApprovalsQueuePage extends ConsumerStatefulWidget {
  const ApprovalsQueuePage({super.key});

  @override
  ConsumerState<ApprovalsQueuePage> createState() => _ApprovalsQueuePageState();
}

class _ApprovalsQueuePageState extends ConsumerState<ApprovalsQueuePage> {
  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authNotifierProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final role = authState.user?.role.toLowerCase() ?? '';
    final isAuthorized =
        role.contains('manager') ||
        role.contains('finance') ||
        role.contains('admin');

    if (!isAuthorized) {
      return Scaffold(
        appBar: AppBar(title: const Text('Approvals Queue')),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(
                  Icons.lock_outline_rounded,
                  size: 64,
                  color: AppColors.error,
                ),
                const SizedBox(height: 16),
                Text(
                  'Access Denied',
                  style: AppTypography.h2(
                    isDark ? Colors.white : AppColors.textPrimaryLight,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'The Approvals Queue is restricted to Managers, Finance, and Admins.',
                  textAlign: TextAlign.center,
                  style: AppTypography.bodyMedium(
                    isDark
                        ? AppColors.textSecondaryDark
                        : AppColors.textSecondaryLight,
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Approvals Queue'),
          bottom: const TabBar(
            tabs: [
              Tab(text: 'Travel Requests'),
              Tab(text: 'Expense Claims'),
            ],
          ),
          actions: [
            IconButton(
              icon: const Icon(Icons.refresh_rounded),
              onPressed: () {
                ref
                    .read(approvalsNotifierProvider.notifier)
                    .loadPendingApprovals();
                ref
                    .read(expenseApprovalsNotifierProvider.notifier)
                    .loadPendingClaims();
              },
            ),
          ],
        ),
        body: const TabBarView(
          children: [_TravelRequestsTab(), _ExpenseClaimsTab()],
        ),
      ),
    );
  }
}

class _TravelRequestsTab extends ConsumerStatefulWidget {
  const _TravelRequestsTab();

  @override
  ConsumerState<_TravelRequestsTab> createState() => _TravelRequestsTabState();
}

class _TravelRequestsTabState extends ConsumerState<_TravelRequestsTab> {
  final _commentController = TextEditingController();

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  void _showRejectionDialog(String stageId) {
    _commentController.clear();
    showDialog(
      context: context,
      builder: (context) {
        final isDark = Theme.of(context).brightness == Brightness.dark;
        return AlertDialog(
          title: Text(
            'Reject Request',
            style: AppTypography.h3(
              isDark ? Colors.white : AppColors.textPrimaryLight,
            ),
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Please provide a reason for the rejection (mandatory):',
                style: AppTypography.bodyMedium(
                  isDark
                      ? AppColors.textSecondaryDark
                      : AppColors.textSecondaryLight,
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _commentController,
                decoration: const InputDecoration(
                  hintText: 'Enter rejection comments...',
                  border: OutlineInputBorder(),
                ),
                maxLines: 3,
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.error,
                foregroundColor: Colors.white,
              ),
              onPressed: () {
                final reason = _commentController.text.trim();
                if (reason.isEmpty) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Rejection reason comments are mandatory.'),
                      backgroundColor: AppColors.error,
                    ),
                  );
                  return;
                }
                Navigator.pop(context);
                ref
                    .read(approvalsNotifierProvider.notifier)
                    .rejectApprovalStage(stageId, reason);
              },
              child: const Text('Reject'),
            ),
          ],
        );
      },
    );
  }

  String _formatDate(DateTime date) {
    final months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return '${date.day} ${months[date.month - 1]} ${date.year}';
  }

  String _formatCurrency(double amount) {
    return '₹${amount.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},')}';
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(approvalsNotifierProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    ref.listen<ApprovalsState>(approvalsNotifierProvider, (previous, next) {
      if (next.isProcessed) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Action processed successfully.'),
            backgroundColor: AppColors.success,
          ),
        );
        ref.read(approvalsNotifierProvider.notifier).resetProcessedFlag();
      }
      if (next.errorMessage != null &&
          next.errorMessage != previous?.errorMessage) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(next.errorMessage!),
            backgroundColor: AppColors.error,
          ),
        );
      }
    });

    if (state.isLoading && state.pendingApprovals.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }

    if (state.errorMessage != null && state.pendingApprovals.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.error_outline_rounded,
              size: 64,
              color: AppColors.error,
            ),
            const SizedBox(height: 16),
            Text(
              'Failed to load approvals',
              style: AppTypography.h3(
                isDark ? Colors.white : AppColors.textPrimaryLight,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              state.errorMessage!,
              textAlign: TextAlign.center,
              style: AppTypography.bodyMedium(
                isDark
                    ? AppColors.textSecondaryDark
                    : AppColors.textSecondaryLight,
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: () => ref
                  .read(approvalsNotifierProvider.notifier)
                  .loadPendingApprovals(),
              icon: const Icon(Icons.replay_rounded),
              label: const Text('Try Again'),
            ),
          ],
        ),
      );
    }

    if (state.pendingApprovals.isEmpty) {
      return Center(
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
                Icons.done_all_rounded,
                size: 72,
                color: AppColors.success,
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'Queue is clear!',
              style: AppTypography.h3(
                isDark ? Colors.white : AppColors.textPrimaryLight,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'No pending travel requests await your review.',
              textAlign: TextAlign.center,
              style: AppTypography.bodyMedium(
                isDark
                    ? AppColors.textSecondaryDark
                    : AppColors.textSecondaryLight,
              ),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: () async =>
          ref.read(approvalsNotifierProvider.notifier).loadPendingApprovals(),
      child: ListView.builder(
        padding: const EdgeInsets.all(20.0),
        itemCount: state.pendingApprovals.length,
        itemBuilder: (context, index) {
          final stage = state.pendingApprovals[index];
          final travelRequest = stage.travelRequest;
          if (travelRequest == null) return const SizedBox.shrink();

          return Card(
            margin: const EdgeInsets.only(bottom: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Level: ${stage.level}',
                        style: AppTypography.caption(
                          AppColors.primary,
                        ).copyWith(fontWeight: FontWeight.bold),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.warning.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          stage.status.toUpperCase(),
                          style: AppTypography.bodySmall(
                            AppColors.warning,
                          ).copyWith(fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    travelRequest.title,
                    style: AppTypography.subtitle(
                      isDark ? Colors.white : AppColors.textPrimaryLight,
                    ).copyWith(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Request ID: ${travelRequest.id.substring(0, 8)}',
                    style: AppTypography.bodySmall(
                      isDark
                          ? AppColors.textSecondaryDark
                          : AppColors.textSecondaryLight,
                    ),
                  ),
                  const Divider(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Destination:',
                        style: AppTypography.bodyMedium(
                          isDark
                              ? AppColors.textSecondaryDark
                              : AppColors.textSecondaryLight,
                        ),
                      ),
                      Text(
                        travelRequest.destination,
                        style: AppTypography.bodyMedium(
                          isDark ? Colors.white : AppColors.textPrimaryLight,
                        ).copyWith(fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Duration:',
                        style: AppTypography.bodyMedium(
                          isDark
                              ? AppColors.textSecondaryDark
                              : AppColors.textSecondaryLight,
                        ),
                      ),
                      Text(
                        '${_formatDate(travelRequest.startDate)} - ${_formatDate(travelRequest.endDate)}',
                        style: AppTypography.bodyMedium(
                          isDark ? Colors.white : AppColors.textPrimaryLight,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Estimated Cost:',
                        style: AppTypography.bodyMedium(
                          isDark
                              ? AppColors.textSecondaryDark
                              : AppColors.textSecondaryLight,
                        ),
                      ),
                      Text(
                        _formatCurrency(travelRequest.estimatedCost),
                        style: AppTypography.subtitle(
                          AppColors.primary,
                        ).copyWith(fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Flexible(
                        flex: 3,
                        child: OutlinedButton.icon(
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: AppColors.error),
                            foregroundColor: AppColors.error,
                          ),
                          onPressed: state.isProcessing
                              ? null
                              : () => _showRejectionDialog(stage.id),
                          icon: const Icon(Icons.close_rounded, size: 18),
                          label: const Text('Reject'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Flexible(
                        flex: 2,
                        child: ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.success,
                            foregroundColor: Colors.white,
                          ),
                          onPressed: state.isProcessing
                              ? null
                              : () => ref
                                    .read(approvalsNotifierProvider.notifier)
                                    .approveApprovalStage(stage.id),
                          icon: const Icon(Icons.check_rounded, size: 18),
                          label: const Text('Approve'),
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
  }
}

class _ExpenseClaimsTab extends ConsumerWidget {
  const _ExpenseClaimsTab();

  String _formatCurrency(double amount) {
    return '₹${amount.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},')}';
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(expenseApprovalsNotifierProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    ref.listen<ExpenseApprovalsState>(expenseApprovalsNotifierProvider, (
      previous,
      next,
    ) {
      if (next.isProcessed) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Expense claim approved successfully.'),
            backgroundColor: AppColors.success,
          ),
        );
        ref
            .read(expenseApprovalsNotifierProvider.notifier)
            .resetProcessedFlag();
      }
      if (next.errorMessage != null &&
          next.errorMessage != previous?.errorMessage) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(next.errorMessage!),
            backgroundColor: AppColors.error,
          ),
        );
      }
    });

    if (state.isLoading && state.pendingClaims.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }

    if (state.errorMessage != null && state.pendingClaims.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.error_outline_rounded,
              size: 64,
              color: AppColors.error,
            ),
            const SizedBox(height: 16),
            Text(
              'Failed to load expenses',
              style: AppTypography.h3(
                isDark ? Colors.white : AppColors.textPrimaryLight,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              state.errorMessage!,
              textAlign: TextAlign.center,
              style: AppTypography.bodyMedium(
                isDark
                    ? AppColors.textSecondaryDark
                    : AppColors.textSecondaryLight,
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: () => ref
                  .read(expenseApprovalsNotifierProvider.notifier)
                  .loadPendingClaims(),
              icon: const Icon(Icons.replay_rounded),
              label: const Text('Try Again'),
            ),
          ],
        ),
      );
    }

    if (state.pendingClaims.isEmpty) {
      return Center(
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
                Icons.done_all_rounded,
                size: 72,
                color: AppColors.success,
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'Queue is clear!',
              style: AppTypography.h3(
                isDark ? Colors.white : AppColors.textPrimaryLight,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'No pending expense claims await your review.',
              textAlign: TextAlign.center,
              style: AppTypography.bodyMedium(
                isDark
                    ? AppColors.textSecondaryDark
                    : AppColors.textSecondaryLight,
              ),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: () async => ref
          .read(expenseApprovalsNotifierProvider.notifier)
          .loadPendingClaims(),
      child: ListView.builder(
        padding: const EdgeInsets.all(20.0),
        itemCount: state.pendingClaims.length,
        itemBuilder: (context, index) {
          final claim = state.pendingClaims[index];

          return Card(
            margin: const EdgeInsets.only(bottom: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Claim #${claim.id.substring(0, 8)}',
                        style: AppTypography.caption(
                          AppColors.primary,
                        ).copyWith(fontWeight: FontWeight.bold),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.warning.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          claim.status.replaceAll('_', ' ').toUpperCase(),
                          style: AppTypography.bodySmall(
                            AppColors.warning,
                          ).copyWith(fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    claim.user?.name ?? 'Unknown User',
                    style: AppTypography.subtitle(
                      isDark ? Colors.white : AppColors.textPrimaryLight,
                    ).copyWith(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Associated Trip: ${claim.travelRequest?.title ?? 'None'}',
                    style: AppTypography.bodySmall(
                      isDark
                          ? AppColors.textSecondaryDark
                          : AppColors.textSecondaryLight,
                    ),
                  ),
                  const Divider(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Total Amount:',
                        style: AppTypography.bodyMedium(
                          isDark
                              ? AppColors.textSecondaryDark
                              : AppColors.textSecondaryLight,
                        ),
                      ),
                      Text(
                        _formatCurrency(claim.claimAmount),
                        style: AppTypography.h3(
                          AppColors.primary,
                        ).copyWith(fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.success,
                      foregroundColor: Colors.white,
                    ),
                    onPressed: state.isProcessing
                        ? null
                        : () => ref
                              .read(expenseApprovalsNotifierProvider.notifier)
                              .approveClaim(claim.id),
                    icon: const Icon(Icons.check_rounded, size: 18),
                    label: const Text('Approve & Forward to Finance'),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
