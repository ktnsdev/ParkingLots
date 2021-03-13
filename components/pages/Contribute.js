import React, { Component } from 'react';
import { SafeAreaView, Text, StyleSheet, View, Platform, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ContributeMapAndAutocomplete from '../widgets/contribution/ContributeMapAndAutocomplete';
import TextWithFont from '../widgets/TextWithFont';

export default class Contribute extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <View style={styles.titleBackground}>
                    <SafeAreaView />
                    <View style={styles.titleContainer}>
                        <TextWithFont fontSize={36} color={'#fff'} iosFontWeight={'bold'} androidFontWeight={'bold'}>Contribute</TextWithFont>
                        <TextWithFont fontSize={16} color={'#fff'} textTransform={'uppercase'} style={{ ...Platform.select({ 'android': { marginTop: '-1.5%' }})}}>Add a parking lot</TextWithFont>
                        <TextWithFont fontSize={14} color={'#fff'} style={styles.contentText}>We need your contribution in order to build the best parking lot catalogue. By adding your frequently used and well-known parking lot to our database, you're helping others to discover more places and might save them some cash!</TextWithFont>
                    </View>
                </View>

                <ScrollView style={styles.contentContainter}>
                    <TextWithFont fontSize={18} iosFontWeight={'bold'} androidFontWeight={'bold'} style={styles.selectLocationTitle}>Select a location</TextWithFont>
                    <ContributeMapAndAutocomplete navigation={this.props.navigation}/>
                </ScrollView>
            </>
        );
    }
}

const styles = StyleSheet.create({
    titleBackground: {
        backgroundColor: '#ff8f17'
    },
    titleContainer: {
        ...Platform.select({
            'ios': {
                paddingVertical: '5%'
            },
            'android': {
                paddingTop: '10%',
                paddingBottom: '5%'
            }
        }),
        paddingHorizontal: '5%'
    },
    contentContainter: {
        ...Platform.select({
            'ios': {
                paddingVertical: '3%'
            },
            'android': {
                paddingVertical: '0%'
            }
        }),
        paddingHorizontal: '5%'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 36,
        color: '#fff'
    },
    subtitle: {
        fontWeight: '600',
        fontSize: 16,
        textTransform: 'uppercase',
        color: '#fff'
    },
    contentText: {
        color: '#fff',
        marginTop: '4%'
    },
    textInputStyle: {
        height: 50,
        width: '100%',
        paddingHorizontal: '5%',
        backgroundColor: '#ddd',
        borderRadius: 12
    },
    textInputTitle: {
        fontWeight: '600',
        fontSize: 14,
        textTransform: 'uppercase',
        color: '#666',
        marginBottom: '2%'
    },
    textInputContainer: {
        marginTop: '2%',
        marginBottom: '2%'
    },
    lineBreak: {
        borderBottomColor: '#404040',
        borderBottomWidth: 0.5,
        marginTop: "3%",
        marginBottom: "3%"
    },
    selectLocationTitle: {
        ...Platform.select({
            'ios': {
                marginTop: '1%'
            },
            'android': {
                marginTop: '4%'
            }
        })
    },
    autocompleteContainer: {
        zIndex: 10,
    }
});