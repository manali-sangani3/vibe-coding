import '../../domain/entities/audit_log_entity.dart';

class AuditLogModel extends AuditLogEntity {
  const AuditLogModel({
    required super.id,
    required super.action,
    required super.entityName,
    required super.entityId,
    super.userId,
    super.metadata,
    required super.timestamp,
  });

  factory AuditLogModel.fromJson(Map<String, dynamic> json) {
    return AuditLogModel(
      id: json['id'] as String,
      action: json['action'] as String,
      entityName: json['entityName'] as String,
      entityId: json['entityId'] as String,
      userId: json['userId'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>?,
      timestamp: DateTime.parse(json['timestamp'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'action': action,
      'entityName': entityName,
      'entityId': entityId,
      'userId': userId,
      'metadata': metadata,
      'timestamp': timestamp.toIso8601String(),
    };
  }
}
