import React from "react";
import { StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        width: 100,
        height: 100,
        borderRadius: 50,
        borderColor: "#000",
        borderWidth: 1,
        margin: 10
    },
    number: {
        fontSize: 30
    }
});

export default class BigNumber extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.number}>{this.props.number}</Text>
            </View>
        );
    }
}
