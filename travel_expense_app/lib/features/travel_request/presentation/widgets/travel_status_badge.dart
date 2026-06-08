import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';

class TravelStatusBadge extends StatelessWidget {
  final String status;

  const TravelStatusBadge({super.key, required this.status});

  @override
  Widget build(BuildContext context) {
    Color bgColor;
    Color textColor;
    String label = status.replaceAll('_', ' ').toUpperCase();

    switch (status.toLowerCase()) {
      case 'approved':
      case 'reimbursed':
        bgColor = AppColors.success.withValues(alpha: 0.12);
        textColor = AppColors.success;
        break;
      case 'rejected':
        bgColor = AppColors.error.withValues(alpha: 0.12);
        textColor = AppColors.error;
        break;
      case 'cancelled':
        bgColor = Colors.grey.withValues(alpha: 0.12);
        textColor = Colors.grey;
        break;
      default:
        bgColor = AppColors.warning.withValues(alpha: 0.12);
        textColor = AppColors.warning;
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        label,
        style: AppTypography.caption(textColor).copyWith(
          fontWeight: FontWeight.bold,
          letterSpacing: 0.5,
        ),
      ),
    );
  }
}
