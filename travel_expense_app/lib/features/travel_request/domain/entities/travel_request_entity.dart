import 'package:equatable/equatable.dart';

class TravelRequestEntity extends Equatable {
  final String id;
  final String title;
  final String description;
  final String purpose;
  final String destination;
  final DateTime startDate;
  final DateTime endDate;
  final double estimatedCost;
  final String status; // 'pending', 'approved', 'rejected', 'cancelled'
  final DateTime createdAt;

  const TravelRequestEntity({
    required this.id,
    required this.title,
    required this.description,
    required this.purpose,
    required this.destination,
    required this.startDate,
    required this.endDate,
    required this.estimatedCost,
    required this.status,
    required this.createdAt,
  });

  @override
  List<Object?> get props => [
        id,
        title,
        description,
        purpose,
        destination,
        startDate,
        endDate,
        estimatedCost,
        status,
        createdAt,
      ];
}
