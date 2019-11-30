import React from "react";
import {
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList
} from "react-native";
import PropTypes from "prop-types";
import FloorCell from "./FloorCell";

export default class FloorListView extends React.Component {
  _renderItem = ({ item, index }) => (
    <FloorCell
      key={index}
      item={item}
      onSelectItem={data => this.props.onSelectItem(data)}
    />
  );

  render() {
    return (
      <View style={styles.listContainer}>
        <Text style={styles.titleText}>Floors</Text>
        <FlatList
          data={this.props.items}
          keyExtractor={item => item.id}
          renderItem={this._renderItem}
        />

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => this.props.onClose()}
        >
          <Image
            style={styles.closeImage}
            source={require("./../assets/images/close_icon.png")}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

FloorListView.propTypes = {
  items: PropTypes.array,
  onSelectItem: PropTypes.func,
  onClose: PropTypes.func
};

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: "white",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 300,
    zIndex: 2,

    shadowColor: "#000",
    shadowOffset: {
      width: -5,
      height: 0
    },

    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10
  },

  titleText: {
    fontFamily: "FuturaPT-Bold",
    color: "black",
    fontSize: 18,
    textAlign: "center",
    paddingTop: 15,
    paddingBottom: 15
  },

  closeButton: {
    position: "absolute",
    right: 10,
    top: 10
  },

  closeImage: {
    width: 25,
    height: 25
  }
});
