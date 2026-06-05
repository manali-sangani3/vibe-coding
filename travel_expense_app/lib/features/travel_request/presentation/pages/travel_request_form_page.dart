import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../providers/travel_request_provider.dart';

class TravelRequestFormPage extends ConsumerStatefulWidget {
  const TravelRequestFormPage({super.key});

  @override
  ConsumerState<TravelRequestFormPage> createState() => _TravelRequestFormPageState();
}

class _TravelRequestFormPageState extends ConsumerState<TravelRequestFormPage> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _destinationController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _costController = TextEditingController();

  String _selectedPurpose = 'Client Meeting';
  DateTime? _startDate;
  DateTime? _endDate;

  final List<String> _purposes = [
    'Client Meeting',
    'Conference',
    'Internal Project',
    'Training',
    'Other'
  ];

  @override
  void dispose() {
    _titleController.dispose();
    _destinationController.dispose();
    _descriptionController.dispose();
    _costController.dispose();
    super.dispose();
  }

  Future<void> _selectStartDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _startDate ?? DateTime.now().add(const Duration(days: 1)),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (picked != null && picked != _startDate) {
      setState(() {
        _startDate = picked;
        if (_endDate != null && _endDate!.isBefore(_startDate!)) {
          _endDate = null;
        }
      });
    }
  }

  Future<void> _selectEndDate(BuildContext context) async {
    if (_startDate == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select a start date first.'),
          behavior: SnackBarBehavior.floating,
        ),
      );
      return;
    }
    
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _endDate ?? _startDate!.add(const Duration(days: 1)),
      firstDate: _startDate!,
      lastDate: _startDate!.add(const Duration(days: 90)),
    );
    if (picked != null && picked != _endDate) {
      setState(() {
        _endDate = picked;
      });
    }
  }

  String _formatDate(DateTime? date) {
    if (date == null) return 'Select Date';
    final months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return '${date.day} ${months[date.month - 1]} ${date.year}';
  }

  void _submitForm() {
    if (!_formKey.currentState!.validate()) return;
    
    if (_startDate == null || _endDate == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select both start and end dates.'),
          behavior: SnackBarBehavior.floating,
        ),
      );
      return;
    }

    final cost = double.tryParse(_costController.text) ?? 0.0;

    ref.read(travelRequestNotifierProvider.notifier).submitRequest(
          title: _titleController.text.trim(),
          destination: _destinationController.text.trim(),
          description: _descriptionController.text.trim(),
          purpose: _selectedPurpose,
          startDate: _startDate!,
          endDate: _endDate!,
          estimatedCost: cost,
        );
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(travelRequestNotifierProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    ref.listen(travelRequestNotifierProvider, (previous, next) {
      if (next.isSubmitted) {
        ref.read(travelRequestNotifierProvider.notifier).resetSubmitFlag();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Travel request submitted successfully!'),
            backgroundColor: AppColors.success,
            behavior: SnackBarBehavior.floating,
          ),
        );
        context.pop();
      }
      
      if (next.errorMessage != null && next.errorMessage != previous?.errorMessage) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(next.errorMessage!),
            backgroundColor: AppColors.error,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    });

    return Scaffold(
      appBar: AppBar(
        title: const Text('New Travel Request'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextFormField(
                controller: _titleController,
                decoration: const InputDecoration(
                  labelText: 'Trip Title / Summary',
                  hintText: 'e.g. Q3 Sales Pitch & Client Review',
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Please enter a trip title.';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _destinationController,
                decoration: const InputDecoration(
                  labelText: 'Destination City & Country',
                  hintText: 'e.g. Bangalore, India',
                  prefixIcon: Icon(Icons.location_on_outlined),
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Please enter a destination.';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                initialValue: _selectedPurpose,
                decoration: const InputDecoration(
                  labelText: 'Purpose of Travel',
                ),
                items: _purposes.map((String purpose) {
                  return DropdownMenuItem<String>(
                    value: purpose,
                    child: Text(purpose),
                  );
                }).toList(),
                onChanged: (value) {
                  if (value != null) {
                    setState(() {
                      _selectedPurpose = value;
                    });
                  }
                },
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: InkWell(
                      onTap: () => _selectStartDate(context),
                      borderRadius: BorderRadius.circular(12),
                      child: InputDecorator(
                        decoration: const InputDecoration(
                          labelText: 'Start Date',
                          prefixIcon: Icon(Icons.date_range_outlined),
                        ),
                        child: Text(
                          _formatDate(_startDate),
                          style: AppTypography.bodyMedium(
                            _startDate == null
                                ? (isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight)
                                : (isDark ? Colors.white : AppColors.textPrimaryLight),
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: InkWell(
                      onTap: () => _selectEndDate(context),
                      borderRadius: BorderRadius.circular(12),
                      child: InputDecorator(
                        decoration: const InputDecoration(
                          labelText: 'End Date',
                          prefixIcon: Icon(Icons.date_range_outlined),
                        ),
                        child: Text(
                          _formatDate(_endDate),
                          style: AppTypography.bodyMedium(
                            _endDate == null
                                ? (isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight)
                                : (isDark ? Colors.white : AppColors.textPrimaryLight),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _costController,
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                decoration: const InputDecoration(
                  labelText: 'Estimated Budget (INR)',
                  hintText: 'e.g. 45000',
                  prefixText: '₹ ',
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Please enter the estimated budget.';
                  }
                  final cost = double.tryParse(value);
                  if (cost == null || cost <= 0) {
                    return 'Please enter a valid positive number.';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _descriptionController,
                maxLines: 4,
                decoration: const InputDecoration(
                  labelText: 'Business Justification / Agenda',
                  hintText: 'Describe why this business travel is required and outline your trip agenda.',
                  alignLabelWithHint: true,
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Please enter a business justification.';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: state.isSubmitting ? null : _submitForm,
                child: state.isSubmitting
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      )
                    : const Text('Submit Request'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
