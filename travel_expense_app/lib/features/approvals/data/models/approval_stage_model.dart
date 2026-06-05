import '../../domain/entities/approval_stage_entity.dart';
import '../../../travel_request/data/models/travel_request_model.dart';
import '../../../auth/data/models/user_model.dart';

class ApprovalStageModel extends ApprovalStageEntity {
  const ApprovalStageModel({
    required super.id,
    required super.requestId,
    super.travelRequest,
    required super.approverId,
    super.approver,
    required super.level,
    required super.status,
    super.comments,
    required super.createdAt,
  });

  factory ApprovalStageModel.fromJson(Map<String, dynamic> json) {
    return ApprovalStageModel(
      id: json['id'] as String,
      requestId: json['requestId'] as String,
      travelRequest: json['travelRequest'] != null
          ? TravelRequestModel.fromJson(json['travelRequest'] as Map<String, dynamic>)
          : null,
      approverId: json['approverId'] as String,
      approver: json['approver'] != null
          ? UserModel.fromJson(json['approver'] as Map<String, dynamic>)
          : null,
      level: json['level'] as String,
      status: json['status'] as String,
      comments: json['comments'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'requestId': requestId,
      'travelRequest': (travelRequest as TravelRequestModel?)?.toJson(),
      'approverId': approverId,
      'approver': (approver as UserModel?)?.toJson(),
      'level': level,
      'status': status,
      'comments': comments,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
