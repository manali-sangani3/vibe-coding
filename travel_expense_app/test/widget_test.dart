import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:travel_expense_app/app.dart';
import 'package:travel_expense_app/core/di/injection_container.dart' as di;
import 'package:travel_expense_app/core/storage/secure_storage.dart';

class FakeSecureStorage implements SecureStorage {
  final Map<String, String> _data = {};

  @override
  Future<void> write(String key, String value) async {
    _data[key] = value;
  }

  @override
  Future<String?> read(String key) async {
    return _data[key];
  }

  @override
  Future<void> delete(String key) async {
    _data.remove(key);
  }

  @override
  Future<void> clearAll() async {
    _data.clear();
  }
}

void main() {
  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  testWidgets('App starts and shows Login Page smoke test', (WidgetTester tester) async {
    di.sl.allowReassignment = true;
    await di.init();
    
    // Override real SecureStorage with FakeSecureStorage to avoid native platform channel hanging
    di.sl.registerSingleton<SecureStorage>(FakeSecureStorage());

    await tester.pumpWidget(
      const ProviderScope(
        child: MyApp(),
      ),
    );

    // Let the GoRouter handle the initial redirect
    await tester.pumpAndSettle();

    // Verify that the login header text exists
    expect(find.text('Enterprise Travel'), findsOneWidget);
  });
}
