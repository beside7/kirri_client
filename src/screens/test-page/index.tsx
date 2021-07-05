import React from 'react'
import { View, TouchableOpacity,  } from 'react-native'
import { Text_1, Background } from "@components";
import styles from './test-page.style'

import { StackNavigatorParams } from "@config/navigator";
import { StackNavigationProp } from "@react-navigation/stack";

type TestPageProps = {
    navigation: StackNavigationProp<StackNavigatorParams, "TestPage">;
};

/**
 * 테스트용 페이지
 * @param param0 
 * @returns 
 */
export default function TestPage({ navigation } : TestPageProps) {
    return (
        <Background>
            <View style={[styles.container]}>
                <TouchableOpacity onPress={() => {navigation.navigate("DiaryInput")}}>
                    <Text_1>* write</Text_1>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {navigation.navigate("DiaryMain")}}>
                    <Text_1>* list</Text_1>
                </TouchableOpacity>
            </View>
        </Background>
    )
}
