import React, { useState } from 'react';
import {
    CreateDiaryModalBackground,
    CreateDiary,
    ModalTouchable,
    TouchableIcon,
    CreateDiaryTitle,
    CreateDiatyTitleWarp,
    CreateDiaryInputWarp,
    CreateInputTitle,
    CreateDiaryCoverContainer,
    CreateDiaryCoverTitle,
    CreateDiaryCoverSelectedWarp,
    CreateDiaryCoverContent,
    CreateDiaryCoverSelected,
    CreateDiaryCoverColor,
    CreateDiaryCoverList,
    SelectedCheck
} from './home.style';

import { View, Image, Modal, Text } from 'react-native';
import { KirriTextInput, Button } from '@components';
import { CoverImages, CoverCircleImages, CoverColor, CoverCircleImageTypes, CoverColorTypes, CoverImageTypes } from '@utils';
import { CreateDiaryReqType } from '@type-definition/diary';
import { diaryApis } from '@apis';
import { navigate } from '@config/navigator';
import { TouchableOpacity } from 'react-native-gesture-handler';



const SelecedCheckImage = require('@assets/images/diary/writing_select_diary_check_box_checked.png');

interface Props {
    open: boolean,
    reloadDiary: () => void,
    close: () => void
}

export const CreateDiaryModal = ({open, reloadDiary, close}: Props) => {
    const [selectedCoverImage, setSelectedCoverImage] = useState<CoverCircleImageTypes | undefined>('01');
    const [selectedCoverColor, setSelectedCoverColor] = useState<CoverColorTypes>();
    const [newDiaryName, setNewDiaryName] = useState<string>();
    const [createButtonDisable, setCreateButtonDisable] = useState(false);
    const selectCover = (type: string, key: CoverImageTypes | CoverColorTypes) => {
        switch(type) {
            case 'image':
                setSelectedCoverImage(key);
                setSelectedCoverColor(undefined);
                break;
            case 'color':
                setSelectedCoverColor(key);
                setSelectedCoverImage(undefined);
                break;
        }
    }
    const createNewDiary = async () => {
        setCreateButtonDisable(true);
        const payload: CreateDiaryReqType={ title: '', icon: ''};
        newDiaryName?(payload.title= newDiaryName):'';
        selectedCoverImage && (payload.icon = 'image:'+selectedCoverImage);
        selectedCoverColor && (payload.icon = 'color:' + selectedCoverImage);
        try {
            const data = await diaryApis.createDiary(payload);
            reloadDiary();
            close();
        } catch (error) {
            
        }
    }
    return (
        <Modal
            visible={open}
            style={{height: '100%'}}
        >
        <CreateDiaryModalBackground>
            <View style={{width: "100%",flexBasis:1, flexGrow:1, flexShrink: 1}}>
                <TouchableOpacity
                    style={{width: "100%", height: '100%'}}
                    onPress={()=>{close()}}
                ></TouchableOpacity>
            </View>
            <CreateDiary>
                <ModalTouchable>
                    <TouchableIcon></TouchableIcon>
                </ModalTouchable>
                <CreateDiatyTitleWarp>
                    <CreateDiaryTitle>새 다이어리 만들기</CreateDiaryTitle>
                </CreateDiatyTitleWarp>
                <CreateDiaryInputWarp>
                    <CreateInputTitle>멋진 다이어리 이름을 써주세요.</CreateInputTitle>
                    <KirriTextInput
                        onChange={(text)=>{
                            setNewDiaryName(text);
                            setCreateButtonDisable(!text);
                        }}
                        text=''
                        placeholder='한글, 영문, 숫자 관계 없이 최대 12자'
                    ></KirriTextInput>
                </CreateDiaryInputWarp>
                <CreateDiaryCoverContainer>
                    <CreateDiaryCoverTitle>다이어리 표지를 꾸며보세요.</CreateDiaryCoverTitle>
                    <CreateDiaryCoverSelectedWarp>
                        <CreateDiaryCoverSelected>
                            {
                                selectedCoverImage?<Image source={CoverImages[selectedCoverImage]}/>: <></>
                            }
                            {
                                selectedCoverColor?<CreateDiaryCoverColor color={CoverColor[selectedCoverColor]}></CreateDiaryCoverColor>:<></>
                            }
                        </CreateDiaryCoverSelected>
                    </CreateDiaryCoverSelectedWarp>
                    <CreateDiaryCoverList>
                        {
                            Object.keys(CoverCircleImages).map((key)=>
                                <CreateDiaryCoverContent
                                    key={'cover_image_'+key}
                                    selected={selectedCoverImage === key}
                                    onPress={() => { selectCover('image', key as CoverImageTypes)}}
                                >
                                    <Image source={CoverCircleImages[key as CoverCircleImageTypes]}></Image>
                                    {
                                        selectedCoverImage === CoverCircleImages[key as CoverCircleImageTypes] ? <SelectedCheck><Image source={SelecedCheckImage} /></SelectedCheck> : <></>
                                    }
                                </CreateDiaryCoverContent>
                            )
                        }
                    </CreateDiaryCoverList>
                    <CreateDiaryCoverList>
                            {
                                Object.keys(CoverColor).map((key) => 
                                    <CreateDiaryCoverContent
                                        color={CoverColor[key as CoverColorTypes]}
                                        key={'cover_color_' + key}
                                        selected={selectedCoverColor === key}
                                        onPress={() => { selectCover('color', key as CoverColorTypes) }}
                                    >
                                        {
                                            selectedCoverColor === CoverColor[key as CoverColorTypes]? <SelectedCheck><Image source={SelecedCheckImage} /></SelectedCheck> : <></>
                                        }
                                    </CreateDiaryCoverContent>
                                )
                            }
                    </CreateDiaryCoverList>
                </CreateDiaryCoverContainer>
                    <View>
                        <Button
                            type='large'
                            onPress={()=>{createNewDiary()}}
                            disabled={createButtonDisable}
                            
                        >완료</Button>
                    </View>
                
            </CreateDiary>
        </CreateDiaryModalBackground>
        </Modal>
    )
}