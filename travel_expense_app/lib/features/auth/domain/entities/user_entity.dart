import 'package:equatable/equatable.dart';

class UserEntity extends Equatable {
  final String id;
  final String email;
  final String name;
  final String role; // e.g., 'Employee', 'Manager', 'Finance Executive', 'Compliance Officer', 'Admin'
  final String? department;
  final String? avatarUrl;

  const UserEntity({
    required this.id,
    required this.email,
    required this.name,
    required this.role,
    this.department,
    this.avatarUrl,
  });

  @override
  List<Object?> get props => [id, email, name, role, department, avatarUrl];
}
