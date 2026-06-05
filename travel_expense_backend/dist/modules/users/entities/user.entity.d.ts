export declare enum UserRole {
    EMPLOYEE = "Employee",
    MANAGER = "Manager",
    FINANCE = "Finance Executive",
    COMPLIANCE = "Compliance Officer",
    ADMIN = "Admin"
}
export declare class User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    department: string;
    avatarUrl: string;
    managerId: string;
    manager: User;
    createdAt: Date;
}
