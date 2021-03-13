import React, { useState } from 'react';
import { View, Text, Platform, TextInput } from 'react-native';
import TextWithFont from './TextWithFont';
import TitleWithSubtitle from './TitleWithSubtitle';

const GrayFeeInput = (props) => {
    const onTextChange = (input) => {
        props.onChangeText(input);
    }

    return (
        <>
            <View style={{ marginVertical: '2%' }}>
                <TitleWithSubtitle
                    {...props}
                    titleFontSize={props.titleFontSize}
                    title={props.title}
                    subtitle={props.subtitle == undefined ? undefined : props.subtitle}
                />

                <View style={{ backgroundColor: '#ddd', paddingHorizontal: '5%', paddingVertical: '3%', marginTop: '2%', borderRadius: 12 }}>
                    <TextInput placeholder={props.placeholder} keyboardType={props.keyboardType == undefined ? 'default' : props.keyboardType} returnKeyType={props.returnKeyType == undefined ? 'done' : props.returnKeyType} onChangeText={input => onTextChange(input)} />
                </View>
            </View>
        </>
    );
}
export default GrayFeeInput;