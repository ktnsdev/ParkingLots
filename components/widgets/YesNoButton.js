import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import TextWithFont from './TextWithFont';

const YesNoButton = ({ initial, handleSelection }) => {
    const buttonColour = {
        'active': '#ffdeba',
        'inactive': '#e9e9e9'
    }

    const textColour ={
        'active': '#ff8f17',
        'inactive': '#c9c9c9'
    }

    const [activeButton, setActiveButton] = useState(initial);
    const [yesIsActive, setYesIsActive] = useState('inactive');
    const [noIsActive, setNoIsActive] = useState('active');

    useEffect(() => {
        if (initial == 'y') {
            setActiveButton(initial);
            onYesPressed();
        } else if (initial == 'n') {
            setActiveButton(initial);
            onNoPressed();
        } else {
            setActiveButton('none');
            onNonePressed();
        }
    }, [])

    function onYesPressed() {
        setYesIsActive('active');
        setNoIsActive('inactive');
        handleSelection(true);
    }

    function onNoPressed() {
        setYesIsActive('inactive');
        setNoIsActive('active');
        handleSelection(false);
    }

    function onNonePressed() {
        setYesIsActive('inactive');
        setNoIsActive('inactive');
        handleSelection(false);
    }

    return (
        <>
            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: '2%' }}>
                <TouchableOpacity onPress={() => onYesPressed()}>
                    <View style={{ backgroundColor: buttonColour[yesIsActive], width: 100, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, marginRight: 7 }}>
                        <TextWithFont iosFontWeight={'bold'} androidFontWeight={'bold'} fontSize={16} color={textColour[yesIsActive]}>Yes</TextWithFont>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => onNoPressed()}>
                    <View style={{ backgroundColor: buttonColour[noIsActive], width: 100, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20 }}>
                        <TextWithFont iosFontWeight={'bold'} androidFontWeight={'bold'} fontSize={16} color={textColour[noIsActive]}>No</TextWithFont>
                    </View>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default YesNoButton;