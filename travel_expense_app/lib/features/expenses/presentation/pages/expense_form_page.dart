import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../travel_request/presentation/providers/travel_request_provider.dart';
import '../../domain/entities/expense_claim_entity.dart';
import '../providers/expenses_provider.dart';

class ExpenseFormPage extends ConsumerStatefulWidget {
  const ExpenseFormPage({super.key});

  @override
  ConsumerState<ExpenseFormPage> createState() => _ExpenseFormPageState();
}

class _ExpenseFormPageState extends ConsumerState<ExpenseFormPage> {
  String? _selectedTravelRequestId;
  final List<_ExpenseItemFormModel> _items = [];
  final _formKey = GlobalKey<FormState>();

  @override
  void initState() {
    super.initState();
    // Start with 1 item row
    _addItemRow();
    // Load travel requests to populate the dropdown
    Future.microtask(() {
      ref.read(travelRequestNotifierProvider.notifier).loadTravelRequests();
    });
  }

  void _addItemRow() {
    setState(() {
      _items.add(
        _ExpenseItemFormModel(
          category: 'meals',
          amountController: TextEditingController(),
          descriptionController: TextEditingController(),
        ),
      );
    });
  }

  void _removeItemRow(int index) {
    if (_items.length > 1) {
      setState(() {
        _items[index].amountController.dispose();
        _items[index].descriptionController.dispose();
        _items.removeAt(index);
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('An expense claim must have at least one item.'),
          backgroundColor: AppColors.warning,
        ),
      );
    }
  }

  @override
  void dispose() {
    for (final item in _items) {
      item.amountController.dispose();
      item.descriptionController.dispose();
    }
    super.dispose();
  }

  // Opens a beautiful modal dialog to select a simulated file
  void _pickSimulatedReceipt(int index) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        final isDark = Theme.of(context).brightness == Brightness.dark;
        final mockFiles = [
          {'name': 'uber_receipt_taxi.png', 'type': 'image/png'},
          {'name': 'sheraton_hotel_invoice.pdf', 'type': 'application/pdf'},
          {'name': 'restaurant_bill_meals.jpg', 'type': 'image/jpeg'},
          {'name': 'train_ticket_travel.pdf', 'type': 'application/pdf'},
        ];

