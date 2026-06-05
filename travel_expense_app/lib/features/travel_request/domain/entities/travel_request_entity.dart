class TravelRequestEntity {
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
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is TravelRequestEntity &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          title == other.title &&
          description == other.description &&
          purpose == other.purpose &&
          destination == other.destination &&
          startDate == other.startDate &&
          endDate == other.endDate &&
          estimatedCost == other.estimatedCost &&
          status == other.status &&
          createdAt == other.createdAt;

  @override
  int get hashCode =>
      id.hashCode ^
      title.hashCode ^
      description.hashCode ^
      purpose.hashCode ^
      destination.hashCode ^
      startDate.hashCode ^
      endDate.hashCode ^
      estimatedCost.hashCode ^
      status.hashCode ^
      createdAt.hashCode;
}
