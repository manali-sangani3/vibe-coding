import 'package:flutter/material.dart';

class AppColors {
  // Common Colors
  static const Color primary = Color(0xFF6366F1); // Indigo Accent
  static const Color primaryLight = Color(0xFF818CF8);
  static const Color primaryDark = Color(0xFF4F46E5);
  
  static const Color secondary = Color(0xFF0EA5E9); // Sky Blue
  static const Color accent = Color(0xFFF43F5E); // Rose
  
  // Status Colors
  static const Color success = Color(0xFF10B981); // Emerald Green
  static const Color warning = Color(0xFFF59E0B); // Amber Orange
  static const Color error = Color(0xFFEF4444); // Red
  static const Color info = Color(0xFF3B82F6); // Blue

  // Light Theme Palette
  static const Color bgLight = Color(0xFFF8FAFC); // Cool Grey Slate
  static const Color surfaceLight = Colors.white;
  static const Color textPrimaryLight = Color(0xFF0F172A); // Slate 900
  static const Color textSecondaryLight = Color(0xFF475569); // Slate 600
  static const Color borderLight = Color(0xFFE2E8F0); // Slate 200

  // Dark Theme Palette
  static const Color bgDark = Color(0xFF0F172A); // Dark Slate 900
  static const Color surfaceDark = Color(0xFF1E293B); // Dark Slate 800
  static const Color textPrimaryDark = Color(0xFFF8FAFC); // Slate 50
  static const Color textSecondaryDark = Color(0xFF94A3B8); // Slate 400
  static const Color borderDark = Color(0xFF334155); // Slate 700

  // Shading / Glassmorphism Effects
  static const Color glassWhite = Color(0x1FFFFFFF);
  static const Color glassBlack = Color(0x1F000000);
}
