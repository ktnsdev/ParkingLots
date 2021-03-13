import React, { Component, createRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import MapView, { Marker } from 'react-native-maps';
import TextWithFont from '../TextWithFont';
import { config } from '../../../config';

const autocompleteURL = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input='
const placeSearchURL = 'https://maps.googleapis.com/maps/api/place/details/json?place_id='

class ContributeMapAndAutocomplete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            autocompleteList: [],
            selectedPlaceName: '',
            selectedPlaceAddress: '',
            selectedPlaceId: '',
            selectedPlaceType: '',
            region: {
                latitude: 0.0,
                longitude: 0.0,
                latitudeDelta: 0.0,
                longitudeDelta: 0.0
            },
            selectedPlaceDetailsEN: {},
            selectedPlaceDetailsTH: {}
        }

        this.autocompleteTextInput = React.createRef();

        this.onTextChange = this.onTextChange.bind(this);
        this.getCurrentLocation = this.getCurrentLocation.bind(this);
        this.onPlacePressed = this.onPlacePressed.bind(this);
        this.getMapLocation = this.getMapLocation.bind(this);
        this.getCurrentLocation = this.getCurrentLocation.bind(this);
        this.getSelectedPlaceDetails = this.getSelectedPlaceDetails.bind(this);
        this.nextPage = this.nextPage.bind(this);
    }

    componentDidMount() {
        this.getMapLocation();
    }

    getMapLocation() {
        return this.getCurrentLocation().then(position => {
            if (position) {
                this.setState({
                    region: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: 0.004,
                        longitudeDelta: 0.004
                    }
                })
            }
        });
    }

    getCurrentLocation() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(position => resolve(position), e => reject(e));
        });
    }

    onTextChange(query: String) {
        if ([...query].length >= 3) {
            this.getCurrentLocation();
            console.log('query: ' + query)
            console.log('fetching autocomplete')

            let tempAutocompleteList = [];
            fetch(autocompleteURL + query + '&components=country:th&language=en_GB&key=' + config.placesAPIKey + '&sessiontoken=' + config.sessionkey)
                .then(response => response.json())
                .then((jsonData) => {
                    for (let i = 0; i < 7; i++) {
                        if (jsonData.predictions[i] == undefined) {
                            break;
                        }
                        tempAutocompleteList.push(jsonData.predictions[i]);
                    }
                    this.setState({
                        autocompleteList: tempAutocompleteList
                    })
                });
            console.log(this.state.autocompleteList);
        } else {
            this.setState({
                autocompleteList: []
            })
        }
    }

    onPlacePressed(placeId, placeName, placeAddress) {
        this.setState({
            selectedPlaceId: placeId,
            selectedPlaceAddress: placeAddress,
            selectedPlaceName: placeName,
            autocompleteList: []
        })
        this.autocompleteTextInput.current.clear();
        this.getSelectedPlaceDetails(placeId)
    }

    getSelectedPlaceDetails(placeId) {
        fetch(placeSearchURL + placeId + '&language=th&fields=name,address_component,plus_code,formatted_address,name,geometry,type&key=' + config.placesAPIKey + '&sessiontoken=' + config.sessionkey)
        .then(response => response.json())
        .then((jsonData) => {
            console.log(jsonData)
            this.setState({
                selectedPlaceDetailsTH: jsonData.result,
            })
        });

        fetch(placeSearchURL + placeId + '&fields=name,address_component,plus_code,formatted_address,name,geometry,type&key=' + config.placesAPIKey + '&sessiontoken=' + config.sessionkey)
            .then(response => response.json())
            .then((jsonData) => {
                console.log(jsonData)
                this.setState({
                    selectedPlaceDetailsEN: jsonData.result,
                    region: {
                        latitude: jsonData.result.geometry.location.lat,
                        longitude: jsonData.result.geometry.location.lng,
                        latitudeDelta: 0.004,
                        longitudeDelta: 0.004
                    }
                })
            });
    }

    getCurrentLocation = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(position => resolve(position), e => reject(e));
        });
    }

    nextPage() {
        this.props.navigation.navigate('ContributeSecondPage', { paramKey: {'en': this.state.selectedPlaceDetailsEN, 'th': this.state.selectedPlaceDetailsTH }});
    }

    render() {
        return (
            <>
                <View style={styles.textInputContainer}>
                    <TouchableOpacity onPress={() => { }}>
                        <TextInput ref={this.autocompleteTextInput} onChangeText={query => this.onTextChange(query)} style={styles.textInputStyle} placeholder={'Search places'} clearButtonMode={'always'}></TextInput>
                    </TouchableOpacity>
                </View>

                <View style={styles.autocompleteContainer}>
                    <FlatList
                        data={this.state.autocompleteList}
                        renderItem={({ item }) => (
                            <>
                                <TouchableOpacity onPress={() => this.onPlacePressed(item.place_id, item.structured_formatting.main_text, item.structured_formatting.secondary_text)}>
                                    <View style={styles.autocompleteInsideContainer}>
                                        <TextWithFont iosFontWeight={'bold'} androidFontWeight={'bold'} fontSize={16}>{item.structured_formatting.main_text}</TextWithFont>
                                        <TextWithFont fontSize={14}>{item.structured_formatting.secondary_text}</TextWithFont>
                                    </View>
                                </TouchableOpacity>
                            </>
                        )}
                    />
                </View>

                {this.state.selectedPlaceId != '' &&
                    <View style={styles.selectedPlaceView}>
                        <TextWithFont fontSize={16} color={'#666'} iosFontWeight={'400'} androidFontWeight={'medium'}>You're adding a parking lot to</TextWithFont>
                        <TextWithFont fontSize={28} iosFontWeight={'bold'} androidFontWeight={'bold'}>{this.state.selectedPlaceName}</TextWithFont>
                        <TextWithFont fontSize={18} iosFontWeight={'bold'} androidFontWeight={'semibold'} color={'#666'}>{this.state.selectedPlaceAddress}</TextWithFont>
                    </View>
                }

                <View style={{
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
                            borderRadius: 12
                        }}
                        region={this.state.region}
                        provider={MapView.PROVIDER_GOOGLE}
                        showsUserLocation={true}
                    >
                        <Marker
                            coordinate={{ latitude: this.state.region.latitude, longitude: this.state.region.longitude }}
                        />
                    </MapView>
                </View>

                {(this.state.selectedPlaceId != '' && this.state.selectedPlaceDetailsEN != {}) &&
                    <View style={styles.continueButtonView}>
                        <TouchableOpacity style={styles.continueButton} onPress={this.nextPage} activeOpacity={0.8}>
                            <View>
                            <TextWithFont fontSize={18} iosFontWeight={'bold'} androidFontWeight={'bold'} color={'#fff'}>Continue</TextWithFont>
                            </View>
                        </TouchableOpacity>
                    </View>
                }


                {(this.state.selectedPlaceId != '' && this.state.selectedPlaceDetailsEN == {}) != '' &&
                    <TouchableOpacity activeOpacity={0.8}>
                        <View style={styles.continueButtonView}>
                            <View style={styles.disabledContinueButton}>
                                <TextWithFont fontSize={18} iosFontWeight={'bold'} androidFontWeight={'bold'} color={'#fff'}>Continue</TextWithFont>
                            </View>
                        </View>
                    </TouchableOpacity>
                }
            </>
        )
    };
}

