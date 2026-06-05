import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'app.dart';
import 'core/di/injection_container.dart' as di;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Hive local database
  await Hive.initFlutter();
  
  // Initialize Dependency Injection Container
  await di.init();
  
  runApp(
    const ProviderScope(
      child: MyApp(),
    ),
  );
}
