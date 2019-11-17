import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

class SearchBar extends StatelessWidget {
  const SearchBar({
    @required this.controller,
    @required this.focusNode,
  });

  final TextEditingController controller;
  final FocusNode focusNode;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: 4,
        vertical: 8,
      ),
      child: Row(
        children: [
          const Icon(
            Icons.search,
          ),
          Expanded(
            child: TextField(
              controller: controller,
              focusNode: focusNode,
            ),
          ),
          GestureDetector(
            onTap: controller.clear,
            child: const Icon(
              Icons.clear,
            ),
          ),
        ],
      ),
    );
  }
}
