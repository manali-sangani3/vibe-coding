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
