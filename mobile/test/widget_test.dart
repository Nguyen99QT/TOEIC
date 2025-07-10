// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:leenglish_mobile/main.dart';

void main() {
  testWidgets('LeEnglish app smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const ProviderScope(child: LeEnglishApp()));

    // Wait for any animations to complete
    await tester.pumpAndSettle();

    // Verify that the app loads with the home screen.
    expect(find.text('LeEnglish TOEIC'), findsOneWidget);
    expect(find.text('Welcome to LeEnglish!'), findsOneWidget);

    // Verify that we can find some key UI elements
    expect(find.byType(MaterialApp), findsOneWidget);
    expect(find.byType(AppBar), findsOneWidget);
  });

  testWidgets('Navigation test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const ProviderScope(child: LeEnglishApp()));

    // Wait for the app to settle
    await tester.pumpAndSettle();

    // The test will verify that the app can be instantiated without errors
    expect(find.byType(LeEnglishApp), findsOneWidget);
    expect(find.byType(Scaffold), findsOneWidget);
  });
}
