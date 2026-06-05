import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../providers/travel_request_provider.dart';
import '../widgets/travel_request_card.dart';

class TravelRequestListPage extends ConsumerWidget {
  const TravelRequestListPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(travelRequestNotifierProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Travel Requests'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: () {
              ref.read(travelRequestNotifierProvider.notifier).loadTravelRequests();
            },
          ),
        ],
      ),
      body: Builder(
        builder: (context) {
          if (state.isLoading && state.requests.isEmpty) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }

          if (state.errorMessage != null && state.requests.isEmpty) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.error_outline_rounded, size: 64, color: AppColors.error),
                    const SizedBox(height: 16),
                    Text(
                      'Failed to load requests',
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
                        ref.read(travelRequestNotifierProvider.notifier).loadTravelRequests();
                      },
                      icon: const Icon(Icons.replay_rounded),
                      label: const Text('Try Again'),
                    ),
                  ],
                ),
              ),
            );
          }

          if (state.requests.isEmpty) {
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
                        Icons.airplanemode_inactive_rounded,
                        size: 72,
                        color: AppColors.primary,
                      ),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'No travel requests yet',
                      style: AppTypography.h3(isDark ? Colors.white : AppColors.textPrimaryLight),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Plan your next business trip and submit a digital request for manager approvals.',
                      textAlign: TextAlign.center,
                      style: AppTypography.bodyMedium(
                        isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                      ),
                    ),
                    const SizedBox(height: 32),
                    ElevatedButton.icon(
                      onPressed: () => context.push('/travel-requests/new'),
                      icon: const Icon(Icons.add_rounded),
                      label: const Text('Create Travel Request'),
                    ),
                  ],
                ),
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: () async {
              await ref.read(travelRequestNotifierProvider.notifier).loadTravelRequests();
            },
            child: ListView.builder(
              padding: const EdgeInsets.all(24.0),
              itemCount: state.requests.length,
              itemBuilder: (context, index) {
                final request = state.requests[index];
                return TravelRequestCard(
                  request: request,
                  onTap: () => context.push('/travel-requests/${request.id}'),
                );
              },
            ),
          );
        },
      ),
      floatingActionButton: state.requests.isNotEmpty
          ? FloatingActionButton.extended(
              onPressed: () => context.push('/travel-requests/new'),
              icon: const Icon(Icons.add_rounded),
              label: const Text('New Request'),
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
            )
          : null,
    );
  }
}
