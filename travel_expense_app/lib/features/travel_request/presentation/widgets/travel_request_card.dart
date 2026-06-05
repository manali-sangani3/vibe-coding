import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../domain/entities/travel_request_entity.dart';
import 'travel_status_badge.dart';

class TravelRequestCard extends StatelessWidget {
  final TravelRequestEntity request;
  final VoidCallback onTap;

  const TravelRequestCard({
    super.key,
    required this.request,
    required this.onTap,
  });

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

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header: ID and Status Badge
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    request.id,
                    style: AppTypography.caption(
                      isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                    ).copyWith(fontWeight: FontWeight.bold),
                  ),
                  TravelStatusBadge(status: request.status),
                ],
              ),
              const SizedBox(height: 12),
              
              // Title
              Text(
                request.title,
                style: AppTypography.subtitle(
                  isDark ? Colors.white : AppColors.textPrimaryLight,
                ).copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 4),
              
              // Purpose Tag
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
              const SizedBox(height: 16),
              
              // Destination
              Row(
                children: [
                  const Icon(
                    Icons.location_on_outlined,
                    size: 18,
                    color: AppColors.secondary,
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      request.destination,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: AppTypography.bodyMedium(
                        isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              
              // Dates & Cost
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Date range
                  Row(
                    children: [
                      const Icon(
                        Icons.calendar_today_outlined,
                        size: 16,
                        color: AppColors.primaryLight,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        '${_formatDate(request.startDate)} - ${_formatDate(request.endDate)}',
                        style: AppTypography.bodySmall(
                          isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                        ),
                      ),
                    ],
                  ),
                  
                  // Cost
                  Text(
                    _formatCurrency(request.estimatedCost),
                    style: AppTypography.subtitle(
                      isDark ? Colors.white : AppColors.textPrimaryLight,
                    ).copyWith(fontWeight: FontWeight.bold),
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
