import '../../../expenses/domain/entities/expense_claim_entity.dart';

class ReimbursementEntity {
  final String id;
  final String claimId;
  final ExpenseClaimEntity? claim;
  final String? paymentReference;
  final String status;
  final DateTime? paidAt;
  final DateTime createdAt;

  const ReimbursementEntity({
    required this.id,
    required this.claimId,
    this.claim,
    this.paymentReference,
    required this.status,
    this.paidAt,
    required this.createdAt,
  });

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ReimbursementEntity &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          claimId == other.claimId &&
          paymentReference == other.paymentReference &&
          status == other.status &&
          paidAt == other.paidAt &&
          createdAt == other.createdAt;

  @override
  int get hashCode =>
      id.hashCode ^
      claimId.hashCode ^
      paymentReference.hashCode ^
      status.hashCode ^
      paidAt.hashCode ^
      createdAt.hashCode;
}
