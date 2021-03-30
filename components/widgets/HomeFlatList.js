import React, { Component } from 'react';
import { StyleSheet, FlatList, Text, View, TouchableHighlight, Platform, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TextWithFont from './TextWithFont';
import { config } from '../../config';

class HomeFlatList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            verifiedParkingLots: [],
            notVerifiedParkingLots: [],
            verifiedParkingLotsFreeTime: {},
            notVerifiedParkingLotsFreeTime: {}
        };
        this.fetchParkingLots = this.fetchParkingLots.bind(this);
        this.onDirectionPressed = this.onDirectionPressed.bind(this);
        this.onParkingLotNamePressed = this.onParkingLotNamePressed.bind(this);
        this.reformatFreeTime = this.reformatFreeTime.bind(this);
    }

    componentDidMount() {
        this.fetchParkingLots();
    }

    reformatFreeTime(first_free) {
        var d = Math.floor(first_free / 1440);
        var h = Math.floor((first_free - (d * 1440)) / 60);
        var m = Math.round(first_free % 60);

        return { 'day': d, 'hour': h, 'minute': m }
    }

    fetchParkingLots() {
        console.log("starting fetch")
        fetch(config.fetchNearbyParkingLotsURL + config.fetchNearbyParkingLotsURLSecret, {
            method: 'POST',
        })
            .then(response => response.json())
            .then((jsonData) => {
                let responseJson = JSON.parse(jsonData);

                let tempParkingLots = [];
                let tempFreeTime = {}

                for (let i = 0; i < responseJson.verified.length; i++) {
                    if (responseJson.verfied[i] == undefined) continue;
                    tempFreeTime[responseJson.verfied[i]._id] = this.reformatFreeTime(responseJson.verfied[i].price.first_free);
                    tempParkingLots.push(responseJson.verified[i]);
                }

                console.log(tempFreeTime)
                this.setState({ verifiedParkingLotsFreeTime: tempFreeTime })
                this.setState({ verifiedParkingLots: tempParkingLots });

                tempParkingLots = [];
                tempFreeTime = {};
                for (let i = 0; i < responseJson.not_verified.length; i++) {
                    if (responseJson.not_verified[i] == undefined) continue;
                    tempFreeTime[responseJson.not_verified[i]._id] = this.reformatFreeTime(responseJson.not_verified[i].price.first_free);
                    tempParkingLots.push(responseJson.not_verified[i]);
                }

                console.log(tempFreeTime);
                this.setState({ notVerifiedParkingLotsFreeTime: tempFreeTime })
                this.setState({ notVerifiedParkingLots: tempParkingLots });
            })
    }

    onParkingLotNamePressed(data) {
        this.props.navigation.navigate('ParkingLotDetailsPage', data);
    }

    onDirectionPressed() {

    }

    render() {
        return (
            <>
                <FlatList
                    data={this.state.verifiedParkingLots}
                    keyExtractor={item => item._id}
                    renderItem={({ item }) => (
                        <>
                            <View style={styles.flatListItemView}>
                                <TouchableOpacity onPress={items => this.onParkingLotNamePressed(item)}>
                                    <View>
                                        <View>
                                            <TextWithFont iosFontWeight={'600'} androidFontWeight={'semibold'} fontSize={24}>{item.name.en}</TextWithFont>
                                            {item.price.first_free > 0 &&
                                                <TextWithFont fontSize={16}>First {this.state.verifiedParkingLotsFreeTime[item._id].day == 0 ? '' : '' + this.state.verifiedParkingLotsFreeTime[item._id].day + ' day'}{(this.state.verifiedParkingLotsFreeTime[item._id].day != 0 && this.state.verifiedParkingLotsFreeTime[item._id].day != 1) ? 's' : '' + (this.state.verifiedParkingLotsFreeTime[item._id].hour != 0 || this.state.verifiedParkingLotsFreeTime[item._id].minute != 0) && this.state.verifiedParkingLotsFreeTime[item._id].day != 0 ? ' ' : ''}
                                                    {this.state.verifiedParkingLotsFreeTime[item._id].hour == 0 ? '' : '' + this.state.verifiedParkingLotsFreeTime[item._id].hour + ' hour'}{(this.state.verifiedParkingLotsFreeTime[item._id].hour != 0 && this.state.verifiedParkingLotsFreeTime[item._id].hour != 1) ? 's' : '' + (this.state.verifiedParkingLotsFreeTime[item._id].minute != 0) && this.state.verifiedParkingLotsFreeTime[item._id].hour != 0 ? ' ' : ''}
                                                    {this.state.verifiedParkingLotsFreeTime[item._id].minute == 0 ? '' : '' + this.state.verifiedParkingLotsFreeTime[item._id].minute + ' minute'}{(this.state.verifiedParkingLotsFreeTime[item._id].minute != 0 && this.state.verifiedParkingLotsFreeTime[item._id].minute != 1) ? 's' : ''} {this.state.verifiedParkingLotsFreeTime[item._id].hour + this.state.verifiedParkingLotsFreeTime[item._id].minute + this.state.verifiedParkingLotsFreeTime[item._id].day == 1 ? 'is' : 'are'} free</TextWithFont>
                                            }
                                            {item.price.first_free == 0 && item.price.free == true &&
                                                <TextWithFont fontSize={16}>No charge</TextWithFont>
                                            }
                                            {item.price.first_free == 0 && item.price.free == false && Object.keys(item.price.after_free).length != 0 &&
                                                <TextWithFont fontSize={16}>Flat rate</TextWithFont>
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
                        </>
                    )}
                    ListFooterComponent={
                        <FlatList
                            data={this.state.notVerifiedParkingLots}
                            keyExtractor={item => item._id}
                            renderItem={({ item }) => (
                                <>
                                    <View style={styles.flatListItemView}>
                                        <TouchableOpacity onPress={items => this.onParkingLotNamePressed(item)}>
                                            <View>
                                                <View>
                                                    <TextWithFont iosFontWeight={'600'} androidFontWeight={'semibold'} fontSize={24}>{item.name.en}</TextWithFont>
                                                    {item.price.first_free > 0 &&
                                                        <TextWithFont fontSize={16}>First {this.state.notVerifiedParkingLotsFreeTime[item._id].day == 0 ? '' : '' + this.state.notVerifiedParkingLotsFreeTime[item._id].day + ' day'}{(this.state.notVerifiedParkingLotsFreeTime[item._id].day != 0 && this.state.notVerifiedParkingLotsFreeTime[item._id].day != 1) ? 's' : '' + (this.state.notVerifiedParkingLotsFreeTime[item._id].hour != 0 || this.state.notVerifiedParkingLotsFreeTime[item._id].minute != 0) && this.state.notVerifiedParkingLotsFreeTime[item._id].day != 0 ? ' ' : ''}
                                                            {this.state.notVerifiedParkingLotsFreeTime[item._id].hour == 0 ? '' : '' + this.state.notVerifiedParkingLotsFreeTime[item._id].hour + ' hour'}{(this.state.notVerifiedParkingLotsFreeTime[item._id].hour != 0 && this.state.notVerifiedParkingLotsFreeTime[item._id].hour != 1) ? 's' : '' + (this.state.notVerifiedParkingLotsFreeTime[item._id].minute != 0) && this.state.notVerifiedParkingLotsFreeTime[item._id].hour != 0 ? ' ' : ''}
                                                            {this.state.notVerifiedParkingLotsFreeTime[item._id].minute == 0 ? '' : '' + this.state.notVerifiedParkingLotsFreeTime[item._id].minute + ' minute'}{(this.state.notVerifiedParkingLotsFreeTime[item._id].minute != 0 && this.state.notVerifiedParkingLotsFreeTime[item._id].minute != 1) ? 's' : ''} {this.state.notVerifiedParkingLotsFreeTime[item._id].hour + this.state.notVerifiedParkingLotsFreeTime[item._id].minute + this.state.notVerifiedParkingLotsFreeTime[item._id].day == 1 ? 'is' : 'are'} free</TextWithFont>
                                                    }
                                                    {item.price.first_free == 0 && item.price.free == true &&
                                                        <TextWithFont fontSize={16}>No charge</TextWithFont>
                                                    }
                                                    {item.price.first_free == 0 && item.price.free == false && Object.keys(item.price.after_free).length != 0 &&
                                                        <TextWithFont fontSize={16}>Flat rate</TextWithFont>
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
                                </>
                            )}
                        />
                    }
                />
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
        alignItems: 'center',
        marginVertical: 10
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