import React, { Component, useEffect, useRef, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, View, Platform, TextInput, TouchableOpacity, ScrollView, Alert, BackHandler, Animated, Dimensions, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, { Marker } from 'react-native-maps';
import GrayTextBoxWithTitle from '../widgets/GrayTextBoxWithTitle';
import YesNoButton from '../widgets/YesNoButton';
import ContributeParkingLotFee from '../widgets/contribution/ContributeParkingLotFee';
import TextWithFont from '../widgets/TextWithFont';
import TitleWithSubtitle from '../widgets/TitleWithSubtitle';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
const HEADER_MAX_HEIGHT = screenHeight * 0.25;
const HEADER_MIN_HEIGHT = 100;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const ContributeSecondPage = ({ route, navigation }) => {
    const region = {
        latitude: route.params.paramKey.en.geometry.location.lat,
        longitude: route.params.paramKey.en.geometry.location.lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
    }

    const [headerWidth, setHeaderWidth] = useState(0);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [isFree, setIsFree] = useState(false);
    const [completelyFilled, setCompletelyFilled] = useState(false);
    const [submitIsPressed, setSubmitIsPressed] = useState(false);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [contributionData, setContributionData] = useState({});

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true); // or some other action
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false); // or some other action
            }
        );

        const backAction = () => {
            onBackPressed({ navigation })
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        //HANDLE SUBMIT BUTTON WHEN KEYBOARD IS VISIBLE
        if (!isFree && submitIsPressed) {
            if (completelyFilled) {
                submitAlert({ navigation });
                setSubmitIsPressed(false);
            } else {
                notFinishedAlert();
                setSubmitIsPressed(false);
            }
        } else if (isFree && submitIsPressed) {
            submitAlert({ navigation });
            setSubmitIsPressed(false);
        }

        return () => {
            backHandler.remove();
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        }
    }, [completelyFilled, contributionData, isFree]);

    //GET DATA FROM CHILDREN
    function getIsCompletelyFilled(completelyFilledFromContributeParkingLotFee) {
        setCompletelyFilled(completelyFilledFromContributeParkingLotFee);
    }

    function getContributionData(contributionDataFromContributeParkingLotFee) {
        if (isFree) {
            setContributionData({'data': {}});
        } else {
            setContributionData({'data': contributionDataFromContributeParkingLotFee})
        }
    }

    function getIsFreeFromYesNoButton(data) {
        setIsFree(!data);
    }

    //HANDLE SUBMIT BUTTON
    function onSubmitPressed({ navigation }) {
        if (!isFree) {
            if (isKeyboardVisible) {
                Keyboard.dismiss();
                setSubmitIsPressed(true);
            } else {
                if (completelyFilled) {
                    submitAlert({ navigation });
                    setSubmitIsPressed(false);
                } else if (!completelyFilled) {
                    notFinishedAlert();
                    setSubmitIsPressed(false);
                }
            }
        } else {
            submitAlert({ navigation });
            setSubmitIsPressed(false);
        }
    }

    function submitAlert({ navigation }) {
        Alert.alert(
            'Submit contribution?',
            'Please make sure your provided information are as precise as possible.',
            [
                {
                    text: 'Let me check again',
                    style: 'cancel'
                },
                {
                    text: 'Submit',
                    onPress: () => goNext({ navigation }),
                    style: 'default'
                },
            ],
            { cancelable: true }
        );
    }

    function notFinishedAlert() {
        Alert.alert(
            'You\'re not done!',
            'Please make sure you have filled in all required fields',
            [
                {
                    text: 'OK',
                    style: 'default'
                },
            ],
            { cancelable: true }
        );
    }

    function onBackPressed({ navigation }) {
        Alert.alert(
            'Do you want to go back?',
            'All changes will be lost once you re-select a place.',
            [
                {
                    text: 'Continue contributing',
                },
                {
                    text: 'Go back anyway',
                    onPress: () => goBack({ navigation }),
                    style: 'destructive'
                },
            ],
            { cancelable: true }
        );
    }

    function goBack({ navigation }) {
        navigation.goBack();
    }

    function goNext() {
        navigation.navigate('ContributeFinalPage', { paramKey: {'contributionData': contributionData, 'placeDetails': route.params.paramKey}});
    }

    //ANIMATED VALUE
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

    function renderParkingFeeContribution() {
        return (
            <>
                <ContributeParkingLotFee
                    handleIsCompletelyFilled={getIsCompletelyFilled}
                    handleContributionData={getContributionData}
                />
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
                        <View style={styles.parkingLotFeeContainer}>
                            <TitleWithSubtitle
                                titleFontSize={22}
                                title={'Does ' + route.params.paramKey.en.name + ' charge you for parking?'}
                                subtitle={'If the place only offers you free parking for several hours, please select "Yes".'}
                            />

                            <View style={{ marginVertical: '2%' }}>
                                <YesNoButton initial={'y'} handleSelection={getIsFreeFromYesNoButton} />
                            </View>

                            <View style={styles.lineBreak} />
                            {!isFree && (
                                <>
                                    {renderParkingFeeContribution()}
                                </>
                            )}
                        </View>

                        <TextWithFont iosFontWeight={'bold'} androidFontWeight={'bold'} fontSize={22} style={{
                            ...Platform.select({
                                'ios': {
                                    marginTop: !isFree ? '0%' : '-3%'
                                },
                                'android': {
                                    marginTop: !isFree ? '3%' : '-3%'
                                }
                            })
                        }}>Parking Lot Details</TextWithFont>
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
                            <GrayTextBoxWithTitle placeholder={route.params.paramKey.en.name} title={'Name'} required={'*'} />
                            <GrayTextBoxWithTitle placeholder={route.params.paramKey.th.name} title={'Thai Name'} />
                            <GrayTextBoxWithTitle placeholder={route.params.paramKey.en.formatted_address} title={'Address'} required={'*'} />
                            <GrayTextBoxWithTitle placeholder={route.params.paramKey.en.geometry.location.lat} title={'Latitude'} required={'*'} />
                            <GrayTextBoxWithTitle placeholder={route.params.paramKey.en.geometry.location.lng} title={'Longitude'} required={'*'} />
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
                    <TouchableOpacity style={styles.backButtonView} onPress={() => onBackPressed({ navigation })}>
                        <Icon style={styles.backIcon} name='arrow-back' size={24} color='#fff' />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => onSubmitPressed({ navigation })}>
                        <View style={styles.submitTextView}>
                            <TextWithFont
                                color={'#fff'}
                                fontSize={18}
                                iosFontWeight={'bold'}
                                androidFontWeight={'bold'}>Next</TextWithFont>
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
                <Animated.View style={{ opacity: descriptionOpacity }}>
                    <TextWithFont fontSize={16} iosFontWeight={'600'} androidFontWeight={'semibold'} color={'#fff'} textTransform={'uppercase'} style={{
                        ...Platform.select({
                            'android': {
                                marginTop: '-5%'
                            }
                        })
                    }}>Adding a parking lot to</TextWithFont>
                </Animated.View>
                <Animated.View style={{ transform: [{ translateY: titleTextTranslateY }] }}>
                    <TextWithFont fontSize={36} iosFontWeight={'bold'} androidFontWeight={'bold'} color={'#fff'}>{route.params.paramKey.en.name}</TextWithFont>
                </Animated.View>
                <Animated.View style={{ opacity: descriptionOpacity }}>
                    <TextWithFont color={'#fff'} style={{
                        marginTop: '3%',
                        ...Platform.select({
                            'ios': {
                                marginBottom: '0%'
                            },
                            'android': {
                                marginBottom: '-4%'
                            }
                        })
                    }}>Please provide us more information about pricing and place details.</TextWithFont>
                </Animated.View>
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
    submitTextView: {
        height: 20,
        width: 60,
        alignItems: 'flex-end',
        justifyContent: 'center'
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
    parkingLotFeeContainer: {
        marginBottom: '5%',
        ...Platform.select({
            'android': {
                marginTop: '3%'
            }
        })
    },
    lineBreak: {
        borderBottomColor: '#404040',
        borderBottomWidth: 0.5,
        marginTop: "3%",
        marginBottom: "3%"
    }
})

export default ContributeSecondPage;