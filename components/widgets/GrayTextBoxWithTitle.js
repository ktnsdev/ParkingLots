import React from 'react';
import { View, Text, Platform } from 'react-native';
import TextWithFont from './TextWithFont';

export default function GrayTextBoxWithTitle({ placeholder, title, required, width }) {
    return (
        <>
            <View style={{ marginVertical: '1%' }}>
                <TextWithFont fontSize={18} iosFontWeight={'bold'} androidFontWeight={'bold'} style={{
                    ...Platform.select({
                        'ios': {
                            marginTop: '1%'
                        },
                        'android': {
                            marginTop: '4%'
                        }
                    })
                }}>{title} <TextWithFont color={'#ff8f17'}>{required}</TextWithFont></TextWithFont>
                <View style={{ backgroundColor: '#e7e7e7', paddingHorizontal: '5%', paddingVertical: '3%', marginTop: '2%', borderRadius: 12, width: width }}>
                    <TextWithFont color={'#999'} fontSize={16} iosFontWeight={'bold'} androidFontWeight={'bold'}>{placeholder}</TextWithFont>
                </View>
            </View>

        </>
    );
}