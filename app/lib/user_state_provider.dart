import 'package:flutter/cupertino.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:state_machine/state_machine.dart' as SM;

class UserState extends ChangeNotifier {
  String accessKey;

  SM.StateMachine user = new SM.StateMachine('user');

  SM.State isUninitialized;
  SM.State isAnonymous;
  SM.State isAuthenticated;
  SM.State isError;

  SM.StateTransition initialize;
  SM.StateTransition authenticate;
  SM.StateTransition error;
  SM.StateTransition logout;

  UserState() {
    isUninitialized = user.newState('uninitialized');
    isAnonymous = user.newState('anonymous');
    isAuthenticated = user.newState('authenticated');
    isError = user.newState('error');

    initialize = user.newStateTransition('initialize', [isUninitialized], isAnonymous);
    authenticate = user.newStateTransition('authenticate', [isAnonymous, isError], isAuthenticated);
    error = user.newStateTransition('error', [SM.State.any], isError);
    logout = user.newStateTransition('logout', [isAuthenticated], isAnonymous);

    user.start(isUninitialized);

    authenticate.listen((SM.StateChange change) {
      _setAccessKey(change.payload);
    });

    logout.listen((SM.StateChange stateChange) {
      _removeAccessKey();
    });

    _initAccessKey();
  }

  _initAccessKey() async {
    initialize();
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String _accessKey = prefs.getString("access_key");
    if (_accessKey != null) {
      authenticate(_accessKey);
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
