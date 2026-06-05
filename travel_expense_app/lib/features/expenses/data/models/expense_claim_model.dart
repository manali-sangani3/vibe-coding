import '../../domain/entities/expense_claim_entity.dart';
import '../../../travel_request/data/models/travel_request_model.dart';
import '../../../auth/data/models/user_model.dart';

class ExpenseItemModel extends ExpenseItemEntity {
  const ExpenseItemModel({
    required super.id,
    super.claimId,
    required super.category,
    required super.amount,
    required super.description,
    super.receiptUrl,
  });

  factory ExpenseItemModel.fromJson(Map<String, dynamic> json) {
    return ExpenseItemModel(
      id: json['id'] as String,
      claimId: json['claimId'] as String?,
      category: json['category'] as String,
      amount: double.parse(json['amount'].toString()),
      description: json['description'] as String,
      receiptUrl: json['receiptUrl'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'claimId': claimId,
      'category': category,
      'amount': amount,
      'description': description,
      'receiptUrl': receiptUrl,
    };
  }
}

class ExpenseClaimModel extends ExpenseClaimEntity {
  const ExpenseClaimModel({
    required super.id,
    super.travelRequestId,
    super.travelRequest,
    required super.claimAmount,
    required super.status,
    required super.userId,
    super.user,
    required List<ExpenseItemModel> super.items,
    super.submittedAt,
    required super.createdAt,
  });

  factory ExpenseClaimModel.fromJson(Map<String, dynamic> json) {
    return ExpenseClaimModel(
      id: json['id'] as String,
      travelRequestId: json['travelRequestId'] as String?,
      travelRequest: json['travelRequest'] != null
          ? TravelRequestModel.fromJson(json['travelRequest'] as Map<String, dynamic>)
          : null,
      claimAmount: double.parse(json['claimAmount'].toString()),
      status: json['status'] as String,
      userId: json['userId'] as String,
      user: json['user'] != null
          ? UserModel.fromJson(json['user'] as Map<String, dynamic>)
          : null,
      items: json['items'] != null
          ? (json['items'] as List)
              .map((item) => ExpenseItemModel.fromJson(item as Map<String, dynamic>))
              .toList()
          : const [],
      submittedAt: json['submittedAt'] != null ? DateTime.parse(json['submittedAt'] as String) : null,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'travelRequestId': travelRequestId,
      'travelRequest': (travelRequest as TravelRequestModel?)?.toJson(),
      'claimAmount': claimAmount,
      'status': status,
      'userId': userId,
      'user': (user as UserModel?)?.toJson(),
      'items': items.map((item) => (item as ExpenseItemModel).toJson()).toList(),
      'submittedAt': submittedAt?.toIso8601String(),
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