const styles = StyleSheet.create({
    textInputStyle: {
        height: 50,
        width: '100%',
        paddingHorizontal: '5%',
        marginRight: '3%',
        backgroundColor: '#ddd',
        borderRadius: 12
    },
    textInputTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        textTransform: 'uppercase',
        color: '#666',
        marginBottom: '2%'
    },
    textInputContainer: {
        marginTop: '2%',
        marginBottom: '2%',
    },
    autocompleteContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginVertical: '2%',
    },
    placeTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    placeSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    autocompleteInsideContainer: {
        padding: '5%'
    },
    lineBreak: {
        marginHorizontal: '5%',
        borderBottomColor: '#404040',
        borderBottomWidth: 0.5,
        marginVertical: '3%'
    },
    selectedPlaceView: {
        marginVertical: '3%',
    },
    selectedPlaceTitle: {
        fontWeight: 'bold',
        fontSize: 28,
    },
    selectedPlaceSubtitle: {
        fontSize: 18,
        color: '#666',
        fontWeight: 'bold'
    },
    youreAddingText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '400',

    },
    continueButtonView: {
        marginVertical: '5%',
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    continueButton: {
        backgroundColor: '#ff8f17',
        borderRadius: 30,
        width: '50%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    disabledContinueButton: {
        backgroundColor: '#404040',
        borderRadius: 30,
        width: '50%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    continueButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff'
    }
})

export default ContributeMapAndAutocomplete;