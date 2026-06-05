import '../../../travel_request/domain/entities/travel_request_entity.dart';
import '../../../auth/domain/entities/user_entity.dart';

class ExpenseItemEntity {
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
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ExpenseItemEntity &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          claimId == other.claimId &&
          category == other.category &&
          amount == other.amount &&
          description == other.description &&
          receiptUrl == other.receiptUrl;

  @override
  int get hashCode =>
      id.hashCode ^
      claimId.hashCode ^
      category.hashCode ^
      amount.hashCode ^
      description.hashCode ^
      receiptUrl.hashCode;
}

class ExpenseClaimEntity {
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
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ExpenseClaimEntity &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          travelRequestId == other.travelRequestId &&
          claimAmount == other.claimAmount &&
          status == other.status &&
          userId == other.userId &&
          items == other.items &&
          submittedAt == other.submittedAt &&
          createdAt == other.createdAt;

  @override
  int get hashCode =>
      id.hashCode ^
      travelRequestId.hashCode ^
      claimAmount.hashCode ^
      status.hashCode ^
      userId.hashCode ^
      items.hashCode ^
      submittedAt.hashCode ^
      createdAt.hashCode;
}
