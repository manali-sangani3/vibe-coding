import '../../../travel_request/domain/entities/travel_request_entity.dart';
import '../../../auth/domain/entities/user_entity.dart';

class ApprovalStageEntity {
  final String id;
  final String requestId;
  final TravelRequestEntity? travelRequest;
  final String approverId;
  final UserEntity? approver;
  final String level;
  final String status;
  final String? comments;
  final DateTime createdAt;

  const ApprovalStageEntity({
    required this.id,
    required this.requestId,
    this.travelRequest,
    required this.approverId,
    this.approver,
    required this.level,
    required this.status,
    this.comments,
    required this.createdAt,
  });

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ApprovalStageEntity &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          requestId == other.requestId &&
          approverId == other.approverId &&
          level == other.level &&
          status == other.status &&
          comments == other.comments &&
          createdAt == other.createdAt;

  @override
  int get hashCode =>
      id.hashCode ^
      requestId.hashCode ^
      approverId.hashCode ^
      level.hashCode ^
      status.hashCode ^
      comments.hashCode ^
      createdAt.hashCode;
}
