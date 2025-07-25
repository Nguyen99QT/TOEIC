import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:toeic_mobile/core/theme/app_theme.dart';

// Modern Text Field Component
class ModernTextField extends StatefulWidget {
  final String? label;
  final String? hint;
  final String? initialValue;
  final IconData? prefixIcon;
  final IconData? suffixIcon;
  final bool obscureText;
  final TextInputType keyboardType;
  final List<TextInputFormatter>? inputFormatters;
  final String? Function(String?)? validator;
  final void Function(String)? onChanged;
  final void Function()? onSuffixIconTap;
  final TextEditingController? controller;
  final bool enabled;
  final int maxLines;
  final int? maxLength;
  final bool showCounter;
  final FocusNode? focusNode;
  final Color? fillColor;
  final EdgeInsetsGeometry? contentPadding;

  const ModernTextField({
    super.key,
    this.label,
    this.hint,
    this.initialValue,
    this.prefixIcon,
    this.suffixIcon,
    this.obscureText = false,
    this.keyboardType = TextInputType.text,
    this.inputFormatters,
    this.validator,
    this.onChanged,
    this.onSuffixIconTap,
    this.controller,
    this.enabled = true,
    this.maxLines = 1,
    this.maxLength,
    this.showCounter = false,
    this.focusNode,
    this.fillColor,
    this.contentPadding,
  });

  @override
  State<ModernTextField> createState() => _ModernTextFieldState();
}

class _ModernTextFieldState extends State<ModernTextField>
    with SingleTickerProviderStateMixin {
  late FocusNode _focusNode;
  late AnimationController _animationController;
  late Animation<Color?> _borderColorAnimation;
  bool _isFocused = false;

  @override
  void initState() {
    super.initState();
    _focusNode = widget.focusNode ?? FocusNode();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 200),
      vsync: this,
    );

    _borderColorAnimation = ColorTween(
      begin: AppTheme.getBorderColor(context),
      end: AppTheme.primaryColor,
    ).animate(_animationController);

    _focusNode.addListener(() {
      setState(() {
        _isFocused = _focusNode.hasFocus;
      });

      if (_isFocused) {
        _animationController.forward();
      } else {
        _animationController.reverse();
      }
    });
  }

  @override
  void dispose() {
    if (widget.focusNode == null) {
      _focusNode.dispose();
    }
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (widget.label != null) ...[
          Text(
            widget.label!,
            style: Theme.of(context).textTheme.labelLarge?.copyWith(
                  color: AppTheme.getTextColor(context),
                  fontWeight: FontWeight.w600,
                ),
          ),
          const SizedBox(height: 8),
        ],
        AnimatedBuilder(
          animation: _borderColorAnimation,
          builder: (context, child) {
            return TextFormField(
              controller: widget.controller,
              focusNode: _focusNode,
              initialValue:
                  widget.controller == null ? widget.initialValue : null,
              obscureText: widget.obscureText,
              keyboardType: widget.keyboardType,
              inputFormatters: widget.inputFormatters,
              validator: widget.validator,
              onChanged: widget.onChanged,
              enabled: widget.enabled,
              maxLines: widget.maxLines,
              maxLength: widget.maxLength,
              buildCounter: widget.showCounter
                  ? null
                  : (_,
                          {required currentLength,
                          required isFocused,
                          maxLength}) =>
                      null,
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: AppTheme.getTextColor(context),
                  ),
              decoration: InputDecoration(
                hintText: widget.hint,
                hintStyle: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      color: AppTheme.getSecondaryTextColor(context)
                          .withOpacity(0.6),
                    ),
                prefixIcon: widget.prefixIcon != null
                    ? Container(
                        margin: const EdgeInsets.only(left: 12, right: 8),
                        child: Icon(
                          widget.prefixIcon,
                          color: _isFocused
                              ? AppTheme.primaryColor
                              : AppTheme.getSecondaryTextColor(context),
                          size: 20,
                        ),
                      )
                    : null,
                suffixIcon: widget.suffixIcon != null
                    ? GestureDetector(
                        onTap: widget.onSuffixIconTap,
                        child: Container(
                          margin: const EdgeInsets.only(right: 12),
                          child: Icon(
                            widget.suffixIcon,
                            color: _isFocused
                                ? AppTheme.primaryColor
                                : AppTheme.getSecondaryTextColor(context),
                            size: 20,
                          ),
                        ),
                      )
                    : null,
                filled: true,
                fillColor: widget.fillColor ??
                    (_isFocused
                        ? AppTheme.primaryColor.withOpacity(0.05)
                        : AppTheme.getSurfaceColor(context)),
                contentPadding: widget.contentPadding ??
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(
                    color: AppTheme.getBorderColor(context),
                    width: 1,
                  ),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(
                    color: _borderColorAnimation.value ?? AppTheme.primaryColor,
                    width: 2,
                  ),
                ),
                errorBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(
                    color: AppTheme.errorColor,
                    width: 1,
                  ),
                ),
                focusedErrorBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(
                    color: AppTheme.errorColor,
                    width: 2,
                  ),
                ),
                disabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(
                    color: AppTheme.getBorderColor(context).withOpacity(0.5),
                    width: 1,
                  ),
                ),
              ),
            );
          },
        ),
      ],
    );
  }
}

