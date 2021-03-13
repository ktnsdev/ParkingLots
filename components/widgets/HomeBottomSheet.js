import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import HomeBottomSheetComponents from './HomeBottomSheetComponents';
import HandleProps from './HomeBottomSheetHandleProps';

const HomeBottomSheet = () => {
    // variables
    const snapPoints = useMemo(() => ['20%', '60%'], []);

    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    // renders
    return (
        <View style={styles.bottomSheet}>
            <HomeBottomSheetComponents/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    contentContainer: {
        flex: 1,
        padding: '5%'
    },
    bottomSheet: {
        paddingHorizontal: '4%',
        paddingVertical: '6%',
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -10,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
    }
});

export default HomeBottomSheet;