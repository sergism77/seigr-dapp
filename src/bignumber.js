import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
//
// // Path: src/bignumber.js
// // The first thing we do is import the React and React Native libraries. We also import the StyleSheet library.
//
// // The next step is to create a StyleSheet object. We will use this to style our component.
//
// // The next step is to create a BigNumber component. We will use this to display a big number.
//
// // The next step is to create a render method. We will use this to render our component.
//
// // The first thing we do is return a View component. We will use this to wrap our component.
//
// // The next step is to return a Text component. We will use this to display the number.
//
// // The last step is to call the render method. We will do this to render our component.
//
//
//
