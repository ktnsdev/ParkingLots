import React from 'react';
import { View, Text, Platform, TextInput } from 'react-native';
import TextWithFont from './TextWithFont';
import TitleWithSubtitle from './TitleWithSubtitle';

export default function GrayTextInputWithTitle({ placeholder, title, required, titleFontSize, subtitle, keyboardType }) {
    return (
        <>
                <View style={{ marginVertical: '2%' }}>
                    <TitleWithSubtitle
                        titleFontSize={titleFontSize}
                        title={title}
                        subtitle={subtitle == undefined ? undefined : subtitle}
                    />
                    <View style={{ backgroundColor: '#ddd', paddingHorizontal: '5%', paddingVertical: '3%', marginTop: '2%', borderRadius: 12 }}>
                        <TextInput placeholder={placeholder} keyboardType={keyboardType == undefined ? 'default' : 'number-pad'} />
                    </View>
                </View>
        </>
    );
}