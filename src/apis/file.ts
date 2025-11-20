import type { ListRes } from '../types/api';
import type { FileInfo } from '../types/file';
import { getAxios, handleAxiosError } from '../utils/axios';

const axiosInstance = getAxios();

/**
 * 파일 업로드 함수
 * @param formData - 업로드할 파일이 담긴 FormData 객체
 * @returns 파일 업로드 결과를 반환하는 Promise
 * @description
 * 파일을 서버에 업로드하고, 업로드된 파일 정보를 반환합니다.
 * API 참고: https://fesp-api.koyeb.app/market/apidocs/#/%ED%8C%8C%EC%9D%BC/post_files_
 */
export async function uploadFileApi(attachFile: File | File[]): Promise<ListRes<FileInfo> | undefined> {
  try{
    if(attachFile instanceof File){
      attachFile = [attachFile];
    }
    // 새로운 FormData 객체 생성 후 파일 추가
    const fileForm = new FormData();
    attachFile.forEach(file => {
      fileForm.append('attach', file);
    });
    const res = await axiosInstance.post<ListRes<FileInfo>>('/files', fileForm, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  }catch(err){
    handleAxiosError(err);
  }
}