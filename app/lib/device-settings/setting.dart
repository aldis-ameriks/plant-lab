import 'package:flutter/material.dart';

class Setting extends StatefulWidget {
  const Setting({@required this.text, @required this.value, this.readonly: false, this.onSubmit, this.loading = false});

  final String text;
  final String value;
  final bool readonly;
  final Function onSubmit;
  final bool loading;

  @override
  _SettingState createState() => _SettingState();
}

class _SettingState extends State<Setting> {
  TextEditingController myController;

  @override
  void dispose() {
    myController.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    myController = new TextEditingController(text: widget.value);
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        Divider(),
        GestureDetector(
          onTap: () {
            if (widget.readonly) {
              return;
            }
            showDialog(
                context: context,
                builder: (context) {
                  return AlertDialog(
                      actions: <Widget>[
                        FlatButton(
                          child: Text('Cancel', style: TextStyle(color: Colors.black)),
                          onPressed: () {
                            Navigator.of(context).pop();
                          },
                        ),
                        FlatButton(
                          child: Text('Submit', style: TextStyle(color: Colors.black)),
                          onPressed: () {
                            widget.onSubmit(myController.text);
                            Navigator.of(context).pop();
                          },
                        )
                      ],
                      title: Text('Update ${widget.text}'),
                      content: Form(
                        key: GlobalKey(),
                        child: Padding(padding: EdgeInsets.all(8.0), child: TextFormField(controller: myController)),
                      ));
                });
          },
          child: Padding(
            padding: const EdgeInsets.all(8.0),
            child: Flex(
              direction: Axis.horizontal,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                Text(widget.text),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: <Widget>[
                    if (widget.loading)
                      Container(
                        margin: EdgeInsets.only(right: 6),
                        height: 12,
                        width: 12,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      ),
                    Padding(
                        padding: EdgeInsets.only(right: 10),
                        child: Container(
                          constraints: BoxConstraints(maxWidth: 180),
                          child: Text(myController.text ?? '',
                              overflow: TextOverflow.ellipsis, textAlign: TextAlign.right),
                        )),
                    Opacity(opacity: widget.readonly ? 0 : 1, child: Icon(Icons.chevron_right, color: Colors.grey[600]))
                  ],
                ),
              ],
            ),
          ),
        )
      ],
    );
  }
}
