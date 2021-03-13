import React from 'react';
import { Platform, View } from 'react-native';
import TextWithFont from './TextWithFont';

export default function TitleWithSubtitle(props) {
    return (
        <View style={{ marginVertical: '1%' }}>
            <TextWithFont {...props} iosFontWeight={'bold'} androidFontWeight={'bold'} fontSize={props.titleFontSize}>{props.title}</TextWithFont>
            {props.subtitle != undefined && (
                <TextWithFont {...props} iosFontWeight={'600'} androidFontWeight={'semibold'} color={'#999'} style={{ ...Platform.select({ 'ios': { marginTop: props.titleFontSize >= 20 ? '2%' : '1%'}, 'android': { marginTop: props.titleFontSize >= 20 ? '1%' : '0%' }})}}>{props.subtitle}</TextWithFont>
            )}
        </View>
    )
}