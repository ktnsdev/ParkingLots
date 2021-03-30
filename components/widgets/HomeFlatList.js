import React, { Component } from 'react';
import { StyleSheet, FlatList, Text, View, TouchableHighlight, Platform, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-elements'
import Icon from 'react-native-vector-icons/MaterialIcons';
import TextWithFont from './TextWithFont';
import { config } from '../../config';
import moment from 'moment';

const opensNowTextColour = '#66bb6a';
const closingSoonTextColour = '#ff8f17';
const closedTextColour = '#c40000';

class HomeFlatList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            verifiedParkingLots: [],
            notVerifiedParkingLots: [],
            verifiedParkingLotsFreeTime: {},
            notVerifiedParkingLotsFreeTime: {},
            verifiedPlaceOpensNowString: {},
            notVerifiedPlaceOpensNowString: {},
            verifiedParkingLotOpensNowString: {},
            notVerifiedParkingLotOpensNowString: {},
        };
        this.fetchParkingLots = this.fetchParkingLots.bind(this);
        this.onDirectionPressed = this.onDirectionPressed.bind(this);
        this.onParkingLotNamePressed = this.onParkingLotNamePressed.bind(this);
        this.reformatFreeTime = this.reformatFreeTime.bind(this);
        this.getOpensNow = this.getOpensNow.bind(this);
        this.renderOpensNowText = this.renderOpensNowText.bind(this);
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

    getOpensNow(opening_hours) {
        var today = moment().isoWeekday();
        var now = moment();
        var openCloseArray = [];
        var open, close;

        //CHECK KEYS OF opening_hours
        if (opening_hours.everyday != undefined) { //key = everyday is available
            if (opening_hours.everyday == '24h') return 'Opens 24 hours';

            openCloseArray = opening_hours.everyday.split("T");
            open = moment(openCloseArray[0], 'HH:mm');
            close = moment(openCloseArray[1], 'HH:mm');
            if (now.isBetween(open, close)) {
                if (close.subtract({ hours: 1 }) < now) return 'Closing soon · ' + openCloseArray[1];
                else return 'Opens now · Closes ' + openCloseArray[1];
            }
            else return 'Closed now';
        } else if (today <= 5 && today >= 1 && opening_hours.weekdays != undefined) { //key = weekdays is available and today is the weekday
            if (opening_hours.weekdays == '24h') return 'Opens 24 hours';

            openCloseArray = opening_hours.weekdays.split("T");
            open = moment(openCloseArray[0], 'HH:mm');
            close = moment(openCloseArray[1], 'HH:mm');
            if (now.isBetween(open, close)) {
                if (close.subtract({ hours: 1 }) < now) return 'Closing soon · ' + openCloseArray[1];
                else return 'Opens now · Closes ' + openCloseArray[1];
            }
            else return 'Closed now';
        } else if (today == 6 || today == 7 && opening_hours.weekends != undefined) { //key = weekends is available and today is the weekend
            if (opening_hours.weekends == '24h') return 'Opens 24 hours';

            openCloseArray = opening_hours.weekends.split("T");
            open = moment(openCloseArray[0], 'HH:mm');
            close = moment(openCloseArray[1], 'HH:mm');
            if (now.isBetween(open, close)) {
                if (close.subtract({ hours: 1 }) < now) return 'Closing soon · ' + openCloseArray[1];
                else return 'Opens now · Closes ' + openCloseArray[1];
            }
            else return 'Closed now';
        } else if (opening_hours[today] == undefined) { //key = today is not available
            return 'Closed today';
        } else { //key = today is available
            if (opening_hours[today] == '24h') return 'Opens 24 hours';

            openCloseArray = opening_hours[today].split("T");
            open = moment(openCloseArray[0], 'HH:mm');
            close = moment(openCloseArray[1], 'HH:mm');
            if (now.isBetween(open, close)) {
                if (close.subtract({ hours: 1 }) < now) return 'Closing soon · ' + openCloseArray[1];
                else return 'Opens now · Closes ' + openCloseArray[1];
            }
            else return 'Closed now';
        }
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
                let tempFreeTime = {};
                let tempPlaceOpensNow = {};
                let tempParkingLotOpensNow = {};

                for (let i = 0; i < responseJson.verified.length; i++) {
                    if (responseJson.verfied[i] == undefined) continue;
                    tempFreeTime[responseJson.verfied[i]._id] = this.reformatFreeTime(responseJson.verfied[i].price.first_free);
                    console.log(responseJson.verfied[i].opening_hours.place)
                    if (responseJson.verfied[i].opening_hours.place != undefined) tempPlaceOpensNow[responseJson.verfied[i]._id] = this.getOpensNow(responseJson.verfied[i].opening_hours.place);
                    if (responseJson.verfied[i].opening_hours.parking_lot != undefined) tempParkingLotOpensNow[responseJson.verfied[i]._id] = this.getOpensNow(responseJson.verfied[i].opening_hours.parking_lot);
                    tempParkingLots.push(responseJson.verified[i]);
                }

                this.setState({ verifiedParkingLotsFreeTime: tempFreeTime })
                this.setState({ verifiedParkingLots: tempParkingLots });
                this.setState({ verifiedOpensNow: tempPlaceOpensNow });
                this.setState({ verifiedParkingLotOpensNowString: tempParkingLotOpensNow });

                tempParkingLots = [];
                tempFreeTime = {};
                tempPlaceOpensNow = {};
                tempParkingLotOpensNow = {};

                for (let i = 0; i < responseJson.not_verified.length; i++) {
                    if (responseJson.not_verified[i] == undefined) continue;
                    tempFreeTime[responseJson.not_verified[i]._id] = this.reformatFreeTime(responseJson.not_verified[i].price.first_free);
                    if (responseJson.not_verified[i].opening_hours.place != undefined) tempPlaceOpensNow[responseJson.not_verified[i]._id] = this.getOpensNow(responseJson.not_verified[i].opening_hours.place);
                    if (responseJson.not_verified[i].opening_hours.parking_lot != undefined) tempParkingLotOpensNow[responseJson.not_verified[i]._id] = this.getOpensNow(responseJson.not_verified[i].opening_hours.parking_lot);
                    tempParkingLots.push(responseJson.not_verified[i]);
                }

                this.setState({ notVerifiedParkingLotsFreeTime: tempFreeTime })
                this.setState({ notVerifiedParkingLots: tempParkingLots });
                this.setState({ notVerifiedParkingLotOpensNowString: tempParkingLotOpensNow });
                this.setState({ notVerifiedPlaceOpensNowString: tempPlaceOpensNow });
            })
    }

    onParkingLotNamePressed(data) {
        this.props.navigation.navigate('ParkingLotDetailsPage', data);
    }

    onDirectionPressed() {

    }

    renderOpensNowText(isVerified, _id) {
        if (isVerified) {
            if (this.state.verifiedParkingLotOpensNowString[_id] != undefined) {
                return (
                    <>
                        <TextWithFont fontSize={16}>{this.state.verifiedParkingLotOpensNowString[_id] + '\n'}</TextWithFont>
                    </>
                )
            } else if (this.state.verifiedParkingLotOpensNowString[_id] == undefined && this.state.verifiedPlaceOpensNowString[_id] != undefined) {
                return (
                    <>
                        <TextWithFont fontSize={16}>{this.state.verifiedPlaceOpensNowString[_id] + '\n'}</TextWithFont>
                        <TextWithFont fontSize={16}>Parking lot hours might differ{'\n'}</TextWithFont>
                    </>
                )
            } else {
                return;
            }
        } else {
            if (this.state.notVerifiedParkingLotOpensNowString[_id] != undefined) {
                return (
                    <>
                        <TextWithFont fontSize={16}>{this.state.notVerifiedParkingLotOpensNowString[_id] + '\n'}</TextWithFont>
                    </>
                )
            } else if (this.state.notVerifiedParkingLotOpensNowString[_id] == undefined && this.state.notVerifiedPlaceOpensNowString[_id] != undefined) {
                return (
                    <>
                        <TextWithFont fontSize={16}>{this.state.notVerifiedPlaceOpensNowString[_id] + '\n'}</TextWithFont>
                        <TextWithFont fontSize={16}>Parking lot hours might differ{'\n'}</TextWithFont>
                    </>
                )
            } else {
                return '';
            }
        }
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
                                                <TextWithFont fontSize={16}>{this.renderOpensNowText(true, item._id)}First {this.state.verifiedParkingLotsFreeTime[item._id].day == 0 ? '' : '' + this.state.verifiedParkingLotsFreeTime[item._id].day + ' day'}{(this.state.verifiedParkingLotsFreeTime[item._id].day != 0 && this.state.verifiedParkingLotsFreeTime[item._id].day != 1) ? 's' : '' + (this.state.verifiedParkingLotsFreeTime[item._id].hour != 0 || this.state.verifiedParkingLotsFreeTime[item._id].minute != 0) && this.state.verifiedParkingLotsFreeTime[item._id].day != 0 ? ' ' : ''}
                                                    {this.state.verifiedParkingLotsFreeTime[item._id].hour == 0 ? '' : '' + this.state.verifiedParkingLotsFreeTime[item._id].hour + ' hour'}{(this.state.verifiedParkingLotsFreeTime[item._id].hour != 0 && this.state.verifiedParkingLotsFreeTime[item._id].hour != 1) ? 's' : '' + (this.state.verifiedParkingLotsFreeTime[item._id].minute != 0) && this.state.verifiedParkingLotsFreeTime[item._id].hour != 0 ? ' ' : ''}
                                                    {this.state.verifiedParkingLotsFreeTime[item._id].minute == 0 ? '' : '' + this.state.verifiedParkingLotsFreeTime[item._id].minute + ' minute'}{(this.state.verifiedParkingLotsFreeTime[item._id].minute != 0 && this.state.verifiedParkingLotsFreeTime[item._id].minute != 1) ? 's' : ''} {this.state.verifiedParkingLotsFreeTime[item._id].hour + this.state.verifiedParkingLotsFreeTime[item._id].minute + this.state.verifiedParkingLotsFreeTime[item._id].day == 1 ? 'is' : 'are'} free</TextWithFont>
                                            }
                                            {item.price.first_free == 0 && item.price.free == true &&
                                                <TextWithFont fontSize={16}>{this.renderOpensNowText(true, item._id)}Free parking</TextWithFont>
                                            }
                                            {item.price.first_free == 0 && item.price.free == false && Object.keys(item.price.after_free).length == 1 &&
                                                <TextWithFont fontSize={16}>{this.renderOpensNowText(true, item._id)}Flat rate</TextWithFont>

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
                            {item != this.state.verifiedParkingLots[this.state.verifiedParkingLots.length - 1] && this.state.notVerifiedParkingLots.length == 0 &&
                                <Divider style={styles.lineBreak} />
                            }
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
                                                        <TextWithFont fontSize={16}>{this.renderOpensNowText(false, item._id)}First {this.state.notVerifiedParkingLotsFreeTime[item._id].day == 0 ? '' : '' + this.state.notVerifiedParkingLotsFreeTime[item._id].day + ' day'}{(this.state.notVerifiedParkingLotsFreeTime[item._id].day != 0 && this.state.notVerifiedParkingLotsFreeTime[item._id].day != 1) ? 's' : '' + (this.state.notVerifiedParkingLotsFreeTime[item._id].hour != 0 || this.state.notVerifiedParkingLotsFreeTime[item._id].minute != 0) && this.state.notVerifiedParkingLotsFreeTime[item._id].day != 0 ? ' ' : ''}
                                                            {this.state.notVerifiedParkingLotsFreeTime[item._id].hour == 0 ? '' : '' + this.state.notVerifiedParkingLotsFreeTime[item._id].hour + ' hour'}{(this.state.notVerifiedParkingLotsFreeTime[item._id].hour != 0 && this.state.notVerifiedParkingLotsFreeTime[item._id].hour != 1) ? 's' : '' + (this.state.notVerifiedParkingLotsFreeTime[item._id].minute != 0) && this.state.notVerifiedParkingLotsFreeTime[item._id].hour != 0 ? ' ' : ''}
                                                            {this.state.notVerifiedParkingLotsFreeTime[item._id].minute == 0 ? '' : '' + this.state.notVerifiedParkingLotsFreeTime[item._id].minute + ' minute'}{(this.state.notVerifiedParkingLotsFreeTime[item._id].minute != 0 && this.state.notVerifiedParkingLotsFreeTime[item._id].minute != 1) ? 's' : ''} {this.state.notVerifiedParkingLotsFreeTime[item._id].hour + this.state.notVerifiedParkingLotsFreeTime[item._id].minute + this.state.notVerifiedParkingLotsFreeTime[item._id].day == 1 ? 'is' : 'are'} free</TextWithFont>
                                                    }
                                                    {item.price.first_free == 0 && item.price.free == true &&
                                                        <TextWithFont fontSize={16}>{this.renderOpensNowText(false, item._id)}Free parking</TextWithFont>
                                                    }
                                                    {item.price.first_free == 0 && item.price.free == false && Object.keys(item.price.after_free).length == 1 &&
                                                        <TextWithFont fontSize={16}>{this.renderOpensNowText(false, item._id)}Flat rate</TextWithFont>
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
                                    {item != this.state.notVerifiedParkingLots[this.state.notVerifiedParkingLots.length - 1] &&
                                        <Divider style={styles.lineBreak} />
                                    }
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
        backgroundColor: '#404040',
        marginVertical: '1%'
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