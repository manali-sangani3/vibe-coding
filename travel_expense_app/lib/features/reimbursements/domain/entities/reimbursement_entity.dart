import 'package:equatable/equatable.dart';
import '../../../expenses/domain/entities/expense_claim_entity.dart';

class ReimbursementEntity extends Equatable {
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
  List<Object?> get props => [id, claimId, claim, paymentReference, status, paidAt, createdAt];
}
