import 'package:flutter/cupertino.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

class UserState extends ChangeNotifier {
  String _accessKey;
  bool _isLoaded = false;

  UserState() {
    initState();
  }

  get accessKey {
    return _accessKey;
  }

  get isLoaded {
    return _isLoaded;
  }

  initState() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String accessKey = prefs.getString("access_key");
    if (accessKey != null) {
      setAccessKey(accessKey);
    }
  }

  setAccessKey(accessKey) async {
    _accessKey = accessKey;
    _isLoaded = true;
    SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.setString("access_key", accessKey);
    notifyListeners();
  }

  removeAccessKey() async {
    _accessKey = null;
    SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.remove("access_key");
    notifyListeners();
  }
}

class UserStateProvider extends StatelessWidget {
  UserStateProvider({@required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
        create: (_) => UserState(),
        child: child,
      );
  }
}
