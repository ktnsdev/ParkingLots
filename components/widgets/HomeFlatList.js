import React, { Component } from 'react';
import { StyleSheet, FlatList, Text, View, TouchableHighlight, Platform, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TextWithFont from './TextWithFont';
import { config } from '../../config';

class HomeFlatList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parkingLots: []
        };
        this.fetchParkingLots = this.fetchParkingLots.bind(this);
        this.onDirectionPressed = this.onDirectionPressed.bind(this);
    }

    componentDidMount() {
        this.fetchParkingLots();
    }
    fetchParkingLots() {
        console.log("starting fetch")
        fetch(config.fetchNearbyParkingLotsURL + config.fetchNearbyParkingLotsURLSecret, {
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then((jsonData) => {
                let tempParkingLots = [];
                for (let i = 0; i < Object.keys(jsonData).length; i++) {
                    if (jsonData[i] == undefined) continue;
                    tempParkingLots.push(jsonData[i]);
                    console.log(jsonData[i])
                }
                console.log(tempParkingLots)
                this.setState({ parkingLots: tempParkingLots });
            })
    }

    onDirectionPressed() {

    }

    render() {
        return (
            <>
                {this.state.parkingLots != undefined &&
                    <FlatList
                        data={this.state.parkingLots}
                        keyExtractor={item => item._id}
                        renderItem={({ item }) => (
                            <>
                                <View style={styles.flatListItemView}>
                                    <TouchableOpacity>
                                        <View>
                                            <View>
                                                <TextWithFont iosFontWeight={'600'} androidFontWeight={'semibold'} fontSize={28}>{item.name.en}</TextWithFont>
                                                {item.price.freeHours > 0 &&
                                                    <TextWithFont fontSize={16}>No charge in the first {item.price.freeHours} hours</TextWithFont>
                                                }
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableHighlight style={styles.directionButtonView} onPress={this.recentre} underlayColor='#ddd' onPress={this.onDirectionPressed}>
                                        <View>
                                            <Icon name='directions' size={28} />
                                        </View>
                                    </TouchableHighlight>
                                </View>
                                <View style={styles.lineBreak} />
                            </>
                        )}
                    />
                }
            </>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flatListItemView: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    lineBreak: {
        borderBottomColor: '#404040',
        borderBottomWidth: 0.5,
        marginTop: "3%",
        marginBottom: "3%"
    },
    directionButtonView: {
        ...Platform.select({
            'ios': {
                marginRight: '1%'
            },
            'android': {
                marginRight: '2%'
            }
        }),
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        height: 40,
        width: 40,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.29,
        shadowRadius: 1,

        elevation: 7,
    }
});

export default HomeFlatList;