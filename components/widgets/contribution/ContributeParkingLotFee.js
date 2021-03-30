import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Divider } from 'react-native-elements'
import GrayTextInputWithTitle from '../GrayTextInputWIthTitle';
import TextWithFont from '../TextWithFont';
import ParkingFeeConditionAdder from './ParkingFeeConditionAdder';
import HourMinuteDayButton from '../HourMinuteDayButton';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ContributeParkingLotFee = (props) => {
    const [unitTime, setUnitTime] = useState('hour');
    const [time, setTime] = useState(0);
    const [charIsValid, setCharIsValid] = useState(true);
    const [timeIsValid, setTimeIsValid] = useState(true);
    const [inputField, setInputField] = useState('');
    const [inputNotEmpty, setInputNotEmpty] = useState(false);
    const [parkingFeeConditionAdderShouldUpdate, setParkingFeeConditionAdderShouldUpdate] = useState(false);

    useEffect(() => {
        handleTextInputOutput(inputField);
        checkTimeIsValid();
    }, [unitTime, timeIsValid, inputField, charIsValid, inputNotEmpty])

    function getIsCompletelyFilledFromParkingFeeConditionAdder(completelyFilledFromParkingFeeConditionAdder) {
        props.handleIsCompletelyFilled(completelyFilledFromParkingFeeConditionAdder && charIsValid && timeIsValid && inputNotEmpty);
    }

    function getContributionData(contributionDataFromParkingFeeConditionAdder) {
        props.handleContributionData({'data': contributionDataFromParkingFeeConditionAdder, 'unitTime': unitTime, 'firstFreeTime': time});
    }

    function getInputField(output) {
        setInputField(output);
    }

    function handleRerenderComplete() {
        setParkingFeeConditionAdderShouldUpdate(false);
    }

    function handleTextInputOutput(output) {
        setTimeIsValid(true);

        if (output == '' || output == undefined) {
            setTime(0);
            setCharIsValid(true);
            setTimeIsValid(true);
            setInputNotEmpty(false);
            setInputField('');
            return;
        }

        if (output.indexOf('.') > -1) {
            setTime(0);
            setCharIsValid(false);
            setTimeIsValid(true);
            setInputNotEmpty(true);
            return;
        }

        if (!isInt(inputField)) {
            setTime(0);
            setCharIsValid(false);
            setInputNotEmpty(true);
        } else {
            setCharIsValid(true);
            setInputNotEmpty(true);
        }
    }

    function checkTimeIsValid() {
        if (unitTime == 'hour' && (parseInt(inputField) > 23 || parseInt(inputField) < 0)) {
            setTimeIsValid(false);
            setTime(0);
        } else if (unitTime == 'minute' && (parseInt(inputField) > 59 || parseInt(inputField) < 0)) {
            setTimeIsValid(false);
            setTime(0);
        } else if (unitTime == 'day' && (parseInt(inputField) > 30 || parseInt(inputField) < 0)) {
            setTimeIsValid(false);
            setTime(0);
        } else {
            setTimeIsValid(true);
            setTime(parseInt(inputField))
        }
    }

    const getUnitTime = (data) => {
        setUnitTime(data);
        setParkingFeeConditionAdderShouldUpdate(true);
        setTimeIsValid(true);
    }

    function isInt(str) {
        return !isNaN(str) && Number.isInteger(parseFloat(str));
    }

    function renderParkingFeeConditionAdder() {
        return (
            <>
                <View style={{ marginVertical: '2%' }}>
                    <ParkingFeeConditionAdder
                        title={'How are the parking fees calculated?'}
                        subtitle={'Provide the information about the parking fees below.'}
                        firstFreeTime={time}
                        firstUnitTime={unitTime}
                        handleIsCompletelyFilled={getIsCompletelyFilledFromParkingFeeConditionAdder}
                        handleContributionData={getContributionData}
                        shouldRerender={parkingFeeConditionAdderShouldUpdate}
                        handleRerenderComplete={handleRerenderComplete}
                    />
                </View>

                <Divider style={{ backgroundColor: '#404040', marginVertical: '3%' }}/>
            </>
        )
    }

    return (
        <>
            <View style={{ marginBottom: '2%' }}>
                <GrayTextInputWithTitle
                    title={'How many ' + unitTime + 's are free of charge?'}
                    subtitle={'Enter 0 if the place doesn\'t offer you any free hours.'}
                    titleFontSize={18}
                    placeholder={'Required, must be a number'}
                    keyboardType={'number-pad'}
                    onChangeText={input => getInputField(input)}
                    returnKeyType='done'
                    charIsValid={charIsValid}
                    timeIsValid={timeIsValid}
                    unitTime={unitTime}
                />

                <HourMinuteDayButton initial={'hr'} callbackFunction={getUnitTime} />
            </View>

            <Divider style={{ backgroundColor: '#404040', marginVertical: '3%' }}/>

            <View style={{ ...Platform.select({ 'ios': { marginBottom: '-3%' }, 'android': { marginBottom: '-7%' }}) }}>
                {(inputNotEmpty && charIsValid && timeIsValid) && renderParkingFeeConditionAdder()}
            </View>
        </>
    )
}

export default ContributeParkingLotFee