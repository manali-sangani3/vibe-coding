import 'package:get_it/get_it.dart';
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../storage/local_storage.dart';
import '../storage/secure_storage.dart';
import '../network/api_client.dart';
import '../../features/auth/data/datasources/auth_remote_datasource.dart';
import '../../features/auth/data/repositories/auth_repository_impl.dart';
import '../../features/auth/domain/repositories/auth_repository.dart';
import '../../features/auth/domain/usecases/login_usecase.dart';
import '../../features/auth/domain/usecases/logout_usecase.dart';
import '../../features/auth/domain/usecases/get_current_user_usecase.dart';
import '../../features/travel_request/data/datasources/travel_remote_datasource.dart';
import '../../features/travel_request/data/repositories/travel_repository_impl.dart';
import '../../features/travel_request/domain/repositories/travel_repository.dart';
import '../../features/travel_request/domain/usecases/get_travel_requests_usecase.dart';
import '../../features/travel_request/domain/usecases/submit_travel_request_usecase.dart';
import '../../features/travel_request/domain/usecases/cancel_travel_request_usecase.dart';

import '../../features/approvals/data/datasources/approvals_remote_datasource.dart';
import '../../features/approvals/data/repositories/approvals_repository_impl.dart';
import '../../features/approvals/domain/repositories/approvals_repository.dart';
import '../../features/approvals/domain/usecases/get_pending_approvals_usecase.dart';
import '../../features/approvals/domain/usecases/approve_stage_usecase.dart';
import '../../features/approvals/domain/usecases/reject_stage_usecase.dart';

import '../../features/expenses/data/datasources/expenses_remote_datasource.dart';
import '../../features/expenses/data/repositories/expenses_repository_impl.dart';
import '../../features/expenses/domain/repositories/expenses_repository.dart';
import '../../features/expenses/domain/usecases/get_expense_claims_usecase.dart';
import '../../features/expenses/domain/usecases/get_expense_claim_by_id_usecase.dart';
import '../../features/expenses/domain/usecases/submit_expense_claim_usecase.dart';
import '../../features/expenses/domain/usecases/upload_receipt_usecase.dart';

import '../../features/reimbursements/data/datasources/reimbursements_remote_datasource.dart';
import '../../features/reimbursements/data/repositories/reimbursements_repository_impl.dart';
import '../../features/reimbursements/domain/repositories/reimbursements_repository.dart';
import '../../features/reimbursements/domain/usecases/get_reimbursements_usecase.dart';

final sl = GetIt.instance;

Future<void> init() async {
  // External
  final sharedPreferences = await SharedPreferences.getInstance();
  sl.registerLazySingleton<SharedPreferences>(() => sharedPreferences);
  sl.registerLazySingleton<FlutterSecureStorage>(() => const FlutterSecureStorage());

  // Storage wrappers
  sl.registerLazySingleton<LocalStorage>(() => LocalStorage(sl()));
  sl.registerLazySingleton<SecureStorage>(() => SecureStorage(sl()));

  // Network
  sl.registerLazySingleton<Dio>(() => Dio());
  sl.registerLazySingleton<ApiClient>(() => ApiClient(sl(), sl()));

  // Features - Auth
  // Data sources
  sl.registerLazySingleton<AuthRemoteDataSource>(() => AuthRemoteDataSourceImpl(sl()));

  // Repositories
  sl.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(remoteDataSource: sl(), secureStorage: sl()),
  );

  // Use cases
  sl.registerLazySingleton<LoginUseCase>(() => LoginUseCase(sl()));
  sl.registerLazySingleton<LogoutUseCase>(() => LogoutUseCase(sl()));
  sl.registerLazySingleton<GetCurrentUserUseCase>(() => GetCurrentUserUseCase(sl()));

  // Features - Travel Request
  // Data sources
  sl.registerLazySingleton<TravelRemoteDataSource>(() => TravelRemoteDataSourceImpl(sl()));

  // Repositories
  sl.registerLazySingleton<TravelRepository>(() => TravelRepositoryImpl(remoteDataSource: sl()));

  // Use cases
  sl.registerLazySingleton<GetTravelRequestsUseCase>(() => GetTravelRequestsUseCase(sl()));
  sl.registerLazySingleton<SubmitTravelRequestUseCase>(() => SubmitTravelRequestUseCase(sl()));
  sl.registerLazySingleton<CancelTravelRequestUseCase>(() => CancelTravelRequestUseCase(sl()));

  // Features - Approvals
  // Data sources
  sl.registerLazySingleton<ApprovalsRemoteDataSource>(() => ApprovalsRemoteDataSourceImpl(sl()));

  // Repositories
  sl.registerLazySingleton<ApprovalsRepository>(() => ApprovalsRepositoryImpl(remoteDataSource: sl()));

  // Use cases
  sl.registerLazySingleton<GetPendingApprovalsUseCase>(() => GetPendingApprovalsUseCase(sl()));
  sl.registerLazySingleton<ApproveStageUseCase>(() => ApproveStageUseCase(sl()));
  sl.registerLazySingleton<RejectStageUseCase>(() => RejectStageUseCase(sl()));

  // Features - Expenses
  // Data sources
  sl.registerLazySingleton<ExpensesRemoteDataSource>(() => ExpensesRemoteDataSourceImpl(sl()));

  // Repositories
  sl.registerLazySingleton<ExpensesRepository>(() => ExpensesRepositoryImpl(remoteDataSource: sl()));

  // Use cases
  sl.registerLazySingleton<GetExpenseClaimsUseCase>(() => GetExpenseClaimsUseCase(sl()));
  sl.registerLazySingleton<GetExpenseClaimByIdUseCase>(() => GetExpenseClaimByIdUseCase(sl()));
  sl.registerLazySingleton<SubmitExpenseClaimUseCase>(() => SubmitExpenseClaimUseCase(sl()));
  sl.registerLazySingleton<UploadReceiptUseCase>(() => UploadReceiptUseCase(sl()));

  // Features - Reimbursements
  // Data sources
  sl.registerLazySingleton<ReimbursementsRemoteDataSource>(() => ReimbursementsRemoteDataSourceImpl(sl()));

  // Repositories
  sl.registerLazySingleton<ReimbursementsRepository>(() => ReimbursementsRepositoryImpl(remoteDataSource: sl()));

  // Use cases
  sl.registerLazySingleton<GetReimbursementsUseCase>(() => GetReimbursementsUseCase(sl()));
}