// Modern Button Component
class ModernButton extends StatefulWidget {
  final String text;
  final VoidCallback? onPressed;
  final IconData? icon;
  final Color? backgroundColor;
  final Color? textColor;
  final double? width;
  final double? height;
  final bool isLoading;
  final bool isOutlined;
  final bool isGradient;
  final List<Color>? gradientColors;
  final double borderRadius;
  final EdgeInsetsGeometry? padding;

  const ModernButton({
    super.key,
    required this.text,
    this.onPressed,
    this.icon,
    this.backgroundColor,
    this.textColor,
    this.width,
    this.height = 52,
    this.isLoading = false,
    this.isOutlined = false,
    this.isGradient = false,
    this.gradientColors,
    this.borderRadius = 12,
    this.padding,
  });

  @override
  State<ModernButton> createState() => _ModernButtonState();
}

class _ModernButtonState extends State<ModernButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 100),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 0.95,
    ).animate(_animationController);
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  void _onTapDown(TapDownDetails details) {
    _animationController.forward();
  }

  void _onTapUp(TapUpDetails details) {
    _animationController.reverse();
  }

  void _onTapCancel() {
    _animationController.reverse();
  }

  @override
  Widget build(BuildContext context) {
    final isEnabled = widget.onPressed != null && !widget.isLoading;

    return AnimatedBuilder(
      animation: _scaleAnimation,
      builder: (context, child) {
        return Transform.scale(
          scale: _scaleAnimation.value,
          child: GestureDetector(
            onTapDown: isEnabled ? _onTapDown : null,
            onTapUp: isEnabled ? _onTapUp : null,
            onTapCancel: isEnabled ? _onTapCancel : null,
            onTap: isEnabled ? widget.onPressed : null,
            child: Container(
              width: widget.width,
              height: widget.height,
              padding: widget.padding ??
                  const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              decoration: BoxDecoration(
                color: widget.isOutlined
                    ? Colors.transparent
                    : (widget.backgroundColor ?? AppTheme.primaryColor),
                gradient: widget.isGradient && !widget.isOutlined
                    ? LinearGradient(
                        colors: widget.gradientColors ??
                            [
                              AppTheme.primaryColor,
                              AppTheme.primaryColor.withOpacity(0.8)
                            ],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      )
                    : null,
                borderRadius: BorderRadius.circular(widget.borderRadius),
                border: widget.isOutlined
                    ? Border.all(
                        color: widget.backgroundColor ?? AppTheme.primaryColor,
                        width: 2,
                      )
                    : null,
                boxShadow: !widget.isOutlined && isEnabled
                    ? [
                        BoxShadow(
                          color:
                              (widget.backgroundColor ?? AppTheme.primaryColor)
                                  .withOpacity(0.3),
                          blurRadius: 8,
                          offset: const Offset(0, 4),
                        ),
                      ]
                    : null,
              ),
              child: widget.isLoading
                  ? Center(
                      child: SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(
                            widget.textColor ?? Colors.white,
                          ),
                        ),
                      ),
                    )
                  : Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        if (widget.icon != null) ...[
                          Icon(
                            widget.icon,
                            color: widget.isOutlined
                                ? (widget.backgroundColor ??
                                    AppTheme.primaryColor)
                                : (widget.textColor ?? Colors.white),
                            size: 20,
                          ),
                          const SizedBox(width: 8),
                        ],
                        Text(
                          widget.text,
                          style:
                              Theme.of(context).textTheme.labelLarge?.copyWith(
                                    color: widget.isOutlined
                                        ? (widget.backgroundColor ??
                                            AppTheme.primaryColor)
                                        : (widget.textColor ?? Colors.white),
                                    fontWeight: FontWeight.w600,
                                  ),
                        ),
                      ],
                    ),
            ),
          ),
        );
      },
    );
  }
}

