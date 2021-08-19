import React, { useState, useEffect, useCallback, useRef } from 'react';
import {Title, Button, Header} from '@components';
import { SelectProfileImage } from './SelectProfileImg';
import {
    MakeNicknameContianer,
    ButtonContainer,
    MakeNicknameTitle,
    SafeAreaView,
    Container,
    SelectProfileImageWrap,
    ProfileSpeechBubbleWrap,
    ProfileSpeechBubbleWrapBg,
    ProfileSpeechBubbleWrapBgTail,
    ProfileImageText
} from './nickname.style'
import {JoinProcessing} from './JoinProcessing';
import {debounce} from 'lodash';
import { KirriTextInput } from '@components';
import { userApis } from '@apis';
import {UserStore} from '@store';
import {navigate, navigateGoBack} from '@config/navigator';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ProfileImageTypes } from '@utils';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateExpoToken } from "@utils";


interface Props {
    username: string,
    accessToken: string ,
    authorities: string[],
    [key : string]: any
}


export const Nickname = ({accessToken, authorities}: Props) => {
    const [joinProcessLoading, setJoinProcessLoading] = useState(false);
    const selectedProfileImage = useRef<ProfileImageTypes>('01');
    const [duplicate, setDuplicate] = useState(false);
    const [nickname, setNickname] = useState<string>();
    const currentNickname = useRef<string>('');
    
    const joinKirri = async () =>{
        if (!nickname || duplicate) {
            return;
        }
        setJoinProcessLoading(true);
        try {
            const result = await userApis.signin(
                {
                    nickname: currentNickname.current,
                    autoLogin: true,
                    profileImagePath:'profile:'+selectedProfileImage.current,
                    agreementList:["SERVICE", "PRIVACY"]
                }
            );
            if(result){
                userApis.updatePush({
                    CHEERING: true,
                    NEW_RECORD: true,
                    NOTIFICATION: true,
                    INVITATION: true
                })
            }
            const expoTokenResult = await updateExpoToken();
            UserStore.login();
            setJoinProcessLoading(false);
            navigate('Home', null);
        } catch (error) {
            setJoinProcessLoading(false);
        }
    }


    const checkDuple = debounce(() => {
        try {
            userApis.checkNicknameDupl(currentNickname.current).then((result: any)=>{
                if (result.exists) {
                    setDuplicate(true);
                    
                }else {
                    setDuplicate(false);
                }
                
            })
            
        } catch (error) {
            
        }
    }, 500);

    const checkSubmitPayload = useCallback(()=>{
        if (!nickname) {
            return true;
        }
        if(duplicate) {
            return true;
        }
        return false;
    }, [nickname, duplicate])


    const handleGoBack = () => {
        navigateGoBack();
    }

    return (
        <>
            <JoinProcessing  open={joinProcessLoading}/>
            <SafeAreaView>
                <Header
                    title='닉네임만들기'
                    leftIcon={require('@assets/images/various_back_normal.png')}
                    onLeftClick={handleGoBack}
                    borderBottom={false}
                />
                <Container>
                    
                    <SelectProfileImageWrap>
                        <SelectProfileImage
                            selectedImage='01'
                            selecteChanged={(img: ProfileImageTypes)=>{
                                selectedProfileImage.current = img;
                            }}
                        ></SelectProfileImage>
                        <ProfileSpeechBubbleWrap>
                            <ProfileSpeechBubbleWrapBg>
                                <ProfileImageText>
                                    나만의 프로필 이미지로 {'\n'}
                                    바꿔 보자 뿌! :D
                                </ProfileImageText>
                            </ProfileSpeechBubbleWrapBg>
                            <ProfileSpeechBubbleWrapBgTail/>
                        </ProfileSpeechBubbleWrap>
                    </SelectProfileImageWrap>
                    <MakeNicknameContianer>
                        <MakeNicknameTitle>한글, 영문, 숫자를 사용해 멋진 닉네임을 만들어주세요</MakeNicknameTitle>
                        <KirriTextInput
                            onChange={(text)=>{
                                currentNickname.current = text;
                                setNickname(text);
                                checkDuple();
                            
                            }}
                            placeholder='멋진자몽'
                            text=''
                            rightText='끼리'
                            onError={duplicate}
                            errorMessage='사용할 수 없는 닉네임이예요'
                        />
                        
                    </MakeNicknameContianer>
                    <ButtonContainer>
                        <Button
                            type='large'
                            onPress={()=>{
                                joinKirri();
                            }}
                            disabled={checkSubmitPayload()}
                        >다음</Button>
                    </ButtonContainer>
                </Container>
            </SafeAreaView>
            
        </>
    )
}