        return Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Select Mock Receipt File',
                style: AppTypography.h3(
                  isDark ? Colors.white : AppColors.textPrimaryLight,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Choose a simulated document/image to attach to this expense item.',
                style: AppTypography.bodySmall(
                  isDark
                      ? AppColors.textSecondaryDark
                      : AppColors.textSecondaryLight,
                ),
              ),
              const SizedBox(height: 16),
              ...mockFiles.map((file) {
                return ListTile(
                  leading: Icon(
                    file['name']!.endsWith('.pdf')
                        ? Icons.picture_as_pdf_rounded
                        : Icons.image_rounded,
                    color: AppColors.primary,
                  ),
                  title: Text(
                    file['name']!,
                    style: AppTypography.bodyMedium(
                      isDark ? Colors.white : AppColors.textPrimaryLight,
                    ),
                  ),
                  subtitle: Text(file['type']!),
                  onTap: () {
                    Navigator.pop(context);
                    setState(() {
                      // Simulating successful upload response by assigning a dummy MinIO-like URL
                      _items[index].receiptUrl =
                          'http://localhost:9000/travel-receipts/${file['name']}';
                      _items[index].receiptName = file['name'];
                      _items[index].errorMessage =
                          null; // Clear error if receipt selected
                    });
                  },
                );
              }),
              const SizedBox(height: 8),
            ],
          ),
        );
      },
    );
  }

  void _submitClaim() {
    if (!(_formKey.currentState?.validate() ?? false)) {
      return;
    }

    // Verify business rules:
    // 1. Amount > 0 check (enforced via TextFormField validators too)
    // 2. Receipt mandatory if amount > ₹500
    bool hasErrors = false;
    for (int i = 0; i < _items.length; i++) {
      final item = _items[i];
      final amount = double.tryParse(item.amountController.text) ?? 0.0;

      if (amount <= 0) {
        setState(() {
          item.errorMessage = 'Amount must be greater than zero.';
        });
        hasErrors = true;
      } else if (amount > 500 &&
          (item.receiptUrl == null || (item.receiptUrl?.isEmpty ?? true))) {
        setState(() {
          item.errorMessage =
              'Receipt attachment is mandatory for expenses exceeding ₹500.';
        });
        hasErrors = true;
      } else {
        setState(() {
          item.errorMessage = null;
        });
      }
    }

    if (hasErrors) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please correct policy violations in your items list.'),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    // Prepare items payload
    final claimItems = _items.map((item) {
      final amount = double.parse(item.amountController.text);
      return ExpenseItemEntity(
        id: '', // backend assigns ID
        category: item.category,
        amount: amount,
        description: item.descriptionController.text.trim(),
        receiptUrl: item.receiptUrl,
      );
    }).toList();

    ref
        .read(expensesNotifierProvider.notifier)
        .submitClaim(
          travelRequestId: _selectedTravelRequestId,
          items: claimItems,
        );
  }

  @override
  Widget build(BuildContext context) {
    final travelRequestsState = ref.watch(travelRequestNotifierProvider);
    final expensesState = ref.watch(expensesNotifierProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    // Filter for approved travel requests within the 30-day window
    final now = DateTime.now();
    final approvedRequests = travelRequestsState.requests
        .where((req) {
          if (req.status.toLowerCase() != 'approved') return false;
          final diffDays = now.difference(req.endDate).inDays;
          return diffDays <= 30;
        })
        .toList();

    ref.listen<ExpensesState>(expensesNotifierProvider, (previous, next) {
      if (next.isSubmitted) {
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (context.mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Expense claim submitted successfully!'),
                backgroundColor: AppColors.success,
              ),
            );
            ref.read(expensesNotifierProvider.notifier).resetSubmitFlag();
            context.pop(); // Go back to list
          }
        });
      }
      if (next.errorMessage != null &&
          next.errorMessage != previous?.errorMessage) {
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (context.mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(next.errorMessage ?? ''),
                backgroundColor: AppColors.error,
              ),
            );
          }
        });
      }
    });

    return Scaffold(
      appBar: AppBar(title: const Text('Submit Expense Claim')),
      body: Form(
        key: _formKey,
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Dropdown for associated approved travel requests
                Text(
                  'Associated Travel Request',
                  style: AppTypography.subtitle(
                    isDark ? Colors.white : AppColors.textPrimaryLight,
                  ).copyWith(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                DropdownButtonFormField<String?>(
                  initialValue: _selectedTravelRequestId,
                  hint: const Text('Select approved travel request (Optional)'),
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    contentPadding: EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 8,
                    ),
                  ),
                  items: [
                    const DropdownMenuItem<String?>(
                      value: null,
                      child: Text(
                        'No associated travel request (General Expense)',
                        overflow: TextOverflow.ellipsis,
                        maxLines: 1,
                      ),
                    ),
                    ...approvedRequests.map((req) {
                      return DropdownMenuItem<String?>(
                        value: req.id,
                        child: Text(
                          '${req.title} (ID: ${req.id.substring(0, 8)})',
                        ),
                      );
                    }),
                  ],
            
                  selectedItemBuilder: (context) {
                    return [
                      const Text(
                        'General Expense',
                        overflow: TextOverflow.ellipsis,
                      ),
                      ...approvedRequests.map(
                        (req) => Text(req.title, overflow: TextOverflow.ellipsis),
                      ),
                    ];
                  },
                  onChanged: (val) {
                    setState(() {
                      _selectedTravelRequestId = val;
                    });
                  },
                ),
                const SizedBox(height: 24),
            
                // Header for Itemized list
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Itemized Expenses',
                      style: AppTypography.h3(
                        isDark ? Colors.white : AppColors.textPrimaryLight,
                      ),
                    ),
                    TextButton.icon(
                      onPressed: _addItemRow,
                      icon: const Icon(Icons.add_rounded),
                      label: const Text('Add Item'),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
            
                // Item Row cards
                Column(
                  children: List.generate(_items.length, (index) {
                    final item = _items[index];
                    return Card(
                      margin: const EdgeInsets.only(bottom: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                        side: BorderSide(
                          color: item.errorMessage != null
                              ? AppColors.error
                              : Colors.transparent,
                          width: 1.5,
                        ),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Item #${index + 1}',
                                  style: AppTypography.subtitle(
                                    isDark
                                        ? Colors.white
                                        : AppColors.textPrimaryLight,
                                  ).copyWith(fontWeight: FontWeight.bold),
                                ),
                                IconButton(
                                  icon: const Icon(
                                    Icons.delete_outline_rounded,
                                    color: AppColors.error,
                                  ),
                                  onPressed: () => _removeItemRow(index),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
            
                            // Category Dropdown
                            DropdownButtonFormField<String>(
                              initialValue: item.category,
                              decoration: const InputDecoration(
                                labelText: 'Category',
                                border: OutlineInputBorder(),
                              ),
                              items: const [
                                DropdownMenuItem(
                                  value: 'meals',
                                  child: Text('Meals'),
                                ),
                                DropdownMenuItem(
                                  value: 'lodging',
                                  child: Text('Lodging'),
                                ),
                                DropdownMenuItem(
                                  value: 'transport',
                                  child: Text('Transport'),
                                ),
                                DropdownMenuItem(
                                  value: 'other',
                                  child: Text('Other'),
                                ),
                              ],
                              onChanged: (val) {
                                setState(() {
                                  item.category = val ?? 'meals';
                                });
                              },
                            ),
                            const SizedBox(height: 12),
            
                            // Amount Input
                            TextFormField(
                              controller: item.amountController,
                              keyboardType: const TextInputType.numberWithOptions(
                                decimal: true,
                              ),
                              decoration: const InputDecoration(
                                labelText: 'Amount (INR)',
                                prefixText: '₹ ',
                                border: OutlineInputBorder(),
                              ),
                              validator: (value) {
                                if (value == null || value.trim().isEmpty) {
                                  return 'Please enter item amount.';
                                }
                                final amt = double.tryParse(value);
                                if (amt == null || amt <= 0) {
                                  return 'Amount must be greater than zero.';
                                }
                                return null;
                              },
                              onChanged: (val) {
                                // Dynamically refresh mandatory receipt alert based on amount
                                setState(() {});
                              },
                            ),
                            const SizedBox(height: 12),
            
                            // Description Input
                            TextFormField(
                              controller: item.descriptionController,
                              decoration: const InputDecoration(
                                labelText: 'Description / Remarks',
                                border: OutlineInputBorder(),
                              ),
                              validator: (value) {
                                if (value == null || value.trim().isEmpty) {
                                  return 'Please enter a description.';
                                }
                                return null;
                              },
                            ),
                            const SizedBox(height: 16),
            
                            // Receipt Attachment status
                            Row(
                              children: [
                                Expanded(
                                  child: ElevatedButton.icon(
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: AppColors.primary
                                          .withValues(alpha: 0.1),
                                      foregroundColor: AppColors.primary,
                                      elevation: 0,
                                    ),
                                    onPressed: () => _pickSimulatedReceipt(index),
                                    icon: const Icon(Icons.attach_file_rounded),
                                    label: Text(
                                      item.receiptUrl != null
                                          ? 'Change Receipt'
                                          : 'Attach Receipt',
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Text(
                                    item.receiptName ?? 'No file selected',
                                    overflow: TextOverflow.ellipsis,
                                    style: AppTypography.bodySmall(
                                      item.receiptUrl != null
                                          ? AppColors.success
                                          : (isDark
                                                ? AppColors.textSecondaryDark
                                                : AppColors.textSecondaryLight),
                                    ),
                                  ),
                                ),
                              ],
                            ),
            
                            // Policy Hint: if amount > 500, highlight receipt required
                            Builder(
                              builder: (context) {
                                final amt =
                                    double.tryParse(item.amountController.text) ??
                                    0.0;
                                if (amt > 500) {
                                  return Padding(
                                    padding: const EdgeInsets.only(top: 8.0),
                                    child: Row(
                                      children: [
                                        const Icon(
                                          Icons.warning_amber_rounded,
                                          color: AppColors.warning,
                                          size: 16,
                                        ),
                                        const SizedBox(width: 6),
                                        Expanded(
                                          child: Text(
                                            'Receipt required: amount exceeds ₹500.',
                                            style:
                                                AppTypography.bodySmall(
                                                  AppColors.warning,
                                                ).copyWith(
                                                  fontWeight: FontWeight.w600,
                                                ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  );
                                }
                                return const SizedBox.shrink();
                              },
                            ),
            
                            // Individual policy error message
                            if (item.errorMessage != null)
                              Padding(
                                padding: const EdgeInsets.only(top: 8.0),
                                child: Text(
                                  item.errorMessage ?? '',
                                  style: AppTypography.bodySmall(
                                    AppColors.error,
                                  ).copyWith(fontWeight: FontWeight.bold),
                                ),
                              ),
                          ],
                        ),
                      ),
                    );
                  }),
                ),
                const SizedBox(height: 16),
            
                // Submit Button
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  onPressed: expensesState.isSubmitting ? null : _submitClaim,
                  child: expensesState.isSubmitting
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text(
                          'Submit Claim',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _ExpenseItemFormModel {
  String category;
  final TextEditingController amountController;
  final TextEditingController descriptionController;
  String? receiptUrl;
  String? receiptName;
  String? errorMessage;

  _ExpenseItemFormModel({
    required this.category,
    required this.amountController,
    required this.descriptionController,
  });
}
