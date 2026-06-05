import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTypography {
  // Title Styles (Outfit Font)
  static TextStyle h1(Color color) => GoogleFonts.outfit(
        fontSize: 32,
        fontWeight: FontWeight.bold,
        color: color,
        letterSpacing: -0.5,
      );

  static TextStyle h2(Color color) => GoogleFonts.outfit(
        fontSize: 24,
        fontWeight: FontWeight.w600,
        color: color,
        letterSpacing: -0.5,
      );

  static TextStyle h3(Color color) => GoogleFonts.outfit(
        fontSize: 20,
        fontWeight: FontWeight.w600,
        color: color,
      );

  static TextStyle subtitle(Color color) => GoogleFonts.outfit(
        fontSize: 16,
        fontWeight: FontWeight.w500,
        color: color,
      );

  // Body Styles (Inter Font)
  static TextStyle bodyLarge(Color color) => GoogleFonts.inter(
        fontSize: 16,
        fontWeight: FontWeight.normal,
        color: color,
        height: 1.5,
      );

  static TextStyle bodyMedium(Color color) => GoogleFonts.inter(
        fontSize: 14,
        fontWeight: FontWeight.normal,
        color: color,
        height: 1.4,
      );

  static TextStyle bodySmall(Color color) => GoogleFonts.inter(
        fontSize: 12,
        fontWeight: FontWeight.normal,
        color: color,
      );

  // Interaction Styles
  static TextStyle buttonText(Color color) => GoogleFonts.inter(
        fontSize: 16,
        fontWeight: FontWeight.w600,
        color: color,
        letterSpacing: 0.5,
      );

  static TextStyle caption(Color color) => GoogleFonts.inter(
        fontSize: 11,
        fontWeight: FontWeight.w500,
        color: color,
      );
}
