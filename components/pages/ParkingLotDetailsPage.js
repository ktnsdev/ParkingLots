import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Dimensions, TouchableHighlight, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ParkingFeeTable from '../widgets/parkingfee/ParkingFeeTable';
import TextWithFont from '../widgets/TextWithFont';
import { google_maps_place_types } from '../../GoogleMapsPlaceTypes';
import moment from 'moment';
import { Divider } from 'react-native-elements';
import { Linking } from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
const opensTextColour = {
    'open': '#66bb6a',
    'closing_soon': '#ff8f17',
    'closed': '#c40000'
}
const getDirectionScheme = Platform.select({ ios: 'https://www.google.com/maps/search/?api=1&query=', android: 'geo:0,0?q=' });

const ParkingLotDetailsPage = ({ route, navigation }) => {
    const region = { latitude: route.params.location.geo.lat, longitude: route.params.location.geo.lng, latitudeDelta: 0.004, longitudeDelta: 0.004 };
    const [openStatusParkingLot, setOpenStatusParkingLot] = useState({});
    const [openStatusPlace, setOpenStatusPlace] = useState({});

    useEffect(() => {
        reformatOpensNowParkingLot();
        reformatOpensNowPlace();
    }, [])

    function onGetDirectionPressed() {
        var url = Platform.select({
            ios: `${getDirectionScheme}${route.params.name.en}`,
            android: `${getDirectionScheme}${route.params.name.en}`
        });
        Linking.openURL(url);
    }

    function reformatOpensNowParkingLot() {
        if (route.params.opening_hours.parking_lot == undefined) return;

        var opening_hours = route.params.opening_hours.parking_lot;
        var today = moment().isoWeekday();
        var now = moment();
        var openCloseArray = [];
        var open, close;

        //CHECK KEYS OF opening_hours
        if (opening_hours.everyday != undefined) { //key = everyday is available
            if (opening_hours.everyday == '24h') {
                setOpenStatusParkingLot({ 'formatted_text_first_section': 'Opens 24 hours', 'status': 'open' });
                return;
            }

            openCloseArray = opening_hours.everyday.split("T");
            open = moment(openCloseArray[0], 'HH:mm');
            close = moment(openCloseArray[1], 'HH:mm');
            if (now.isBetween(open, close)) {
                if (close.subtract({ hours: 1 }) < now) {
                    setOpenStatusParkingLot({ 'formatted_text_first_section': 'Closing soon', 'formatted_text_second_section': ' · ' + openCloseArray[1], 'status': 'closing_soon' });
                    return;
                } else {
                    setOpenStatusParkingLot({ 'formatted_text_first_section': 'Opens now', 'formatted_text_second_section': ' · Closes ' + openCloseArray[1], 'status': 'open' });
                    return;
                }
            } else {
                setOpenStatusParkingLot({ 'formatted_text_first_section': 'Closed now', 'status': 'closed' });
                return;
            }
        } else if (today <= 5 && today >= 1 && opening_hours.weekdays != undefined) { //key = weekdays is available and today is the weekday
            if (opening_hours.weekdays == '24h') {
                setOpenStatusParkingLot({ 'formatted_text_first_section': 'Opens 24 hours', 'status': 'open' });
                return;
            }

            openCloseArray = opening_hours.weekdays.split("T");
            open = moment(openCloseArray[0], 'HH:mm');
            close = moment(openCloseArray[1], 'HH:mm');
            if (now.isBetween(open, close)) {
                if (close.subtract({ hours: 1 }) < now) {
                    setOpenStatusParkingLot({ 'formatted_text_first_section': 'Closing soon', 'formatted_text_second_section': ' · ' + openCloseArray[1], 'status': 'closing_soon' });
                    return;
                } else {
                    setOpenStatusParkingLot({ 'formatted_text_first_section': 'Opens now', 'formatted_text_second_section': ' · Closes ' + openCloseArray[1], 'status': 'open' });
                    return;
                }
            } else {
                setOpenStatusParkingLot({ 'formatted_text_first_section': 'Closed now', 'status': 'closed' });
                return;
            }
        } else if (today == 6 || today == 7 && opening_hours.weekends != undefined) { //key = weekends is available and today is the weekend
            if (opening_hours.weekends == '24h') {
                setOpenStatusParkingLot({ 'formatted_text_first_section': 'Opens 24 hours', 'status': 'open' });
                return;
            }

            openCloseArray = opening_hours.weekends.split("T");
            open = moment(openCloseArray[0], 'HH:mm');
            close = moment(openCloseArray[1], 'HH:mm');
            if (now.isBetween(open, close)) {
                if (close.subtract({ hours: 1 }) < now) {
                    setOpenStatusParkingLot({ 'formatted_text_first_section': 'Closing soon', 'formatted_text_second_section': ' · ' + openCloseArray[1], 'status': 'closing_soon' });
                    return;
                } else {
                    setOpenStatusParkingLot({ 'formatted_text_first_section': 'Opens now', 'formatted_text_second_section': ' · Closes ' + openCloseArray[1], 'status': 'open' });
                    return;
                }
            } else {
                setOpenStatusParkingLot({ 'formatted_text_first_section': 'Closed now', 'status': 'closed' });
                return;
            }
        } else if (opening_hours[today] == undefined) { //key = today is not available
            return setOpenStatusParkingLot({ 'formatted_text_first_section': 'Closed today', 'formatted_text_second_section': ' · ' + openCloseArray[1], 'status': 'closed' });
        } else { //key = today is available
            if (opening_hours[today] == '24h') {
                setOpenStatusParkingLot({ 'formatted_text_first_section': 'Opens 24 hours', 'status': 'open' });
                return;
            }

            openCloseArray = opening_hours[today].split("T");
            open = moment(openCloseArray[0], 'HH:mm');
            close = moment(openCloseArray[1], 'HH:mm');
            if (now.isBetween(open, close)) {
                if (close.subtract({ hours: 1 }) < now) {
                    setOpenStatusParkingLot({ 'formatted_text_first_section': 'Closing soon', 'formatted_text_second_section': ' · ' + openCloseArray[1], 'status': 'closing_soon' });
                    return;
                } else {
                    setOpenStatusParkingLot({ 'formatted_text_first_section': 'Opens now', 'formatted_text_second_section': ' · Closes ' + openCloseArray[1], 'status': 'open' });
                    return;
                }
            } else {
                setOpenStatusParkingLot({ 'formatted_text_first_section': 'Closed now', 'status': 'closed' });
                return;
            }
        }
    }

    function reformatOpensNowPlace() {
        if (route.params.opening_hours.place == undefined) return;

        var opening_hours = route.params.opening_hours.place;
        var today = moment().isoWeekday();
        var now = moment();
        var openCloseArray = [];
        var open, close;

        //CHECK KEYS OF opening_hours
        if (opening_hours.everyday != undefined) { //key = everyday is available
            if (opening_hours.everyday == '24h') {
                setOpenStatusPlace({ 'formatted_text_first_section': 'Opens 24 hours', 'status': 'open' });
                return;
            }

            openCloseArray = opening_hours.everyday.split("T");
            open = moment(openCloseArray[0], 'HH:mm');
            close = moment(openCloseArray[1], 'HH:mm');
            if (now.isBetween(open, close)) {
                if (close.subtract({ hours: 1 }) < now) {
                    setOpenStatusPlace({ 'formatted_text_first_section': 'Closing soon', 'formatted_text_second_section': ' · ' + openCloseArray[1], 'status': 'closing_soon' });
                    return;
                } else {
                    setOpenStatusPlace({ 'formatted_text_first_section': 'Opens now', 'formatted_text_second_section': ' · Closes ' + openCloseArray[1], 'status': 'open' });
                    return;
                }
            } else {
                setOpenStatusPlace({ 'formatted_text_first_section': 'Closed now', 'status': 'closed' });
                return;
            }
        } else if (today <= 5 && today >= 1 && opening_hours.weekdays != undefined) { //key = weekdays is available and today is the weekday
            if (opening_hours.weekdays == '24h') {
                setOpenStatusPlace({ 'formatted_text_first_section': 'Opens 24 hours', 'status': 'open' });
                return;
            }

            openCloseArray = opening_hours.weekdays.split("T");
            open = moment(openCloseArray[0], 'HH:mm');
            close = moment(openCloseArray[1], 'HH:mm');
            if (now.isBetween(open, close)) {
                if (close.subtract({ hours: 1 }) < now) {
                    setOpenStatusPlace({ 'formatted_text_first_section': 'Closing soon', 'formatted_text_second_section': ' · ' + openCloseArray[1], 'status': 'closing_soon' });
                    return;
                } else {
                    setOpenStatusPlace({ 'formatted_text_first_section': 'Opens now', 'formatted_text_second_section': ' · Closes ' + openCloseArray[1], 'status': 'open' });
                    return;
                }
            } else {
                setOpenStatusPlace({ 'formatted_text_first_section': 'Closed now', 'status': 'closed' });
                return;
            }
        } else if (today == 6 || today == 7 && opening_hours.weekends != undefined) { //key = weekends is available and today is the weekend
            if (opening_hours.weekends == '24h') {
                setOpenStatusPlace({ 'formatted_text_first_section': 'Opens 24 hours', 'status': 'open' });
                return;
            }

            openCloseArray = opening_hours.weekends.split("T");
            open = moment(openCloseArray[0], 'HH:mm');
            close = moment(openCloseArray[1], 'HH:mm');
            if (now.isBetween(open, close)) {
                if (close.subtract({ hours: 1 }) < now) {
                    setOpenStatusPlace({ 'formatted_text_first_section': 'Closing soon', 'formatted_text_second_section': ' · ' + openCloseArray[1], 'status': 'closing_soon' });
                    return;
                } else {
                    setOpenStatusPlace({ 'formatted_text_first_section': 'Opens now', 'formatted_text_second_section': ' · Closes ' + openCloseArray[1], 'status': 'open' });
                    return;
                }
            } else {
                setOpenStatusPlace({ 'formatted_text_first_section': 'Closed now', 'status': 'closed' });
                return;
            }
        } else if (opening_hours[today] == undefined) { //key = today is not available
            return setOpenStatusPlace({ 'formatted_text_first_section': 'Closed today', 'formatted_text_second_section': ' · ' + openCloseArray[1], 'status': 'closed' });
        } else { //key = today is available
            if (opening_hours[today] == '24h') {
                setOpenStatusPlace({ 'formatted_text_first_section': 'Opens 24 hours', 'status': 'open' });
                return;
            }

            openCloseArray = opening_hours[today].split("T");
            open = moment(openCloseArray[0], 'HH:mm');
            close = moment(openCloseArray[1], 'HH:mm');
            if (now.isBetween(open, close)) {
                if (close.subtract({ hours: 1 }) < now) {
                    setOpenStatusPlace({ 'formatted_text_first_section': 'Closing soon', 'formatted_text_second_section': ' · ' + openCloseArray[1], 'status': 'closing_soon' });
                    return;
                } else {
                    setOpenStatusPlace({ 'formatted_text_first_section': 'Opens now', 'formatted_text_second_section': ' · Closes ' + openCloseArray[1], 'status': 'open' });
                    return;
                }
            } else {
                setOpenStatusPlace({ 'formatted_text_first_section': 'Closed now', 'status': 'closed' });
                return;
            }
        }
    }

    function renderParkingFeeTables() {
        return (
            <>
                <View style={{ marginBottom: '1%', marginTop: '3%', flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name={'directions-car'} size={24} />
                    <TextWithFont iosFontWeight={'bold'} androidFontWeight={'bold'} fontSize={22}> Car parking fee</TextWithFont>
                </View>
                <ParkingFeeTable price={route.params.price} />

                {route.params.price_motorcycle != undefined &&
                    <>
                        <View style={{ marginBottom: '1%', marginTop: '5%', flexDirection: 'row', alignItems: 'center' }}>
                            <Icon name={'two-wheeler'} size={24} />
                            <TextWithFont iosFontWeight={'bold'} androidFontWeight={'bold'} fontSize={22}> Motorcycle parking fee</TextWithFont>
                        </View>
                        <ParkingFeeTable price={route.params.price_motorcycle} />
                    </>
                }
            </>
        )
    }

    function renderOpensNowText() {
        return (
            <>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    ...Platform.select({
                        'ios': {
                            marginVertical: 3,
                        },
                        'android': {
                            marginVertical: 0
                        }
                    })
                }}>
                    <View>
                        <View
                            style={{
                                flexDirection: 'row'
                            }}>
                            {Object.keys(openStatusParkingLot).length > 0 &&
                                <>
                                    {openStatusParkingLot.formatted_text_first_section != undefined &&
                                        <TextWithFont fontSize={20} iosFontWeight={'600'} androidFontWeight={'bold'} color={opensTextColour[openStatusParkingLot.status]}>
                                            {openStatusParkingLot.formatted_text_first_section}
                                        </TextWithFont>
                                    }
                                    {openStatusParkingLot.formatted_text_second_section != undefined &&
                                        <TextWithFont fontSize={20} iosFontWeight={'500'} androidFontWeight={'semibold'} color={'#666'}>{openStatusParkingLot.formatted_text_second_section}</TextWithFont>

                                    }
                                </>
                            }
                            {Object.keys(openStatusParkingLot).length == 0 && Object.keys(openStatusPlace).length > 0 &&
                                <>
                                    {openStatusPlace.formatted_text_first_section != undefined &&
                                        <TextWithFont fontSize={20} iosFontWeight={'600'} androidFontWeight={'bold'} color={opensTextColour[openStatusPlace.status]}>
                                            {openStatusPlace.formatted_text_first_section}
                                        </TextWithFont>
                                    }
                                    {openStatusPlace.formatted_text_second_section != undefined &&
                                        <TextWithFont fontSize={20} iosFontWeight={'500'} androidFontWeight={'semibold'} color={'#666'}>{openStatusPlace.formatted_text_second_section}</TextWithFont>

                                    }
                                </>
                            }
                        </View>
                        {Object.keys(openStatusParkingLot).length == 0 && Object.keys(openStatusPlace).length > 0 &&
                            <TextWithFont fontSize={16} iosFontWeight={'500'} androidFontWeight={'medium'}>Parking lot hours might differ</TextWithFont>
                        }
                    </View>
                    <View>
                        <Icon name={'expand-more'} size={24} />
                    </View>
                </View>
            </>
        )
    }

    function renderMaps() {
        return (
            <>
                <MapView
                    contentContainerStyle={StyleSheet.absoluteFillObject}
                    style={{ height: 250, width: screenWidth }}
                    initialRegion={region}
                    region={region}
                    provider={MapView.PROVIDER_GOOGLE}
                    customMapStyle={[
                        {
                            "featureType": "poi.business",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "poi.park",
                            "elementType": "labels.text",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        }
                    ]}
                >
                    <MapView.Marker
                        coordinate={{
                            latitude: region.latitude,
                            longitude: region.longitude
                        }}
                    >
                        <View style={{ backgroundColor: '#707070', padding: 2, borderRadius: 100 }}>
                            <View style={{ backgroundColor: '#ff8f17', padding: 4, borderRadius: 100 }}>
                                <Icon name={'local-parking'} size={22} color={'#fff'} />
                            </View>
                        </View>
                    </MapView.Marker>
                </MapView>

                <View
                    style={{
                        alignItems: 'flex-end',
                        marginRight: '4%',
                        marginTop: '-12%'
                    }}
                >
                    <TouchableHighlight style={styles.directionButtonView} underlayColor='#eee' onPress={() => onGetDirectionPressed()}>
                        <TextWithFont iosFontWeight={'700'} androidFontWeight={'bold'} fontSize={16} textTransform={'uppercase'}>Get direction</TextWithFont>
                    </TouchableHighlight>
                </View>
            </>
        )
    }

    function renderTitleAndParkingFeeTable() {
        return (
            <>
                <View style={styles.placeDetailsContainer}>
                    <View style={styles.placeDetailsHeaderView}>
                        <TextWithFont iosFontWeight={'bold'} androidFontWeight={'bold'} fontSize={30}>{route.params.name.en}</TextWithFont>
                        {route.params.types[0] != undefined && google_maps_place_types[route.params.types[0]] != undefined &&
                            <>
                                <TextWithFont iosFontWeight={'500'} androidFontWeight={'medium'} fontSize={16}>
                                    {google_maps_place_types[route.params.types[0]]}
                                </TextWithFont>
                            </>
                        }
                        {route.params.opening_hours != undefined &&
                            <>
                                <Divider style={{ backgroundColor: '#404040', marginVertical: '3%' }} />
                                {renderOpensNowText()}
                            </>
                        }
                    </View>
                    <Divider style={{ backgroundColor: '#404040' }} />
                    {renderParkingFeeTables()}
                    <Divider style={{ backgroundColor: '#404040', marginTop: '6%' }} />
                </View>
            </>
        )
    }

    function renderAboutThisPlace() {
        return (
            <>
                <View style={styles.aboutThisPlaceContainer}>
                    <View style={{ marginBottom: '1%' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 1 }}>
                            <Icon name={'place'} size={22} />
                            <TextWithFont iosFontWeight={'bold'} androidFontWeight={'bold'} fontSize={20}> Address</TextWithFont>
                        </View>
                        <View style={{ paddingLeft: 26 }}>
                            <TextWithFont>{route.params.location.address.formatted.en}</TextWithFont>
                        </View>
                    </View>
                    <Divider style={{ backgroundColor: '#404040', marginVertical: '3%' }} />
                    <View style={{ marginBottom: '1%' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 1 }}>
                            <Icon name={'update'} size={22} />
                            <TextWithFont iosFontWeight={'bold'} androidFontWeight={'bold'} fontSize={20}> Contributed on</TextWithFont>
                        </View>
                        <View style={{ paddingLeft: 26 }}>
                            <TextWithFont>{moment(route.params.last_updated).format('dddd DD MMMM YYYY HH:mm')}</TextWithFont>
                        </View>
                    </View>
                </View>
            </>
        )
    }

    return (
        <>
            {route.params != undefined &&
                <>
                    <ScrollView>
                        {renderMaps()}
                        {renderTitleAndParkingFeeTable()}
                        {renderAboutThisPlace()}
                        <View style={{ height: 50 }} />
                    </ScrollView>
                </>
            }
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        height: 40,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.29,
        shadowRadius: 1.2,

        elevation: 7,
    },
    placeDetailsContainer: {
        padding: '5%'
    },
    placeDetailsHeaderView: {
        marginTop: '1%',
        marginBottom: '3%'
    },
    aboutThisPlaceContainer: {
        paddingHorizontal: '5%',
        marginTop: '-1%'
    }
});

export default ParkingLotDetailsPage;