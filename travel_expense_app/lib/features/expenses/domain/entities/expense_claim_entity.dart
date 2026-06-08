import 'package:equatable/equatable.dart';
import '../../../travel_request/domain/entities/travel_request_entity.dart';
import '../../../auth/domain/entities/user_entity.dart';

class ExpenseItemEntity extends Equatable {
  final String id;
  final String? claimId;
  final String category;
  final double amount;
  final String description;
  final String? receiptUrl;

  const ExpenseItemEntity({
    required this.id,
    this.claimId,
    required this.category,
    required this.amount,
    required this.description,
    this.receiptUrl,
  });

  @override
  List<Object?> get props => [id, claimId, category, amount, description, receiptUrl];
}

class ExpenseClaimEntity extends Equatable {
  final String id;
  final String? travelRequestId;
  final TravelRequestEntity? travelRequest;
  final double claimAmount;
  final String status;
  final String userId;
  final UserEntity? user;
  final List<ExpenseItemEntity> items;
  final DateTime? submittedAt;
  final DateTime createdAt;

  const ExpenseClaimEntity({
    required this.id,
    this.travelRequestId,
    this.travelRequest,
    required this.claimAmount,
    required this.status,
    required this.userId,
    this.user,
    required this.items,
    this.submittedAt,
    required this.createdAt,
  });

  @override
  List<Object?> get props => [
        id,
        travelRequestId,
        travelRequest,
        claimAmount,
        status,
        userId,
        items,
        submittedAt,
        createdAt,
      ];
}
