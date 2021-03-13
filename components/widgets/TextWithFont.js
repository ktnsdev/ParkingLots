import React from 'react';
import { Platform, Text } from 'react-native';
import {
    useFonts,
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black
} from '@expo-google-fonts/inter';

//Override system fonts for android only
const TextWithFont = (props) => {
    let [fontsLoaded] = useFonts({
        Inter_100Thin,
        Inter_200ExtraLight,
        Inter_300Light,
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
        Inter_800ExtraBold,
        Inter_900Black
    });
    if (!fontsLoaded) {
        return null;
    } else {
        return (
            <Text
                {...props}
                style={[props.style == undefined ? {} : props.style,
                {
                    color: props.color,
                    textTransform: props.textTransform == undefined ? 'none' : props.textTransform,
                    ...Platform.select({
                        'ios': {
                            fontWeight: props.iosFontWeight,
                            fontSize: props.fontSize == undefined ? 14 : props.fontSize,
                        },
                        'android': {
                            fontFamily: props.androidFontWeight == 'semibold' ? 'Inter_600SemiBold' : props.androidFontWeight == 'bold' ? 'Inter_700Bold' : props.androidFontWeight == 'medium' ? 'Inter_500Medium' : 'Inter_400Regular',
                            fontSize: props.fontSize == undefined ? 14 : props.fontSize - 2
                        }
                    })
                }]}>{props.children}</Text>
        )
    }
}

export default TextWithFont;