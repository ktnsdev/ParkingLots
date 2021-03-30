import React, { Component, useEffect, useRef, useState } from 'react';
import { Alert, SafeAreaView, Text, StyleSheet, View, Platform, TextInput, TouchableOpacity, ScrollView, BackHandler, Animated, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, { Marker } from 'react-native-maps';
import GrayTextBoxWithTitle from '../widgets/GrayTextBoxWithTitle';
import TextWithFont from '../widgets/TextWithFont';
import ParkingFeeTable from '../widgets/parkingfee/ParkingFeeTable';
import { config } from '../../config';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
const HEADER_MAX_HEIGHT = screenHeight * 0.25;
const HEADER_MIN_HEIGHT = 100;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const ContributeSecondPage = ({ route, navigation }) => {
    const region = {
        latitude: route.params.paramKey.placeDetails.en.geometry.location.lat,
        longitude: route.params.paramKey.placeDetails.en.geometry.location.lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
    }

    const [headerWidth, setHeaderWidth] = useState(0);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [contributionData, setContributionData] = useState({});

    useEffect(() => {
        reformatContributionData();

        const backAction = () => {
            onBackPressed({ navigation })
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);

    //REFORMAT CONTRIBUTION DATA; PREPARE TO SEND INTO THE SERVER
    function reformatContributionData() {
        let tempAfterFree = {};
        let minuteMultiplier = 1;

        if (route.params.paramKey.contributionData.unitTime == 'hour') minuteMultiplier = 60;
        else if (route.params.paramKey.contributionData.unitTime == 'day') minuteMultiplier = 1440;
        else if (route.params.paramKey.contributionData.unitTime == 'minute') minuteMultiplier = 60; // Even if the user choose minute, the conditions are always in hour

        if (!(Object.keys(route.params.paramKey.contributionData).length === 0)) {
            for (let i = 0; i < route.params.paramKey.contributionData.data.length; i++) {
                tempAfterFree[route.params.paramKey.contributionData.data[i].time * minuteMultiplier] = route.params.paramKey.contributionData.data[i].fee
            }
        }

        if (route.params.paramKey.contributionData.unitTime == 'minute') minuteMultiplier = 1; // Now calculating first free time, so minute nultiplier must be 1 if the user selected minute

        let tempFirstFreeTime = Object.keys(route.params.paramKey.contributionData).length === 0 ? 0 : route.params.paramKey.contributionData.firstFreeTime * minuteMultiplier

        setContributionData({
            'name': {
                'en': route.params.paramKey.placeDetails.en.name,
                'th': route.params.paramKey.placeDetails.th.name
            },
            'location': {
                'google_plus_code': route.params.paramKey.placeDetails.en.plus_code,
                'geo': route.params.paramKey.placeDetails.en.geometry.location,
                'address': {
                    'components': {
                        en: route.params.paramKey.placeDetails.en.address_components,
                        th: route.params.paramKey.placeDetails.th.address_components
                    },
                    'formatted': {
                        en: route.params.paramKey.placeDetails.en.formatted_address,
                        th: route.params.paramKey.placeDetails.th.formatted_address
                    }
                }
            },
            'types': route.params.paramKey.placeDetails.en.types,
            'place_id': route.params.paramKey.placeDetails.place_id,
            'price': {
                'first_free': tempFirstFreeTime,
                'free': Object.keys(route.params.paramKey.contributionData).length === 0 ? true : false,
                'after_free': tempAfterFree,
                'unit_time': route.params.paramKey.contributionData.unitTime
            },
            'verified': false,
            'verification_score': 1,
            'contributor': 'unknown',
            'last_updated': (new Date()).toISOString()
        })
    }

    //HANDLE BACK BUTTON
    function onBackPressed() {
        navigation.goBack()
    }

    //HANDLE SUBMIT BUTTON
    function onSubmitPressed() {
        submitAlert();
    }

    function submitAlert() {
        Alert.alert(
            'Done checking?',
            'You won\'t be able to change the details you have submitted your contribution.',
            [
                {
                    text: 'Cancel',
                    style: 'destructive'
                },
                {
                    text: 'Submit',
                    onPress: () => submit(),
                    style: 'default'
                },
            ],
            { cancelable: true }
        );
    }

    //SUBMIT CONTRIBUTION DATA TO SERVER
    function submit() {
        fetch(config.contributeParkingLotsURL + config.contributeParkingLotsSecret, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contributionData)
        })
        .then(response => response.status)
        .then((data) => {
            if (data == 401) {
                dataAlreadyExistsAlert();
            } else if (data == 400) {
                errorAlert();
            } else {
                onSubmitComplete();
            }
        })
        .catch(() => {
            errorAlert();
        })
    }

    function dataAlreadyExistsAlert() {
        Alert.alert(
            'Someone has already contributed a parking lot for ' + contributionData.name.en,
            'But this doesn\'t mean you can\'t contribute another parking lot! If you are certain that no one has contributed for ' + contributionData.name.en + ', please let us know.',
            [
                {
                    text: 'OK',
                    onPress: () => navigation.pop(2),
                    style: 'default'
                },
            ],
            { cancelable: false }
        );
    }

    function errorAlert() {
        Alert.alert(
            'Something went wrong (400)',
            'The problem occured while we are trying to connect to the server. Please re-check your internet connection and try again later.',
            [
                {
                    text: 'OK',
                    style: 'default'
                },
            ],
            { cancelable: false }
        );
    }

    //ALERT WHEN THE DATA IS CONTRIBUTED TO THE SERVER
    function onSubmitComplete() {
        Alert.alert(
            'Contribution submitted',
            'Thank you for helping us build the parking lots catalogue.',
            [
                {
                    text: 'OK!',
                    onPress: navigation.pop(3),
                    style: 'default'
                },
            ],
            { cancelable: false }
        );
    }

    //Animated Value
    const scrollY = useRef(new Animated.Value(0)).current;
    const descriptionOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_MAX_HEIGHT - 200],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const headerViewTranslateYiOS = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [0, -HEADER_SCROLL_DISTANCE + 50],
        extrapolate: 'clamp',
    });

    const headerViewTranslateYAndroid = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [0, -HEADER_SCROLL_DISTANCE + 10],
        extrapolate: 'clamp',
    });

    const titleTextTranslateY = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [0, - HEADER_SCROLL_DISTANCE + 185],
        extrapolate: 'clamp',
    });

    function find_dimensions(layout) {
        const { x, y, width, height } = layout;
        setHeaderHeight(height);
        setHeaderWidth(width);
    }

    function renderParkingFeeTable() {
        return (
            <>
                <View style={styles.parkingFeeTableView}>
                    <TextWithFont iosFontWeight='bold' androidFontWeight='bold' fontSize={24} style={styles.contentTitleText}>Parking Fees</TextWithFont>
                    <View
                        style={{
                            ...Platform.select({
                                'ios': {
                                    marginTop: '1%'
                                }
                            })
                        }}
                    >
                        <ParkingFeeTable
                            price={contributionData.price}
                        />
                    </View>
                </View>
            </>
        )
    }

    function renderContent() {
        return (
            <>
                <Animated.ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ zIndex: -1 }}
                    scrollEventThrottle={16}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: true },
                    )}>
                    <View style={[styles.placeDetailsContainer, {
                        ...Platform.select({
                            'ios': {
                                paddingTop: headerHeight * 1.05
                            },
                            'android': {
                                paddingTop: headerHeight * 0.95
                            }
                        })
                    }]}>

                        {!(Object.keys(contributionData).length === 0) && renderParkingFeeTable()}

                        <TextWithFont iosFontWeight='bold' androidFontWeight='bold' fontSize={24} style={styles.contentTitleText}>Parking Lot Details</TextWithFont>
                        <View
                            pointerEvents='none'
                            style={{
                                marginTop: '3%',
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 0,
                                },
                                shadowOpacity: 0.29,
                                shadowRadius: 2,

                                elevation: 7,
                            }}>
                            <MapView
                                style={{
                                    height: 200,
                                    width: '100%',
                                    borderRadius: 12,
                                }}
                                region={region}
                                provider={MapView.PROVIDER_GOOGLE}
                                showsUserLocation={true}
                                pointerEvents='none'
                            >
                                <Marker
                                    coordinate={{ latitude: region.latitude, longitude: region.longitude }}
                                />
                            </MapView>
                        </View>
                        <View style={styles.placeDetailsTextContainer}>
                            <GrayTextBoxWithTitle placeholder={route.params.paramKey.placeDetails.en.name} title={'Name'} required={'*'} />
                            <GrayTextBoxWithTitle placeholder={route.params.paramKey.placeDetails.th.name} title={'Thai Name'} />
                            <GrayTextBoxWithTitle placeholder={route.params.paramKey.placeDetails.en.formatted_address} title={'Address'} required={'*'} />
                            <GrayTextBoxWithTitle placeholder={route.params.paramKey.placeDetails.en.geometry.location.lat} title={'Latitude'} required={'*'} />
                            <GrayTextBoxWithTitle placeholder={route.params.paramKey.placeDetails.en.geometry.location.lng} title={'Longitude'} required={'*'} />
                        </View>
                    </View>
                </Animated.ScrollView>
            </>
        )
    }

    return (
        <>
            <View style={styles.backAndCancelHeaderBackground}>
                <SafeAreaView forceInset={{ top: 'always' }} />
                <View style={styles.backAndCancelHeaderView} pointerEvents={'box-none'}>
                    <TouchableOpacity style={styles.backButtonView} onPress={() => onBackPressed()}>
                        <Icon style={styles.backIcon} name='arrow-back' size={24} color='#fff' />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => onSubmitPressed()}>
                        <View style={styles.submitTextView}>
                            <TextWithFont
                                color={'#fff'}
                                fontSize={18}
                                iosFontWeight={'bold'}
                                androidFontWeight={'bold'}>Submit</TextWithFont>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <Animated.View onLayout={(event) => { find_dimensions(event.nativeEvent.layout) }} style={[styles.titleBackground, {
                transform: [{
                    ...Platform.select({
                        'ios': {
                            translateY: headerViewTranslateYiOS
                        },
                        'android': {
                            translateY: headerViewTranslateYAndroid
                        }
                    })
                }]
            }]}>
                <Animated.Text style={[styles.addingAParkingLotToText, { opacity: descriptionOpacity }]}>Review your contribution for</Animated.Text>
                <Animated.Text style={[styles.title, { transform: [{ translateY: titleTextTranslateY }] }]}>{route.params.paramKey.placeDetails.en.name}</Animated.Text>
                <Animated.Text style={[styles.descriptionText, { opacity: descriptionOpacity }]}>Please check whether the information you provided is correct. If not, you can go back and change them.</Animated.Text>
            </Animated.View>
            {headerHeight != 0 && renderContent()}
        </>
    )
}

