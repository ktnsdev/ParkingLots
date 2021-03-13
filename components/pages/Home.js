import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Dimensions, TouchableHighlight, Platform, Animated } from 'react-native';
import MapView, { AnimatedRegion } from 'react-native-maps';
import HomeBottomSheet from '../widgets/HomeBottomSheet';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TextWithFont from '../widgets/TextWithFont';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
const HEADER_EXPANDED_HEIGHT = 500
const HEADER_COLLAPSED_HEIGHT = 0

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            region: new AnimatedRegion({ latitude: 13.764894, longitude: 100.538283, latitudeDelta: 0.3, longitudeDelta: 0.3 }),
            _initialRegion: { latitude: 13.764894, longitude: 100.538283, latitudeDelta: 0.3, longitudeDelta: 0.3 },
            scrollY: new Animated.Value(0)
        }

        this.recentre = this.recentre.bind(this);
        this.getCurrentLocation = this.getCurrentLocation.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.region != nextState.region
    }

    componentDidMount() {
        this.recentre();
    }

    recentre() {
        return this.getCurrentLocation().then(position => {
            if (position) {
                this.state.region.timing({
                    latitude: position.coords.latitude + 0.002,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.007,
                    longitudeDelta: 0.007
                }).start();
            }
            this.setState({ mapIsMoved: false });
        });
    }

    getCurrentLocation = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(position => resolve(position), e => reject(e));
        });
    }

    render() {
        const headerOpacity = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
            outputRange: [2, 0],
            extrapolate: 'clamp'
        });

        return (
            <>
                <StatusBar style='dark'></StatusBar>
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    bouncesZoom={true}
                    scrollEventThrottle={16}
                    onScroll={Animated.event(
                        [{
                            nativeEvent: {
                                contentOffset: {
                                    y: this.state.scrollY
                                }
                            }
                        }])}
                >
                    <View style={{ flex: 1 }}>
                        <View style={{ top: 0 }}>
                            <MapView.Animated
                                contentContainerStyle={StyleSheet.absoluteFillObject}
                                style={{ height: screenHeight, width: screenWidth, marginTop: -0.219 * screenHeight, marginBottom: -0.001 * screenHeight }}
                                initialRegion={this.state.initialRegion}
                                region={this.state.region}
                                provider={MapView.PROVIDER_GOOGLE}
                                showsUserLocation={true}
                            />
                        </View>
                        <View>
                            <HomeBottomSheet style={{ marginTop: '-2%' }} />
                        </View>
                    </View>
                </ScrollView>

                {headerOpacity != 0 &&
                    <Animated.View style={styles.header} opacity={headerOpacity} pointerEvents={'box-none'}>
                        <Animated.View style={styles.card_view} opacity={headerOpacity}>
                            <TextWithFont iosFontWeight={'600'} androidFontWeight={'semibold'} fontSize={18} color={'#aaa'}>🔍  Find a parking lot</TextWithFont>
                        </Animated.View>
                        <TouchableHighlight style={styles.recentreButtonView} onPress={this.recentre} underlayColor='#ddd'>
                            <Animated.View opacity={headerOpacity}>
                                <Icon name='gps-fixed' size={24} color='#55555' backgroundColor='#fffff00'></Icon>
                            </Animated.View>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.contributeButtonView} onPress={() => this.props.navigation.navigate('Contribute')} underlayColor='#ddd'>
                            <Animated.View opacity={headerOpacity}>
                                <Icon name='add' size={24} color='#55555' backgroundColor='#fffff00'></Icon>
                            </Animated.View>
                        </TouchableHighlight>
                    </Animated.View>
                }
            </>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
    },
    scrollView: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff'
    },
    card_view: {
        height: 60,
        width: '90%',
        position: 'absolute',
        top: '5%',
        backgroundColor: '#fff',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
    },
    placeholder_text: {
        color: '#aaa',
        fontSize: 18,
        ...Platform.select({
            'ios': {
                fontWeight: '600'
            }
        })
    },
    recentreButtonView: {
        width: 45,
        height: 45,
        position: 'absolute',
        right: '5%',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
        ...Platform.select({
            ios: {
                top: '12.5%',
            },
            android: {
                top: '13%',
            }
        }),
    },
    contributeButtonView: {
        width: 45,
        height: 45,
        position: 'absolute',
        right: '5%',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
        ...Platform.select({
            ios: {
                top: '18%',
            },
            android: {
                top: '19%',
            }
        }),
    }
});

export default Home;