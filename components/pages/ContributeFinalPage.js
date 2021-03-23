import React, { Component, useEffect, useRef, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, View, Platform, TextInput, TouchableOpacity, ScrollView, Alert, BackHandler, Animated, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, { Marker } from 'react-native-maps';
import GrayTextBoxWithTitle from '../widgets/GrayTextBoxWithTitle';
import TextWithFont from '../widgets/TextWithFont';

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
        console.log(route.params.paramKey.contributionData.data)
        let tempAfterFree = {};

        if (!(Object.keys(route.params.paramKey.contributionData).length === 0)) {
            for (let i = 0; i < route.params.paramKey.contributionData.data.length; i++) {
                tempAfterFree[route.params.paramKey.contributionData.data[i].time] = route.params.paramKey.contributionData.data[i].fee
            }
        }

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
                'free': Object.keys(route.params.paramKey.contributionData).length === 0 ? true : false,
                'after_free': tempAfterFree
            },
            'verified': false,
            'last_updated': (new Date()).toISOString()
        })
    }

    //HANDLE BACK BUTTON
    function onBackPressed() {
        navigation.goBack()
    }

    //HANDLE SUBMIT BUTTON
    function onSubmitPressed() {

    }

    //SUBMIT CONTRIBUTION DATA TO SERVER
    function submit() {

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

                        <Text style={styles.contentTitleText}>Parking Lot Details</Text>
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
        width: 60,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    contentTitleText: {
        fontSize: 24,
        fontWeight: 'bold',
        ...Platform.select({
            'ios': {
                marginTop: '1%'
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
    }
})

export default ContributeSecondPage;