const styles = StyleSheet.create({
    titleBackground: {
        width: screenWidth,
        backgroundColor: '#ff8f17',
        ...Platform.select({
            'ios': {
                paddingVertical: '5%'
            },
            'android': {
                paddingVertical: '10%'
            }
        }),
        paddingHorizontal: '5%',
        position: 'absolute',
        ...Platform.select({
            'ios': {
                top: '8.5%'
            },
            'android': {
                top: '6%'
            }
        }),
        left: 0
    },
    title: {
        fontWeight: 'bold',
        fontSize: 36,
        color: '#fff',
    },
    addingAParkingLotToText: {
        fontWeight: '600',
        fontSize: 16,
        textTransform: 'uppercase',
        color: '#fff',
        ...Platform.select({
            'android': {
                marginTop: '-5%'
            }
        })
    },
    descriptionText: {
        color: '#fff',
        marginTop: '4%',
        ...Platform.select({
            'ios': {
                marginBottom: '0%'
            },
            'android': {
                marginBottom: '-4%'
            }
        })
    },
    backAndCancelHeaderView: {
        marginHorizontal: '5%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        ...Platform.select({
            'ios': {
                marginTop: '3%'
            },
            'android': {
                marginTop: '9%',
            }
        })
    },
    backAndCancelHeaderBackground: {
        backgroundColor: '#ff8f17',
        zIndex: 10
    },
    backButtonView: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: 25,
        height: 25,
        borderRadius: 20
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16
    },
    submitTextButton: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    submitTextView: {
        height: 20,
        width: 70,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    contentTitleText: {
        ...Platform.select({
            'ios': {
                marginTop: '4%'
            },
            'android': {
                marginTop: '4%'
            }
        })
    },
    placeDetailsContainer: {
        paddingHorizontal: '5%',
    },
    placeDetailsTextContainer: {
        ...Platform.select({
            'ios': {
                marginTop: '4%',
                marginBottom: '8%'
            },
            'android': {
                marginTop: '-1%',
                marginBottom: '1%'
            }
        }),
    },
    parkingFeeTableView: {
        ...Platform.select({
            'ios': {
                marginTop: '-3%',
                marginBottom: '2%'
            },
            'android': {
                marginTop: '-1%',
                marginBottom: '2%'
            }
        })
    }
})

export default ContributeSecondPage;