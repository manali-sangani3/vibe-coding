import 'package:equatable/equatable.dart';

class AuditLogEntity extends Equatable {
  final String id;
  final String action;
  final String entityName;
  final String entityId;
  final String? userId;
  final Map<String, dynamic>? metadata;
  final DateTime timestamp;

  const AuditLogEntity({
    required this.id,
    required this.action,
    required this.entityName,
    required this.entityId,
    this.userId,
    this.metadata,
    required this.timestamp,
  });

  @override
  List<Object?> get props => [id, action, entityName, entityId, userId, metadata, timestamp];
}
