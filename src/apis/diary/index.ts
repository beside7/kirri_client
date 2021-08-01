import { CreateDiaryReqType, DiariesResType, RecordsResType, RecordResType, CreateRecordReqType } from './../../types/diary/index';
import { apiClient } from '../clients';
import FormData from 'form-data';

export const diaryApis = {
  async getDiaries() : Promise<DiariesResType> {
    const { data } = await apiClient.get('/diaries');
    return data;
  },
  async createDiary(payload: CreateDiaryReqType) {
    const { data } = await apiClient.post('/diaries', payload);
    return data;
  },

  /**
   * 다이러리 멤버 조회
   * @param uuid 다이러리기본키 
   * @param nickname 닉네임
   * @returns 
   */
  async findMember(uuid : string, nickname : string) {
    const { data } = await apiClient.get(`/diaries/${uuid}/members` , {
      params: {
        'nickname' : nickname
      }
    });
    return data;
  },

  /**
   * 다이러리 멤버 추가
   * @param uuid  다이러리기본키
   * @param nickname 닉네임
   * @returns 
   */
  async addMember(uuid : string, nickname : string){
    const { data } = await apiClient.post(`/diaries/${uuid}/members` , {
      'nickname' : nickname
    });
    return data;
  },

};

/**
 * 기록에 관한 API
 */
export const recordApis = {
  /**
   * 기록목록을 가져온다
   * @param uuid 다이러리 기본키
   * @returns 
   */
  async getRecords( uuid : string ) : Promise<RecordsResType> {
    const { data } = await apiClient.get(`/diaries/${uuid}/records`);
    return data;
  },

  /**
   * 기록상세조회
   * @param diaryUuid 다이러리 아이디
   * @param recordUuid 레코드 아이디
   * @returns 
   */
  async viewRecord(diaryUuid : string , recordUuid: string) : Promise<RecordResType> {
    const { data } = await apiClient.get(`/diaries/${diaryUuid}/records/${recordUuid}`);
    return data;
  },
  
  /**
   * 기록을 저장한다
   * @param uuid 다이러리 기본키
   * @param payload 입력 값
   * @returns 
   */
  async createRecord( uuid: string , payload: CreateRecordReqType) {
    const bodyFormData = new FormData();
    bodyFormData.append("title" , payload.title)
    bodyFormData.append("body" , payload.body)
    
    
    if(payload.files && payload.files.length > 0){
      payload.files.forEach(file => {
        bodyFormData.append("file" , {
          uri : file,
          name: "test.jpg",
          type: 'image/jpeg'
        })
      })
    }
    // console.log(bodyFormData);
    
    const { data } = await apiClient.post(`/diaries/${uuid}/records`, bodyFormData , {
      headers: { "content-type": "multipart/form-data" }
    });
    return data;
  },


  /**
   * 기록을 수정한다.
   * @param diaryUuid 다이러리 아이디
   * @param recordUuid 레코드 아이디
   * @param payload 입력 값
   * @returns 
   */
  async modifyRecord( diaryUuid: string, recordUuid: string , payload: CreateRecordReqType) {
    const bodyFormData = new FormData();
    bodyFormData.append("title" , payload.title)
    bodyFormData.append("body" , payload.body)
    
    
    if(payload.files && payload.files.length > 0){
      payload.files.forEach(file => {
        bodyFormData.append("file" , {
          uri : file,
          name: "test.jpg",
          type: 'image/jpeg'
        })
      })
    }
    // console.log(bodyFormData);
    
    const { data } = await apiClient.put(`/diaries/${diaryUuid}/records/${recordUuid}`, bodyFormData , {
      headers: { "content-type": "multipart/form-data" }
    });
    return data;
  },

  /**
   * 기록을 삭제한다
   * @param diaryUuid 다이러리 아이디
   * @param recordUuid 레코드 아이디
   */
  async deleteRecord(diaryUuid : string , recordUuid: string) : Promise<void> {
    await apiClient.delete(`/diaries/${diaryUuid}/records/${recordUuid}`);
    return;
  },
}