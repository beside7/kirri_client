import React, {ReactElement, useState, useCallback} from 'react'
import { View } from 'react-native'

import styles from './login.style'

import { LoginButton, Text, Background } from "@components";
import {KakaoWebview} from '@components';
import { SERVER_URL, userApis } from '@apis';
import {navigate} from '@config/navigator';
import { AsyncStorage } from 'react-native';
import { UserStore } from '@store';


type LoginProps = {
};

export default function Login({ }: LoginProps): ReactElement {
    const [closeSocialModal, setCloseSocialModal] = useState(false);
    const result = React.useRef<any>({});

    const onComplete = async (event: any) => {
        result.current = JSON.parse(event.nativeEvent.data);
        let success = result.current.accessToken;
        setCloseSocialModal(false);
        AsyncStorage.setItem('userKey', 'Bearer '+success);
        if (success && result.current.status === 'REQUIRED_SIGN_UP'){
            navigate('Nickname', result.current);
        } else {
            navigate('Home', null);
        }
    }
    return (
        <Background>
            <KakaoWebview
                source={`${SERVER_URL}/kakao-sign-in`}
                closeSocialModal={closeSocialModal}
                onComplete={onComplete}
            />
            <View style={styles.content}>
                <Text style={styles.title}>KKiRi</Text>
                <View style={styles.subTitle}>
                    <Text style={styles.subTitleText}>우리끼리 만들어가는</Text>
                    <Text style={styles.subTitleText}>일상의 기록</Text>
                </View>
                <LoginButton style={styles.button} onPress={e => {
                    setCloseSocialModal(true);
                    
                }}>
                    카카오톡 로그인
                </LoginButton>
                <LoginButton style={styles.appleButton} onPress={e => {
                    setCloseSocialModal(true);
                }}>
                    Sign in with Apple
                </LoginButton>
                {/* <Text style={styles.message}>아직 끼리에 가입하지 않으셨나요?</Text> */}
            </View>
            
            
        </Background>
    )
}
