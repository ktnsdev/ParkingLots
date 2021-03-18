import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import GrayTextInputWithTitle from '../GrayTextInputWIthTitle';
import TextWithFont from '../TextWithFont';
import ParkingFeeConditionAdder from './ParkingFeeConditionAdder';
import HourMinuteDayButton from '../HourMinuteDayButton';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ContributeParkingLotFee = () => {
    const [unitTime, setUnitTime] = useState('hour');
    const [time, setTime] = useState(0);
    const [charIsValid, setCharIsValid] = useState(true);
    const [timeIsValid, setTimeIsValid] = useState(true);
    const [inputNotEmpty, setInputNotEmpty] = useState(false);

    function handleTextInputOutput(output) {
        if (output == '' || output == undefined) {
            setTime(0);
            setCharIsValid(true);
            setTimeIsValid(true);
            setInputNotEmpty(false);
            return;
        }

        if (output.indexOf('.') > -1) {
            setTime(0);
            setCharIsValid(false);
            setTimeIsValid(true);
            setInputNotEmpty(true);
            return;
        }

        if (!isInt(output)) {
            setTime(0);
            setCharIsValid(false);
            setTimeIsValid(true);
            setInputNotEmpty(true);
        } else {
            setTime(parseInt(output));
            setCharIsValid(true);
            setInputNotEmpty(true);

            if (unitTime == 'hour' && (parseInt(output) > 23 || parseInt(output) < 0)) {
                setTimeIsValid(false);
            } else if (unitTime == 'minute' && (parseInt(output) > 59 || parseInt(output) < 0)) {
                setTimeIsValid(false);
            } else if (unitTime == 'day' && (parseInt(output) > 30 || parseInt(output) < 0)) {
                setTimeIsValid(false);
            } else {
                setTimeIsValid(true);
            }
        }
    }

    const getUnitTime = (data) => {
        setUnitTime(data);
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
                    />
                </View>

                <View style={styles.lineBreak}></View>
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
                    onChangeText={input => handleTextInputOutput(input)}
                    returnKeyType='done'
                    charIsValid={charIsValid}
                    timeIsValid={timeIsValid}
                    unitTime={unitTime}
                />

                <HourMinuteDayButton initial={'hr'} callbackFunction={getUnitTime} />
            </View>

            <View style={styles.lineBreak}></View>

            <View style={{ ...Platform.select({ 'ios': { marginBottom: '-3%' }, 'android': { marginBottom: '-7%' }}) }}>
                {(inputNotEmpty && charIsValid && timeIsValid) && renderParkingFeeConditionAdder()}
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    lineBreak: {
        borderBottomColor: '#404040',
        borderBottomWidth: 0.5,
        marginTop: "3%",
        marginBottom: "3%"
    }
});

export default ContributeParkingLotFee