import React, { createRef, useState } from 'react'
import { Image, TouchableOpacity, Alert } from 'react-native'
import { Background, Header } from "@components";
import { messageApis } from "@apis";
// import ActionSheet
import ActionSheet from "react-native-actions-sheet";
import { Memeber } from "@type-definition/diary";
import { StackNavigatorParams } from "@config/navigator";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { observer } from 'mobx-react';
import { UserStore } from '@store';
import { ProfileImages , ProfileImageTypes } from '@utils'

import { 
    Container,
    BackgroundImage,
    SpeechBubble,
    SpeechBubble2,
    FriendList,
    ListItem,
    ListItemImage,
    ListItemTitle,
    ActionSheetContainer,
    ProfileContainer,
    ProfileImage,
    TitleContainer,
    Title,
    SubTitle,
    ChreerupContainer,
    Chreerup,
    ChreerupImage,
    ChreerupMessage
} from "./style";


const actionSheetRef = createRef<ActionSheet>();

type CheerUpProps = {
    navigation: StackNavigationProp<StackNavigatorParams, "RecordList">;
    route: RouteProp<StackNavigatorParams, "RecordList">;
}

const CheerUp = observer(({ navigation , route } : CheerUpProps) => {

    const diary = route.params.diary;

    /**
     * 다이러리 멤버
     */
    const [members, setMembers] = useState((diary) ? diary.members.filter((item) => item.status === "ACTIVE") : [])

    /**
     * 메세지 보낼 대상 지정
     */
    const [target, setTarget] = useState<Memeber | null>(null)

    /**
     * mobx 으로 유저 닉네임 추출
     */
    const { nickname } = UserStore;

    /**
     * 응원 메세지 보내기
     * @param message 
     */
    const sendMessage = async (message : string) => {
        try {
            if(diary && target?.userId){
                await messageApis.sendMessage(diary.uuid , {
                    type: "CHEERING",
                    toUserId: target.userId,
                    title: "응원 메세지",
                    body: message
                })
                Alert.alert("응원 메세지를 보냈습니다.");
                actionSheetRef.current?.setModalVisible();
            }
        } catch (error) {
            if(error.response){
                console.log("sendMessage error",error.response);
                Alert.alert(error.response.data.message)
            }
        }
    }

    return (
        <Background>
            <Header
                title="우리끼리 응원하기" 
                leftIcon={
                    <TouchableOpacity
                        onPress={() =>{
                            navigation.goBack()
                        }}
                    >
                        <Image
                            style={{ width: 24,
                            height: 24 }}
                            source={require("@assets/icons/x.png")}
                        />
                    </TouchableOpacity>
                }
                // rightIcon={null}
            />
            <Container>
                <BackgroundImage 
                    source={require("@assets/images/diary/diary_cheerup_bgimg.png")}
                />
                <SpeechBubble>
                    끼리 멤버들에게 ’기록작성’을 응원해보자 뿌!:)
                </SpeechBubble>
                <SpeechBubble2 />
                <FriendList 
                    data={members}
                    numColumns={3}
                    keyExtractor={(item, index) => `${index}`}
                    renderItem={(data) => {
                        const item = data.item as Memeber
                        const type = item.profileImagePath.split(":")[1] as ProfileImageTypes
                        const profileImagePath = ProfileImages[type]
                        return(
                            <ListItem 
                                onPress={() => {
                                    setTarget(item)
                                    actionSheetRef.current?.setModalVisible();
                                }}
                            >
                                <ListItemImage 
                                    source={profileImagePath}
                                />
                                <ListItemTitle>
                                    {item.nickname}
                                </ListItemTitle>
                            </ListItem>
                        )
                    }}
                />
                
                
                
                <ActionSheet ref={actionSheetRef}>
                    <ActionSheetContainer>
                        <ProfileContainer>
                            <ProfileImage 
                                source={require("@assets/images/profile/home_profile_04.png")}
                            />
                            <TitleContainer>
                                <Title>나는 {target?.nickname} 님에게</Title>
                                <Title>응원의 한마디 보내기</Title>
                                <SubTitle>from. {nickname} [{diary?.title}]</SubTitle>
                            </TitleContainer>
                        </ProfileContainer>
                        <ChreerupContainer>
                            <Chreerup onPress={() => sendMessage('꾸준함은 배신하지 않아')}>
                                <ChreerupImage 
                                    source={require("@assets/images/diary/diary_cheerup_bgimg_01.png")}
                                />
                                <ChreerupMessage>
                                    꾸준함은
                                </ChreerupMessage>
                                <ChreerupMessage>
                                    배신하지 않아
                                </ChreerupMessage>
                            </Chreerup>
                            <Chreerup onPress={() => sendMessage('오늘 너의 기록에 반함')}>
                                <ChreerupImage 
                                    source={require("@assets/images/diary/diary_cheerup_bgimg_02.png")}
                                />
                                <ChreerupMessage>
                                    오늘
                                </ChreerupMessage>
                                <ChreerupMessage>
                                    너의 기록에 반함
                                </ChreerupMessage>
                            </Chreerup>
                            <Chreerup onPress={() => sendMessage('난 언제나 너의 편')}>
                                <ChreerupImage 
                                    source={require("@assets/images/diary/diary_cheerup_bgimg_03.png")}
                                />
                                <ChreerupMessage>
                                    난 언제나
                                </ChreerupMessage>
                                <ChreerupMessage>
                                    너의 편
                                </ChreerupMessage>
                            </Chreerup>
                            <Chreerup onPress={() => sendMessage('아프지 말고, 아프지 말고')}>
                                <ChreerupImage 
                                    source={require("@assets/images/diary/diary_cheerup_bgimg_04.png")}
                                />
                                <ChreerupMessage>
                                    아프지 말고,
                                </ChreerupMessage>
                                <ChreerupMessage>
                                    아프지 말고
                                </ChreerupMessage>
                            </Chreerup>
                            <Chreerup onPress={() => sendMessage('대충 살아도 괜찮아')}>
                                <ChreerupImage 
                                    source={require("@assets/images/diary/diary_cheerup_bgimg_05.png")}
                                />
                                <ChreerupMessage>
                                    대충 살아도
                                </ChreerupMessage>
                                <ChreerupMessage>
                                    괜찮아
                                </ChreerupMessage>
                            </Chreerup>
                            <Chreerup onPress={() => sendMessage('넌 지금도 충분히 잘 하는 중')}>
                                <ChreerupImage 
                                    source={require("@assets/images/diary/diary_cheerup_bgimg_06.png")}
                                />
                                <ChreerupMessage>
                                    넌 지금도
                                </ChreerupMessage>
                                <ChreerupMessage>
                                    충분히 잘 하는 중
                                </ChreerupMessage>
                            </Chreerup>
                        </ChreerupContainer>
                    </ActionSheetContainer>
                </ActionSheet>
            </Container>
        </Background>
    )
})

export default CheerUp