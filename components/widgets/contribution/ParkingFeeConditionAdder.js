import React, { useState } from 'react';
import { Text, FlatList, View, TouchableOpacity, Platform } from 'react-native'
import GrayDropdownBox from '../GrayDropdownBox';
import TextWithFont from '../TextWithFont';
import TitleWithSubtitle from '../TitleWithSubtitle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GrayTextBoxWithTitle from '../GrayTextBoxWithTitle';

const ParkingFeeConditionAdder = (props) => {
    const [conditions, setCondition] = useState(0);
    const [afterFree, setAfterFree] = useState([]);

    function onAddConditionPressed() {
        setCondition(conditions + 1);
        addConditionToArray();
    }

    function addConditionToArray() {
        let tempArray = [];
        while (tempArray.length != conditions + 1) {
            tempArray.push({});
        }

        setAfterFree(tempArray);
    }

    return (
        <>
            <TitleWithSubtitle {...props} title={props.title} subtitle={props.subtitle} titleFontSize={18} />
            <FlatList
                data={afterFree}
                renderItem={({ item }) => (
                    <>
                    <GrayTextBoxWithTitle placeholder={'Condition ' + conditions}/>
                    </>
                )}
            />
            <TouchableOpacity onPress={() => onAddConditionPressed()} style={{...Platform.select({ 'ios': { marginTop: '3%' }})}}>
                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Icon name='add' color={'#0084ff'} size={20} />
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <TextWithFont color={'#0084ff'} iosFontWeight={'600'} androidFontWeight={'semibold'} textTransform={'uppercase'}>Add condition</TextWithFont>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            <TextWithFont>{conditions} : {afterFree.length}</TextWithFont>
        </>
    )
}

export default ParkingFeeConditionAdder;