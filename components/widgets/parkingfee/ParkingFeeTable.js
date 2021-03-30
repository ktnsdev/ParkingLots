import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, Platform, TextInputComponent, FlatList } from 'react-native';
import { Divider } from 'react-native-elements'
import TextWithFont from '../TextWithFont';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ParkingFeeTable = (props) => {
    const DAY_IN_MINUTE = 1440;
    const HOUR_IN_MINUTE = 60;

    const [priceArray, setPriceArray] = useState([]);
    const [unitTime, setUnitTime] = useState('default');
    const [firstFreeTime, setFirstFreeTime] = useState({ 'day': 0, 'hour': 0, 'minute': 0 });

    useEffect(() => {
        reformatPriceArray();
        reformatFirstFreeTime();
    }, [])

    function reformatPriceArray() {
        let tempPriceArray = [];

        Object.keys(props.price.after_free).map((time, iteration) => {
            var d = Math.floor(time / 1440);
            var h = Math.floor((time - (d * 1440)) / 60);
            var m = Math.round(time % 60);

            if (tempPriceArray.length != 0) {
                if (tempPriceArray[tempPriceArray.length - 1].fee == props.price.after_free[time]) {
                    tempPriceArray[tempPriceArray.length - 1] = {
                        'time': {
                            'day': tempPriceArray[tempPriceArray.length - 1].time.day,
                            'hour': tempPriceArray[tempPriceArray.length - 1].time.hour,
                            'minute': tempPriceArray[tempPriceArray.length - 1].time.minute
                        },
                        'fee': props.price.after_free[time],
                        'time_end': {
                            'day': d,
                            'hour': h,
                            'minute': m
                        }
                    }
                } else {
                    tempPriceArray.push({ 'time': { 'day': d, 'hour': h, 'minute': m }, 'fee': props.price.after_free[time] });
                }
            } else {
                tempPriceArray.push({ 'time': { 'day': d, 'hour': h, 'minute': m }, 'fee': props.price.after_free[time] });
            }
        })
        setPriceArray(tempPriceArray);
    }

    function reformatFirstFreeTime() {
        if (props.price.first_free != 0) {
            var d = Math.floor(props.price.first_free / 1440);
            var h = Math.floor((props.price.first_free - (d * 1440)) / 60);
            var m = Math.round(props.price.first_free % 60);

            setFirstFreeTime({ 'day': d, 'hour': h, 'minute': m });
        }
    }

    function renderHeader() {
        return (
            <>
                <View style={{
                    flexDirection: 'row',
                    marginTop: 3,
                    marginBottom: 10
                }}>
                    <View style={{ width: '49.9%', alignItems: 'center' }}>
                        <TextWithFont fontSize={16} androidFontWeight={'bold'} iosFontWeight={'600'}>Parking Time</TextWithFont>
                    </View>

                    <View style={{ backgroundColor: '#666', width: '0.2%', marginTop: '-1%', marginBottom: '-3%' }} />

                    <View style={{ width: '49.9%', alignItems: 'center' }}>
                        <TextWithFont fontSize={16} androidFontWeight={'bold'} iosFontWeight={'600'}>Fee {props.price.unit_time == undefined ? '(Per unit time)' : props.price.unit_time == 'minute' ? '(Per hour)' : '(Per ' + props.price.unit_time + ')'}</TextWithFont>
                    </View>
                </View>
                <View style={{ backgroundColor: '#666', height: 0.7, width: '100%', marginLeft: 3, marginRight: 3, marginVertical: 0 }} />
            </>
        )
    }

    function renderFirstFreeTime() {
        if (props.price.first_free != 0) {
            return (
                <>
                    <View style={{
                        flexDirection: 'row',
                        marginVertical: 5
                    }}>
                        <View style={{ width: '49.9%', alignItems: 'center' }}>
                            {props.price.first_free != 0 &&
                                <>
                                    <View style={{ marginVertical: 6 }}>
                                        <TextWithFont fontSize={16} androidFontWeight={'bold'} iosFontWeight={'600'}>
                                            First {firstFreeTime.day == 0 ? '' : '' + firstFreeTime.day + ' day'}{(firstFreeTime.day != 0 && firstFreeTime.day != 1) ? 's' : '' + (firstFreeTime.hour != 0 || firstFreeTime.minute != 0) && firstFreeTime.day != 0 ? ' ' : ''}
                                            {firstFreeTime.hour == 0 ? '' : '' + firstFreeTime.hour + ' hour'}{(firstFreeTime.hour != 0 && firstFreeTime.hour != 1) ? 's' : '' + (firstFreeTime.minute != 0) && firstFreeTime.hour != 0 ? ' ' : ''}
                                            {firstFreeTime.minute == 0 ? '' : '' + firstFreeTime.minute + ' minute'}{(firstFreeTime.minute != 0 && firstFreeTime.minute != 1) ? 's' : ''}
                                        </TextWithFont>
                                    </View>
                                </>
                            }
                        </View>

                        <View style={{ backgroundColor: '#666', width: '0.2%', marginVertical: -5 }} />

                        <View style={{ width: '49.9%', alignItems: 'center' }}>
                            {props.first_free != 0 &&
                                <>
                                    <View style={{ marginVertical: 6 }}>
                                        <TextWithFont fontSize={16} androidFontWeight={'bold'} iosFontWeight={'600'}>Free</TextWithFont>
                                    </View>
                                </>
                            }
                        </View>
                    </View>
                </>
            )
        }
    }

    function renderConditions() {
        return (
            <>
                <FlatList
                    style={{ width: '100%' }}
                    scrollEnabled={false}
                    data={priceArray}
                    renderItem={({ item }) => (
                        <>
                            {(props.price.first_free != 0) && <Divider style={{ backgroundColor: '#666', height: 0.7, width: '100%', marginLeft: 3, marginRight: 3, marginVertical: 0 }} />}
                            <View style={{
                                flexDirection: 'row',
                                marginVertical: 5
                            }}>
                                <View style={{ width: '49.9%', alignItems: 'center' }}>
                                    <View style={{ marginVertical: 6, alignItems: 'center' }}>
                                        {(item.time_end == undefined || item == priceArray[priceArray.length - 1]) && props.price.first_free != 0 &&
                                            <View style={{ marginBottom: -6 }}>
                                                <TextWithFont fontSize={16} androidFontWeight={'bold'} iosFontWeight={'600'}>
                                                    {item == priceArray[priceArray.length - 1] ? 'After that' : ''}
                                                </TextWithFont>
                                            </View>
                                        }
                                        {(item.time_end == undefined || item == priceArray[priceArray.length - 1]) && props.price.first_free == 0 &&
                                            <View style={{ marginBottom: -6 }}>
                                                <TextWithFont fontSize={16} androidFontWeight={'bold'} iosFontWeight={'600'}>
                                                    {item == priceArray[priceArray.length - 1] ? 'Flat rate' : ''}
                                                </TextWithFont>
                                            </View>
                                        }
                                        {(item.time_end != undefined && item != priceArray[priceArray.length - 1]) &&
                                            <TextWithFont fontSize={16} androidFontWeight={'bold'} iosFontWeight={'600'}>
                                                {item.time.day == 0 ? '' : '' + item.time.day}{(item.time.hour != 0 || item.time.minute != 0) && item.time.day != 0 ? ' ' : ''}
                                                {item.time.hour == 0 ? '' : '' + item.time.hour}{(item.time.minute != 0) && item.time.hour != 0 ? ' ' : ''}
                                                {item.time.minute == 0 ? '' : '' + item.time.minute}
                                              –
                                             {item.time_end.day == 0 ? '' : '' + item.time_end.day + ' day'}{(item.time_end.day != 0 && item.time_end.day != 1) ? 's' : '' + (item.time_end.hour != 0 || item.time_end.minute != 0) && item.time_end.day != 0 ? ' ' : ''}
                                                {item.time_end.hour == 0 ? '' : '' + item.time_end.hour + ' hour'}{(item.time_end.hour != 0 && item.time_end.hour != 1) ? 's' : '' + (item.time_end.minute != 0) && item.time_end.hour != 0 ? ' ' : ''}
                                                {item.time_end.minute == 0 ? '' : '' + item.time_end.minute + ' minute'}{(item.time_end.minute != 0 && item.time_end.minute != 1) ? 's' : ''}
                                            </TextWithFont>
                                        }
                                    </View>
                                </View>

                                <View style={{ backgroundColor: '#666', width: '0.2%', marginVertical: -5 }} />

                                <View style={{ width: '49.9%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                                    {item == priceArray[priceArray.length - 1] &&
                                        <View style={{ marginBottom: -6 }}>
                                            <TextWithFont iosFontWeight={'600'} androidFontWeight={'bold'} fontSize={16}>{item.fee} THB</TextWithFont>

                                        </View>
                                    }
                                    {item != priceArray[priceArray.length - 1] &&
                                        <TextWithFont iosFontWeight={'600'} androidFontWeight={'bold'} fontSize={16}>{item.fee} THB</TextWithFont>
                                    }
                                </View>
                            </View>
                        </>
                    )}
                />
            </>
        )
    }

    return (
        <>
            <View style={{
                marginTop: '2%',
                paddingVertical: '3%',
                paddingHorizontal: '4%',
                backgroundColor: '#fff',
                borderRadius: 12,
                shadowColor: "#333",
                shadowOffset: {
                    width: 0,
                    height: 0,
                },
                shadowOpacity: 0.29,
                shadowRadius: 2,
                elevation: 7,
            }}>
                {props.price.free == true &&
                    <>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: '2%' }}>
                            <Icon name={'check-circle-outline'} size={32} color={'#66bb6a'} />
                            <View style={{ justifyContent: 'center', marginLeft: '3%' }}>
                                <TextWithFont fontSize={20} androidFontWeight={'bold'} iosFontWeight={'600'}>Free of charge</TextWithFont>

                            </View>
                        </View>
                    </>
                }
                {props.price.free == false &&
                    <>
                        {renderHeader()}
                        {renderFirstFreeTime()}
                        {renderConditions()}
                    </>
                }
            </View>
        </>
    )
}

export default ParkingFeeTable;