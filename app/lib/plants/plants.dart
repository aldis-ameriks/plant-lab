import 'package:flutter/material.dart';
import 'package:planty/plants/plant_details.dart';
import 'package:planty/plants/search_input.dart';
import 'package:planty/queries.dart';

class Plants extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return _PlantsState();
  }
}

class _PlantsState extends State<Plants> {
  TextEditingController _controller;
  FocusNode _focusNode;
  String _filter = '';

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController()..addListener(_onTextChanged);
    _focusNode = FocusNode();
  }

  @override
  void dispose() {
    _focusNode.dispose();
    _controller.dispose();
    super.dispose();
  }

  void _onTextChanged() {
    setState(() {
      _filter = _controller.text;
    });
  }

  Widget _buildSearchBox() {
    return Padding(
      padding: const EdgeInsets.all(8),
      child: SearchBar(
        controller: _controller,
        focusNode: _focusNode,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(title: Text('Plants')),
        body: PlantsQuery(builder: (result) {
          dynamic plants = result['plants']
              .where((plant) => _filter == '' || plant['name'].toLowerCase().contains(_filter.toLowerCase()))
              .toList();

          return Column(
            children: <Widget>[
              _buildSearchBox(),
              Expanded(
                child: ListView.separated(
                    padding: const EdgeInsets.all(10),
                    itemCount: plants.length,
                    separatorBuilder: (BuildContext context, int index) => const Divider(),
                    itemBuilder: (BuildContext context, int index) {
                      return GestureDetector(
                        behavior: HitTestBehavior.opaque,
                        onTap: () => Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => PlantDetails(plantId: plants[index]['id'])),
                        ),
                        child: Flex(
                          direction: Axis.horizontal,
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: <Widget>[
                            Row(
                              children: <Widget>[
                                Image(
                                  image: AssetImage('assets/plant.jpg'),
                                  width: 70,
                                  height: 70,
                                ),
                                Padding(
                                  padding: const EdgeInsets.only(left: 20),
                                  child: Text(plants[index]['name']),
                                )
                              ],
                            ),
                            Icon(
                              Icons.chevron_right,
                              color: Colors.grey[600],
                            ),
                          ],
                        ),
                      );
                    }),
              )
            ],
          );
        }));
  }
}
