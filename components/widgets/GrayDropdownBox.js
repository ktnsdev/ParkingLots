import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import TextWithFont from './TextWithFont';

const GrayDropdownBox = (props) => {
    return (
        <>
            <View {...props} style={{ backgroundColor: '#ddd', paddingHorizontal: '5%', paddingVertical: '3%', marginTop: '2%', borderRadius: 12, width: props.width }}>
                <TextWithFont {...props} color={'#999'} fontSize={16} iosFontWeight={'bold'} androidFontWeight={'bold'}>Hello</TextWithFont>
            </View>
        </>
    )
}

export default GrayDropdownBox;