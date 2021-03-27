import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Dimensions, TouchableHighlight, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ParkingFeeTable from '../widgets/parkingfee/ParkingFeeTable';
import TextWithFont from '../widgets/TextWithFont';
import { google_maps_place_types } from '../../GoogleMapsPlaceTypes';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

const ParkingLotDetailsPage = ({ route, navigation }) => {
    const region = { latitude: route.params.location.geo.lat, longitude: route.params.location.geo.lng, latitudeDelta: 0.004, longitudeDelta: 0.004 }

    function renderParkingFeeTable() {
        return (
            <>
                <ParkingFeeTable price={route.params.price} />
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
                    <TouchableHighlight style={styles.directionButtonView} underlayColor='#eee' onPress={() => { }}>
                        <TextWithFont iosFontWeight={'700'} androidFontWeight={'bold'} fontSize={16} textTransform={'uppercase'}>Get direction</TextWithFont>
                    </TouchableHighlight>
                </View>
            </>
        )
    }

    function renderTitle() {
        return (
            <>
                <View style={styles.placeDetailsContainer}>
                    <View style={styles.placeDetailsHeaderView}>
                        <TextWithFont iosFontWeight={'bold'} androidFontWeight={'bold'} fontSize={30}>{route.params.name.en}</TextWithFont>
                        {route.params.types[0] != undefined && google_maps_place_types[route.params.types[0]] != undefined && <TextWithFont iosFontWeight={'400'} fontSize={16}>{google_maps_place_types[route.params.types[0]]}</TextWithFont>}
                    </View>
                    {renderParkingFeeTable()}
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
                        {renderTitle()}
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
    }
});

export default ParkingLotDetailsPage;