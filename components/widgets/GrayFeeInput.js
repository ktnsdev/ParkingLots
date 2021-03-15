import React, { useState } from 'react';
import { View, Text, Platform, TextInput } from 'react-native';
import TextWithFont from './TextWithFont';
import TitleWithSubtitle from './TitleWithSubtitle';

const GrayFeeInput = (props) => {
    const [inputField, setInputField] = useState('');

    const onChangeText = (input) => {
        setInputField(input.replace(/[^0-9]/g, ''))
    }

    return (
        <>
            <View style={{ marginVertical: '0%' }}>
                <View style={{ backgroundColor: '#ddd', paddingHorizontal: '5%', paddingVertical: '3%', marginTop: '0%', borderRadius: 12, height: props.height == undefined ? undefined : props.height, width: props.width == undefined ? undefined : props.width }}>
                    <TextInput
                        style={{ paddingTop: 0, paddingBottom: 0 }}
                        textAlign={props.textAlign == undefined ? undefined : props.textAlign}
                        placeholder={props.placeholder == undefined ? '' : props.placeholder}
                        keyboardType={props.keyboardType == undefined ? 'default' : props.keyboardType}
                        returnKeyType={props.returnKeyType == undefined ? 'done' : props.returnKeyType}
                        multiline={props.multiline == undefined ? undefined : props.multiline}
                        textAlignVertical={props.textAlignVertical == undefined ? undefined : props.textAlignVertical}
                        onChangeText={input => onChangeText(input)}
                        value={inputField}
                    />
                </View>
            </View>
        </>
    );
}
export default GrayFeeInput;