// Modern Dropdown Component
class ModernDropdown<T> extends StatefulWidget {
  final String? label;
  final String? hint;
  final T? value;
  final List<DropdownMenuItem<T>> items;
  final void Function(T?)? onChanged;
  final String? Function(T?)? validator;
  final IconData? prefixIcon;
  final bool enabled;

  const ModernDropdown({
    super.key,
    this.label,
    this.hint,
    this.value,
    required this.items,
    this.onChanged,
    this.validator,
    this.prefixIcon,
    this.enabled = true,
  });

  @override
  State<ModernDropdown<T>> createState() => _ModernDropdownState<T>();
}

class _ModernDropdownState<T> extends State<ModernDropdown<T>> {
  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (widget.label != null) ...[
          Text(
            widget.label!,
            style: Theme.of(context).textTheme.labelLarge?.copyWith(
                  color: AppTheme.getTextColor(context),
                  fontWeight: FontWeight.w600,
                ),
          ),
          const SizedBox(height: 8),
        ],
        DropdownButtonFormField<T>(
          value: widget.value,
          items: widget.items,
          onChanged: widget.enabled ? widget.onChanged : null,
          validator: widget.validator,
          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                color: AppTheme.getTextColor(context),
              ),
          decoration: InputDecoration(
            hintText: widget.hint,
            hintStyle: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  color:
                      AppTheme.getSecondaryTextColor(context).withOpacity(0.6),
                ),
            prefixIcon: widget.prefixIcon != null
                ? Icon(
                    widget.prefixIcon,
                    color: AppTheme.getSecondaryTextColor(context),
                    size: 20,
                  )
                : null,
            filled: true,
            fillColor: AppTheme.getSurfaceColor(context),
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide.none,
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(
                color: AppTheme.getBorderColor(context),
                width: 1,
              ),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(
                color: AppTheme.primaryColor,
                width: 2,
              ),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(
                color: AppTheme.errorColor,
                width: 1,
              ),
            ),
            focusedErrorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(
                color: AppTheme.errorColor,
                width: 2,
              ),
            ),
          ),
          dropdownColor: AppTheme.getSurfaceColor(context),
          borderRadius: BorderRadius.circular(12),
          elevation: 8,
        ),
      ],
    );
  }
}

// Modern Search Field
class ModernSearchField extends StatefulWidget {
  final String? hint;
  final void Function(String)? onChanged;
  final void Function(String)? onSubmitted;
  final VoidCallback? onClear;
  final TextEditingController? controller;
  final bool autofocus;

  const ModernSearchField({
    super.key,
    this.hint,
    this.onChanged,
    this.onSubmitted,
    this.onClear,
    this.controller,
    this.autofocus = false,
  });

  @override
  State<ModernSearchField> createState() => _ModernSearchFieldState();
}

class _ModernSearchFieldState extends State<ModernSearchField> {
  late TextEditingController _controller;
  bool _hasText = false;

  @override
  void initState() {
    super.initState();
    _controller = widget.controller ?? TextEditingController();
    _hasText = _controller.text.isNotEmpty;
    _controller.addListener(() {
      setState(() {
        _hasText = _controller.text.isNotEmpty;
      });
    });
  }

  @override
  void dispose() {
    if (widget.controller == null) {
      _controller.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.getSurfaceColor(context),
        borderRadius: BorderRadius.circular(25),
        border: Border.all(
          color: AppTheme.getBorderColor(context),
          width: 1,
        ),
        boxShadow: AppTheme.lightShadow,
      ),
      child: TextField(
        controller: _controller,
        autofocus: widget.autofocus,
        onChanged: widget.onChanged,
        onSubmitted: widget.onSubmitted,
        style: Theme.of(context).textTheme.bodyLarge?.copyWith(
              color: AppTheme.getTextColor(context),
            ),
        decoration: InputDecoration(
          hintText: widget.hint ?? 'Search...',
          hintStyle: Theme.of(context).textTheme.bodyLarge?.copyWith(
                color: AppTheme.getSecondaryTextColor(context).withOpacity(0.6),
              ),
          prefixIcon: Icon(
            Icons.search,
            color: AppTheme.getSecondaryTextColor(context),
            size: 20,
          ),
          suffixIcon: _hasText
              ? GestureDetector(
                  onTap: () {
                    _controller.clear();
                    widget.onClear?.call();
                  },
                  child: Icon(
                    Icons.clear,
                    color: AppTheme.getSecondaryTextColor(context),
                    size: 20,
                  ),
                )
              : null,
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 20,
            vertical: 16,
          ),
        ),
      ),
    );
  }
}
