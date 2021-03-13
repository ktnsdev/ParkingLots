import React, { useState } from 'react';
import { View, Text, Platform, TextInput } from 'react-native';
import TextWithFont from './TextWithFont';
import TitleWithSubtitle from './TitleWithSubtitle';

const GrayTextInputWithTitle = (props) => {
    const onTextChange = (input) => {
        props.onChangeText(input);
    }

    function invalidInputRender() {
        return (
            <>
                <TextWithFont color='#FF0000' androidFontWeight='bold' iosFontWeight='600'>Invalid number.</TextWithFont>
            </>
        )
    }

    function invalidTimeRender() {
        if (props.unitTime == 'hour') {
            return (
                <>
                    <TextWithFont color='#FF0000' androidFontWeight='bold' iosFontWeight='600'>Invalid time: number of hours can't be negative or over 23.</TextWithFont>
                </>
            )
        } else if (props.unitTime == 'minute') {
            return (
                <>
                    <TextWithFont color='#FF0000' androidFontWeight='bold' iosFontWeight='600'>Invalid time: number of minutes can't be negative or over 59.</TextWithFont>
                </>
            )
        } else if (props.unitTime == 'day') {
            return (
                <>
                    <TextWithFont color='#FF0000' androidFontWeight='bold' iosFontWeight='600'>Invalid time: number of days can't be negative or over 30.</TextWithFont>
                </>
            )
        } else {
            return (
                <>
                    <TextWithFont color='#FF0000' androidFontWeight='bold' iosFontWeight='600'>Invalid time.</TextWithFont>
                </>
            )
        }
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
                {props.charIsValid == false && invalidInputRender()}
                {props.timeIsValid == false && invalidTimeRender()}
                <View style={{ backgroundColor: '#ddd', paddingHorizontal: '5%', paddingVertical: '3%', marginTop: '2%', borderRadius: 12 }}>
                    <TextInput placeholder={props.placeholder} keyboardType={props.keyboardType == undefined ? 'default' : props.keyboardType} returnKeyType={props.returnKeyType == undefined ? 'done' : props.returnKeyType} onChangeText={input => onTextChange(input)} />
                </View>
            </View>
        </>
    );
}
export default GrayTextInputWithTitle;