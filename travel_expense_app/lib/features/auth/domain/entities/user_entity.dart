class UserEntity {
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
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is UserEntity &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          email == other.email &&
          name == other.name &&
          role == other.role &&
          department == other.department &&
          avatarUrl == other.avatarUrl;

  @override
  int get hashCode =>
      id.hashCode ^
      email.hashCode ^
      name.hashCode ^
      role.hashCode ^
      department.hashCode ^
      avatarUrl.hashCode;
}
