import '../../domain/entities/travel_request_entity.dart';

class TravelRequestModel extends TravelRequestEntity {
  const TravelRequestModel({
    required super.id,
    required super.title,
    required super.description,
    required super.purpose,
    required super.destination,
    required super.startDate,
    required super.endDate,
    required super.estimatedCost,
    required super.status,
    required super.createdAt,
  });

  factory TravelRequestModel.fromJson(Map<String, dynamic> json) {
    return TravelRequestModel(
      id: json['id'] as String,
      title: json['title'] as String,
      description: (json['description'] as String?) ?? '',
      purpose: json['purpose'] as String,
      destination: json['destination'] as String,
      startDate: DateTime.parse(json['startDate'] as String),
      endDate: DateTime.parse(json['endDate'] as String),
      estimatedCost: double.parse(json['estimatedCost'].toString()),
      status: json['status'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'purpose': purpose,
      'destination': destination,
      'startDate': startDate.toIso8601String(),
      'endDate': endDate.toIso8601String(),
      'estimatedCost': estimatedCost,
      'status': status,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  TravelRequestModel copyWith({
    String? id,
    String? title,
    String? description,
    String? purpose,
    String? destination,
    DateTime? startDate,
    DateTime? endDate,
    double? estimatedCost,
    String? status,
    DateTime? createdAt,
  }) {
    return TravelRequestModel(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      purpose: purpose ?? this.purpose,
      destination: destination ?? this.destination,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      estimatedCost: estimatedCost ?? this.estimatedCost,
      status: status ?? this.status,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}
