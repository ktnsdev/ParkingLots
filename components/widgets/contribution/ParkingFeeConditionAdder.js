import React, { useState } from 'react';
import { Text, FlatList, View, TouchableOpacity, Platform } from 'react-native'
import GrayDropdownBox from '../GrayDropdownBox';
import TextWithFont from '../TextWithFont';
import TitleWithSubtitle from '../TitleWithSubtitle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GrayTextBoxWithTitle from '../GrayTextBoxWithTitle';

const ParkingFeeConditionAdder = (props) => {
    const [conditions, setCondition] = useState(0);
    const [afterFree, setAfterFree] = useState([]);
    
    function onAddConditionPressed() {
        let newCondition = conditions + 1
        setCondition(newCondition);
        addConditionToArray();
    }

    function addConditionToArray() {
        let tempArray = [];
        for (let i = 0; i < conditions; i++) {
            tempArray.push(afterFree[i]);
        }

        let nextHour = conditions;
        tempArray.push({'hour': nextHour, 'fee': 0});
        setAfterFree(tempArray);
        console.log(afterFree);
    }

    function onRemoveConditionPressed() {
        if (conditions == 0) {
            return;
        }

        setCondition(conditions - 1);
        removeConditionFromArray();
    }

    function removeConditionFromArray() {
        let tempArray = [];
        while (tempArray.length != conditions - 1) {
            tempArray.push({});
        }

        setAfterFree(tempArray);
    }

    return (
        <>
            <TitleWithSubtitle {...props} title={props.title} subtitle={props.subtitle} titleFontSize={18} />

            <View style={{
                flexDirection: 'row',
                marginTop: '2%',
                paddingVertical: '3%',
                paddingHorizontal: '3%',
                backgroundColor: '#f5f5f5',
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
                <View style={{ width: '49.9%', alignItems: 'center' }}>
                    <TextWithFont fontSize={16} androidFontWeight={'bold'} iosFontWeight={'600'}>Parking Time</TextWithFont>
                    <View style={{ backgroundColor: '#666', height: 0.7, width: '100%', marginHorizontal: '-0.5%', marginVertical: '4%' }} />
                    {props.firstFreeTime != 0 &&
                        <>
                            <View style={{ marginVertical: 6 }}>
                                <TextWithFont {...props} fontSize={16} androidFontWeight={'bold'} iosFontWeight={'600'}>First {props.firstFreeTime} {props.firstUnitTime}{props.firstFreeTime > 1 ? 's' : ''}</TextWithFont>
                            </View>
                        </>
                    }

                    <FlatList
                        style={{ width: '100%' }}
                        scrollEnabled={false}
                        data={afterFree}
                        renderItem={({ item }) => (
                            <>
                                <View style={{ backgroundColor: '#666', height: 0.7, width: '100%', marginLeft: '-0.5%', marginRight: 3, marginVertical: 4 }} />
                                <View style={{ marginVertical: 6, alignItems: 'center' }}>
                                    <TextWithFont fontSize={16} androidFontWeight={'bold'} iosFontWeight={'600'}>{conditions}</TextWithFont>
                                </View>
                            </>
                        )}
                    />
                </View>

                <View style={{ backgroundColor: '#666', width: '0.2%', marginVertical: '-0.5%' }} />

                <View style={{ width: '49.9%', alignItems: 'center' }}>
                    <TextWithFont fontSize={16} androidFontWeight={'bold'} iosFontWeight={'600'}>Fee</TextWithFont>
                    <View style={{ backgroundColor: '#666', height: 0.7, width: '100%', marginHorizontal: '-0.5%', marginVertical: '4%' }} />
                    {props.firstFreeTime != 0 &&
                        <>
                            <View style={{ marginVertical: 6 }}>
                                <TextWithFont {...props} fontSize={16} androidFontWeight={'bold'} iosFontWeight={'600'}>Free</TextWithFont>
                            </View>
                        </>
                    }

                    <FlatList
                        style={{ width: '100%' }}
                        scrollEnabled={false}
                        data={afterFree}
                        renderItem={({ item }) => (
                            <>
                                <View style={{ backgroundColor: '#666', height: 0.7, width: '100%', marginLeft: '-0.5%', marginRight: 3, marginVertical: 4 }} />
                                <View style={{ marginVertical: 6, alignItems: 'center' }}>
                                    <TextWithFont fontSize={16} androidFontWeight={'bold'} iosFontWeight={'600'}>{conditions}</TextWithFont>
                                </View>
                            </>
                        )}
                    />
                </View>
            </View>

            <View style={{
                paddingHorizontal: '5%',

                ...Platform.select({
                    'android': {
                        marginTop: '4%',
                        flexDirection: 'row',
                        justifyContent: 'center'
                    },
                    'ios': {
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                    }
                })
            }}>
                <TouchableOpacity onPress={() => onRemoveConditionPressed()} style={{ ...Platform.select({ 'ios': { marginTop: '3%' } }) }}>
                    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Icon name='keyboard-arrow-up' color={'#f06343'} size={20} />
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <TextWithFont color={'#f06343'} iosFontWeight={'600'} androidFontWeight={'semibold'} textTransform={'uppercase'}>{Platform.select({ 'android': 'Remove        ', 'ios': 'Remove condition' })}</TextWithFont>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => onAddConditionPressed()} style={{ ...Platform.select({ 'ios': { marginTop: '3%' } }) }}>
                    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Icon name='keyboard-arrow-down' color={'#0084ff'} size={20} />
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <TextWithFont color={'#0084ff'} iosFontWeight={'600'} androidFontWeight={'semibold'} textTransform={'uppercase'}>{Platform.select({ 'android': 'Add', 'ios': 'Add condition' })}</TextWithFont>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default ParkingFeeConditionAdder;