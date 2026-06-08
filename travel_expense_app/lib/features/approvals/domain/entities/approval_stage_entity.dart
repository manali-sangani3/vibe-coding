import 'package:equatable/equatable.dart';
import '../../../travel_request/domain/entities/travel_request_entity.dart';
import '../../../auth/domain/entities/user_entity.dart';

class ApprovalStageEntity extends Equatable {
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
  List<Object?> get props => [
        id,
        requestId,
        travelRequest,
        approverId,
        approver,
        level,
        status,
        comments,
        createdAt,
      ];
}
