import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:state_machine/state_machine.dart' as SM;

import '../config.dart';

class UserState extends ChangeNotifier {
  String accessKey;
  String error;

  SM.StateMachine user = new SM.StateMachine('user');

  SM.State isUninitialized;
  SM.State isAnonymous;
  SM.State isAuthenticated;

  SM.StateTransition _initialize;
  SM.StateTransition _authenticate;
  SM.StateTransition _logout;

  UserState() {
    isUninitialized = user.newState('uninitialized');
    isAnonymous = user.newState('anonymous');
    isAuthenticated = user.newState('authenticated');

    _initialize = user.newStateTransition('initialize', [isUninitialized], isAnonymous);
    _authenticate = user.newStateTransition('authenticate', [isAnonymous], isAuthenticated);
    _logout = user.newStateTransition('logout', [isAuthenticated], isAnonymous);

    user.start(isUninitialized);

    _authenticate.listen((SM.StateChange change) {
      _setAccessKey(change.payload);
      error = null;
    });

    _logout.listen((SM.StateChange stateChange) {
      _removeAccessKey();
      error = null;
    });

    _initAccessKey();
  }

  logout() {
    _logout();
  }

  authenticate(String key) async {
    try {
      await _validateAccessKey(key);
      _authenticate(key);
    } catch (e) {
      this.error = e.toString();
      notifyListeners();
    }
  }

  Future<void> _validateAccessKey(String key) async {
    String body = json.encode({'accessKey': key});
    Map<String, String> headers = {'content-type': 'application/json'};
    http.Response response = await http.post('${config['backend']['endpoint']}/login', headers: headers, body: body);
    if (response.statusCode == 200) {
      return;
    } else {
      throw 'Invalid access key';
    }
  }

  _initAccessKey() async {
    _initialize();
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String _accessKey = prefs.getString("access_key");
    if (_accessKey != null) {
      _authenticate(_accessKey);
    }
  }

  _setAccessKey(_accessKey) async {
    accessKey = _accessKey;
    SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.setString("access_key", accessKey);
    notifyListeners();
  }

  _removeAccessKey() async {
    accessKey = null;
    SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.remove("access_key");
    notifyListeners();
  }
}

class UserStateProvider extends StatelessWidget {
  UserStateProvider({@required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) => ChangeNotifierProvider(
        create: (_) => UserState(),
        child: child,
      );
}
