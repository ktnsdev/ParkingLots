import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import TextWithFont from './TextWithFont';

const HourMinuteDayButton = ({ initial, callbackFunction }) => {
    const buttonColour = {
        'active': '#ffdeba',
        'inactive': '#e6e6e6'
    }

    const textColour = {
        'active': '#ff8f17',
        'inactive': '#c9c9c9'
    }

    const [activeButton, setActiveButton] = useState(initial);
    const [minIsActive, setMinIsActive] = useState('inactive');
    const [hrIsActive, setHrIsActive] = useState('active');
    const [dayIsActive, setDayIsActive] = useState('active');

    useEffect(() => {
        if (initial == 'min') {
            setActiveButton(initial);
            onMinPressed();
        } else if (initial == 'hr') {
            setActiveButton(initial);
            onHrPressed();
        } else if (initial == 'day') {
            setActiveButton(initial);
            onDayPressed();
        } else {
            setActiveButton('none');
            onNonePressed();
        }
    }, [])

    function onMinPressed() {
        setMinIsActive('active');
        setHrIsActive('inactive');
        setDayIsActive('inactive');
        callbackFunction('minute');
    }

    function onHrPressed() {
        setMinIsActive('inactive');
        setHrIsActive('active');
        setDayIsActive('inactive');
        callbackFunction('hour');
    }

    function onDayPressed() {
        setMinIsActive('inactive');
        setHrIsActive('inactive');
        setDayIsActive('active');
        callbackFunction('day');
    }

    function onNonePressed() {
        setMinIsActive('inactive');
        setHrIsActive('inactive');
        setDayIsActive('inactive');
        callbackFunction('none');
    }

    return (
        <>
            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: '2%' }}>
                <TouchableOpacity onPress={() => onMinPressed()}>
                    <View style={{ backgroundColor: buttonColour[minIsActive], width: 100, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, marginRight: 7 }}>
                        <TextWithFont iosFontWeight={'bold'} androidFontWeight={'bold'} fontSize={16} color={textColour[minIsActive]}>Minute</TextWithFont>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => onHrPressed()}>
                    <View style={{ backgroundColor: buttonColour[hrIsActive], width: 100, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, marginRight: 7 }}>
                        <TextWithFont iosFontWeight={'bold'} androidFontWeight={'bold'} fontSize={16} color={textColour[hrIsActive]}>Hour</TextWithFont>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => onDayPressed()}>
                    <View style={{ backgroundColor: buttonColour[dayIsActive], width: 100, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20 }}>
                        <TextWithFont iosFontWeight={'bold'} androidFontWeight={'bold'} fontSize={16} color={textColour[dayIsActive]}>Day</TextWithFont>
                    </View>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default HourMinuteDayButton;