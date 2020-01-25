import 'package:flutter/material.dart';
import 'dart:async';

class DelayedLoader extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return _DelayedLoaderState();
  }
}

class _DelayedLoaderState extends State<DelayedLoader> {
  Future<String> _future;

  @override
  void initState() {
    super.initState();
    _future = Future<String>.delayed(Duration(seconds: 1), () => 'Show loader');
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
        future: _future,
        builder: (context, AsyncSnapshot<String> snapshot) {
          Widget child = Container();

          if (snapshot.hasData) {
            child = RefreshProgressIndicator();
          }
          return child;
        });
  }
}
