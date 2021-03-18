import React, { useState, useEffect } from 'react';
import { Text, FlatList, View, TouchableOpacity, Platform } from 'react-native'
import GrayDropdownBox from '../GrayDropdownBox';
import TextWithFont from '../TextWithFont';
import TitleWithSubtitle from '../TitleWithSubtitle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GrayTextBoxWithTitle from '../GrayTextBoxWithTitle';
import GrayFeeInput from '../GrayFeeInput';

const ParkingFeeConditionAdder = (props) => {
    const [conditions, setCondition] = useState(0);
    const [afterFree, setAfterFree] = useState([]);

    useEffect(() => {
        console.log(afterFree);
        console.log('\n');
    }, [afterFree, conditions])

    function onAddConditionPressed() {
        setCondition(conditions + 1);
        addConditionToArray();
    }

    function addConditionToArray() {
        let tempArray = [];
        for (let i = 0; i < conditions; i++) {
            tempArray.push(afterFree[i]);
        }

        let nextHour = conditions;

        tempArray.push({ 'time': nextHour + props.firstFreeTime + 1, 'fee': 0 });
        setAfterFree(tempArray);
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
        for (let i = 0; i < conditions - 1; i++) {
            tempArray.push(afterFree[i]);
        }

        setAfterFree(tempArray);
    }

    function onFeeIsAdded(data)  {
        let tempArray = [];
        for (let i = 0; i < afterFree.length; i++) {
            if (afterFree[i].time == data.time) {
                tempArray.push(data);
            } else {
                tempArray.push(afterFree[i]);
            }
        }

        setAfterFree(tempArray);
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
                        <TextWithFont fontSize={16} androidFontWeight={'bold'} iosFontWeight={'600'}>Fee (Per {props.firstUnitTime == 'day' ? 'day' : 'hour'})</TextWithFont>
                    </View>
                </View>
                <View style={{ backgroundColor: '#666', height: 0.7, width: '100%', marginLeft: 3, marginRight: 3, marginVertical: 0 }} />
            </>
        )
    }

    function renderFirstFreeTime() {
        return (
            <>
                <View style={{
                    flexDirection: 'row',
                    marginVertical: 5
                }}>
                    <View style={{ width: '49.9%', alignItems: 'center' }}>
                        {props.firstFreeTime != 0 &&
                            <>
                                <View style={{ marginVertical: 6 }}>
                                    <TextWithFont {...props} fontSize={16} androidFontWeight={'bold'} iosFontWeight={'600'}>First {props.firstFreeTime} {props.firstUnitTime}{props.firstFreeTime > 1 ? 's' : ''}</TextWithFont>
                                </View>
                            </>
                        }
                    </View>

                    <View style={{ backgroundColor: '#666', width: '0.2%', marginVertical: -5 }} />

                    <View style={{ width: '49.9%', alignItems: 'center' }}>
                        {props.firstFreeTime != 0 &&
                            <>
                                <View style={{ marginVertical: 6 }}>
                                    <TextWithFont {...props} fontSize={16} androidFontWeight={'bold'} iosFontWeight={'600'}>Free</TextWithFont>
                                </View>
                            </>
                        }
                    </View>
                </View>
            </>
        )
    }

    function renderConditions() {
        return (
            <FlatList
                style={{ width: '100%' }}
                scrollEnabled={false}
                data={afterFree}
                renderItem={({ item }) => (
                    <>
                        <View style={{ backgroundColor: '#666', height: 0.7, width: '100%', marginLeft: 3, marginRight: 3, marginVertical: 0 }} />
                        <View style={{
                            flexDirection: 'row',
                            marginVertical: 5
                        }}>
                            <View style={{ width: '49.9%', alignItems: 'center' }}>
                                <View style={{ marginVertical: 6, alignItems: 'center' }}>
                                    {item == afterFree[afterFree.length - 1] && <TextWithFont fontSize={16} androidFontWeight={'bold'} iosFontWeight={'600'}>After {props.firstUnitTime == 'day' ? 'day' : 'hour'} {item.time}</TextWithFont>}
                                    {item != afterFree[afterFree.length - 1] && <TextWithFont fontSize={16} androidFontWeight={'bold'} iosFontWeight={'600'}>Hour {item.time}</TextWithFont>}
                                </View>
                            </View>

                            <View style={{ backgroundColor: '#666', width: '0.2%', marginVertical: -5 }} />

                            <View style={{ width: '49.9%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                                <GrayFeeInput
                                    width={50}
                                    height={28}
                                    keyboardType={'number-pad'}
                                    textAlign={'center'}
                                    multiline={false}
                                    hour={item.time}
                                    onChangeFee={onFeeIsAdded}
                                />
                                <TextWithFont iosFontWeight={'600'} androidFontWeight={'bold'}>  THB</TextWithFont>
                            </View>
                        </View>
                    </>
                )}
            />
        )
    }

    return (
        <>
            <TitleWithSubtitle {...props} title={props.title} subtitle={props.subtitle} titleFontSize={18} />

            <View style={{
                marginTop: '2%',
                paddingVertical: '3%',
                paddingHorizontal: '4%',
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
                {renderHeader()}
                {renderFirstFreeTime()}
                {renderConditions()}
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