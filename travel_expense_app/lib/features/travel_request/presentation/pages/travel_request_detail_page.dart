import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../providers/travel_request_provider.dart';
import '../widgets/travel_status_badge.dart';

class TravelRequestDetailPage extends ConsumerWidget {
  final String requestId;

  const TravelRequestDetailPage({super.key, required this.requestId});

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

  void _showCancelDialog(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Cancel Request'),
        content: const Text('Are you sure you want to cancel this travel request?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Go Back'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ref.read(travelRequestNotifierProvider.notifier).cancelRequest(requestId);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.error,
              foregroundColor: Colors.white,
            ),
            child: const Text('Yes, Cancel'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(travelRequestNotifierProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final requestIndex = state.requests.indexWhere((r) => r.id == requestId);
    if (requestIndex == -1) {
      return Scaffold(
        appBar: AppBar(title: const Text('Request Detail')),
        body: const Center(child: Text('Request not found.')),
      );
    }
    
    final request = state.requests[requestIndex];

    return Scaffold(
      appBar: AppBar(
        title: Text(request.id),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        TravelStatusBadge(status: request.status),
                        Text(
                          'Created: ${_formatDate(request.createdAt)}',
                          style: AppTypography.caption(
                            isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Text(
                      request.title,
                      style: AppTypography.subtitle(isDark ? Colors.white : AppColors.textPrimaryLight).copyWith(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.primary.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            request.purpose,
                            style: AppTypography.bodySmall(AppColors.primary).copyWith(
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Trip Details',
                      style: AppTypography.subtitle(
                        isDark ? Colors.white : AppColors.textPrimaryLight,
                      ),
                    ),
                    const Divider(height: 24),
                    Row(
                      children: [
                        const Icon(Icons.location_on_outlined, color: AppColors.secondary, size: 20),
                        const SizedBox(width: 12),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Destination',
                              style: AppTypography.bodySmall(
                                isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                              ),
                            ),
                            Text(
                              request.destination,
                              style: AppTypography.bodyLarge(isDark ? Colors.white : AppColors.textPrimaryLight),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        const Icon(Icons.calendar_today_outlined, color: AppColors.primaryLight, size: 20),
                        const SizedBox(width: 12),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Duration',
                              style: AppTypography.bodySmall(
                                isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                              ),
                            ),
                            Text(
                              '${_formatDate(request.startDate)} - ${_formatDate(request.endDate)}',
                              style: AppTypography.bodyLarge(isDark ? Colors.white : AppColors.textPrimaryLight),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        const Icon(Icons.payments_outlined, color: AppColors.success, size: 20),
                        const SizedBox(width: 12),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Estimated Cost',
                              style: AppTypography.bodySmall(
                                isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                              ),
                            ),
                            Text(
                              _formatCurrency(request.estimatedCost),
                              style: AppTypography.bodyLarge(isDark ? Colors.white : AppColors.textPrimaryLight).copyWith(
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Business Justification',
                      style: AppTypography.subtitle(
                        isDark ? Colors.white : AppColors.textPrimaryLight,
                      ),
                    ),
                    const Divider(height: 24),
                    Text(
                      request.description,
                      style: AppTypography.bodyMedium(
                        isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Approval Workflow Status',
                      style: AppTypography.subtitle(
                        isDark ? Colors.white : AppColors.textPrimaryLight,
                      ),
                    ),
                    const Divider(height: 24),
                    _buildTimelineItem(
                      title: 'Request Submitted',
                      subtitle: 'By Employee',
                      isCompleted: true,
                      isLast: false,
                    ),
                    _buildTimelineItem(
                      title: 'L1 Manager Approval',
                      subtitle: request.status == 'approved'
                          ? 'Approved'
                          : request.status == 'rejected'
                              ? 'Rejected'
                              : request.status == 'cancelled'
                                  ? 'Cancelled'
                                  : 'Pending Review',
                      isCompleted: request.status == 'approved',
                      isLast: true,
                      status: request.status,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 32),
            if (request.status == 'pending')
              ElevatedButton.icon(
                onPressed: () => _showCancelDialog(context, ref),
                icon: const Icon(Icons.cancel_outlined),
                label: const Text('Cancel Request'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.error,
                  foregroundColor: Colors.white,
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildTimelineItem({
    required String title,
    required String subtitle,
    required bool isCompleted,
    required bool isLast,
    String? status,
  }) {
    Color indicatorColor = isCompleted ? AppColors.success : Colors.grey;
    if (status == 'rejected') {
      indicatorColor = AppColors.error;
    } else if (status == 'cancelled') {
      indicatorColor = Colors.grey;
    }

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          children: [
            Container(
              width: 16,
              height: 16,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: indicatorColor,
              ),
            ),
            if (!isLast)
              Container(
                width: 2,
                height: 40,
                color: isCompleted ? AppColors.success : Colors.grey,
              ),
          ],
        ),
        const SizedBox(width: 16),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: AppTypography.subtitle(isCompleted ? AppColors.success : Colors.grey).copyWith(
                fontWeight: isCompleted ? FontWeight.bold : FontWeight.normal,
              ),
            ),
            Text(
              subtitle,
              style: AppTypography.bodySmall(Colors.grey),
            ),
            const SizedBox(height: 12),
          ],
        ),
      ],
    );
  }
}
