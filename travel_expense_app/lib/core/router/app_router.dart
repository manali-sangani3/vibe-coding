import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../features/auth/presentation/pages/login_page.dart';
import '../../features/dashboard/presentation/pages/dashboard_page.dart';
import '../../features/auth/presentation/providers/auth_provider.dart';
import '../../features/travel_request/presentation/pages/travel_request_list_page.dart';
import '../../features/travel_request/presentation/pages/travel_request_form_page.dart';
import '../../features/travel_request/presentation/pages/travel_request_detail_page.dart';
import '../../features/approvals/presentation/pages/approvals_queue_page.dart';
import '../../features/expenses/presentation/pages/expense_list_page.dart';
import '../../features/expenses/presentation/pages/expense_form_page.dart';
import '../../features/reimbursements/presentation/pages/reimbursements_history_page.dart';
import '../../features/reimbursements/presentation/pages/finance_reimbursement_queue_page.dart';
import '../../features/audit/presentation/pages/audit_logs_page.dart';
import 'package:flutter/material.dart';
final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authNotifierProvider);

  return GoRouter(
    initialLocation: '/login',
    routes: [
      GoRoute(
        path: '/login',
        name: 'login',
        builder: (context, state) => const LoginPage(),
      ),
      GoRoute(
        path: '/dashboard',
        name: 'dashboard',
        builder: (context, state) => const DashboardPage(),
      ),
      GoRoute(
        path: '/travel-requests',
        name: 'travel_requests',
        builder: (context, state) => const TravelRequestListPage(),
        routes: [
          GoRoute(
            path: 'new',
            name: 'travel_request_new',
            builder: (context, state) => const TravelRequestFormPage(),
          ),
          GoRoute(
            path: ':id',
            name: 'travel_request_detail',
            builder: (context, state) {
              final id = state.pathParameters['id']!;
              return TravelRequestDetailPage(requestId: id);
            },
          ),
        ],
      ),
      GoRoute(
        path: '/approvals',
        name: 'approvals',
        builder: (context, state) => const ApprovalsQueuePage(),
      ),
      GoRoute(
        path: '/expenses',
        name: 'expenses',
        builder: (context, state) => const ExpenseListPage(),
        routes: [
          GoRoute(
            path: 'new',
            name: 'expense_claim_new',
            builder: (context, state) => const ExpenseFormPage(),
          ),
        ],
      ),
      GoRoute(
        path: '/reimbursements',
        name: 'reimbursements',
        builder: (context, state) => const ReimbursementHistoryPage(),
      ),
      GoRoute(
        path: '/finance-queue',
        name: 'finance_queue',
        builder: (context, state) => const FinanceReimbursementQueuePage(),
      ),
      GoRoute(
        path: '/audit-logs',
        name: 'audit_logs',
        builder: (context, state) => const AuditLogsPage(),
      ),
      GoRoute(
        path: '/compliance',
        name: 'compliance',
        builder: (context, state) => Scaffold(
          appBar: AppBar(title: const Text('Compliance Policy')),
          body: const Center(
            child: Padding(
              padding: EdgeInsets.all(24.0),
              child: Text(
                'Enterprise Policies:\n\n1. Flights: Economy only for trips < 4 hours. Business allowed for Executives.\n2. Meals: Max ₹1,500/day for employees.\n3. Accommodation: Max ₹10,000/night.\n4. Receipts mandatory for all claims > ₹500.\n\nAll rules are enforced automatically by the Compliance Engine.',
                style: TextStyle(fontSize: 16, height: 1.5),
              ),
            ),
          ),
        ),
      ),
    ],
    redirect: (context, state) {
      final isLoggedIn = authState.isAuthenticated;
      final isGoingToLogin = state.matchedLocation == '/login';

      if (!isLoggedIn) {
        // Redirect to Login if trying to access any protected route
        return isGoingToLogin ? null : '/login';
      }

      if (isGoingToLogin) {
        // Redirect to Dashboard if already logged in and trying to access Login page
        return '/dashboard';
      }

      return null;
    },
  );
});
