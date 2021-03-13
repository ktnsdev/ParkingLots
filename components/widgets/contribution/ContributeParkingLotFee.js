import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GrayTextInputWithTitle from '../GrayTextInputWIthTitle';
import TextWithFont from '../TextWithFont';
import ParkingFeeConditionAdder from './ParkingFeeConditionAdder';

const ContributeParkingLotFee = () => {
    return (
        <>
            <GrayTextInputWithTitle title={'How many hours are free of charge?'} subtitle={'eg. Type "2" if the first 2 hours are free,\nor type "0" if the place doesn\'t offer you any free hours.'} titleFontSize={18} placeholder={'Required, must be a number'} />
            <ParkingFeeConditionAdder
                title={'How the parking fee are calculated?'}
                subtitle={'Provide the information about the parking fee below.'}
            />
        </>
    )
}

const styles = StyleSheet.create({});

export default ContributeParkingLotFee