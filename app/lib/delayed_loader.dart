import 'dart:async';

import 'package:flutter/material.dart';

class DelayedLoader extends StatefulWidget {
  DelayedLoader({this.delay = 500});

  final int delay;

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
    _future = Future<String>.delayed(Duration(milliseconds: widget.delay), () => 'Show loader');
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
