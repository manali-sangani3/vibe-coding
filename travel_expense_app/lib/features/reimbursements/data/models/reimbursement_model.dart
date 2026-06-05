import '../../domain/entities/reimbursement_entity.dart';
import '../../../expenses/data/models/expense_claim_model.dart';

class ReimbursementModel extends ReimbursementEntity {
  const ReimbursementModel({
    required super.id,
    required super.claimId,
    super.claim,
    super.paymentReference,
    required super.status,
    super.paidAt,
    required super.createdAt,
  });

  factory ReimbursementModel.fromJson(Map<String, dynamic> json) {
    return ReimbursementModel(
      id: json['id'] as String,
      claimId: json['claimId'] as String,
      claim: json['claim'] != null
          ? ExpenseClaimModel.fromJson(json['claim'] as Map<String, dynamic>)
          : null,
      paymentReference: json['paymentReference'] as String?,
      status: json['status'] as String,
      paidAt: json['paidAt'] != null ? DateTime.parse(json['paidAt'] as String) : null,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'claimId': claimId,
      'claim': (claim as ExpenseClaimModel?)?.toJson(),
      'paymentReference': paymentReference,
      'status': status,
      'paidAt': paidAt?.toIso8601String(),
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
