import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import HomeFlatList from './HomeFlatList'
import TextWithFont from './TextWithFont';

export default function HomeBottomSheetComponents(props) {
    return (
        <>
            <View style={styles.handleViewContainer}>
                <View style={styles.handleView}/>
            </View>
            <View>
                <View style={styles.titleView}>
                    <TextWithFont fontSize={28} iosFontWeight={'bold'} androidFontWeight={'bold'}>🅿️ Nearby</TextWithFont>
                </View>

                <View style={styles.lineBreak} />
            </View>
            <View style={styles.homeFlatListContainer}>
                <HomeFlatList navigation={props.navigation} />
            </View>
            <SafeAreaView/>
        </>
    );
}

const styles = StyleSheet.create({
    handleViewContainer: {
        width: '100%',
        height: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '-4.5%',
        marginBottom: '4%'
    },
    handleView: {
        width: 50,
        height: 5,
        backgroundColor: '#ddd',
        borderRadius: 10
    },
    titleView: {
        marginTop: '-2%',
        alignItems: 'center'
    },
    homeFlatListContainer: {
        marginBottom: '2%'
    },
    lineBreak: {
        borderBottomColor: '#404040',
        borderBottomWidth: 0.5,
        marginTop: "3%",
        marginBottom: "3%"
    },

});