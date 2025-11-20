import axios, { AxiosError, type AxiosInstance } from 'axios';
import { getUser } from './user';

const API_SERVER = 'https://fesp-api.koyeb.app/market';

/**
 * Axios 인스턴스를 생성하고 인터셉터를 설정하는 함수
 * 요청 인터셉터에서 공통 파라미터를 추가하고,
 * 응답 인터셉터에서 에러 처리 및 accessToken 재발행 로직을 처리합니다.
 * 
 * @function getAxios
 * @returns {AxiosInstance} 설정된 Axios 인스턴스
 */
export function getAxios(): AxiosInstance {
  const user = getUser();
  const instance = axios.create({
    baseURL: API_SERVER, // 기본 URL
    timeout: 1000*5,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Client-Id': 'board',
      Authorization: `Bearer ${user?.token?.accessToken}`,
    }
  });

  // 요청 인터셉터 추가하기
  instance.interceptors.request.use((config) => {
    // 요청이 전달되기 전에 필요한 공통 작업 수행
    config.params = {
      // delay: 1000,
      ...config.params, // 기존 쿼리스트링 복사
    };
    return config;
  }, (error) => {
    // 공통 에러 처리

    return Promise.reject(error);
  });

  // 응답 인터셉터 추가하기
  instance.interceptors.response.use((response) => {
    console.log('정상 응답 인터셉터 호출', response);
    // 2xx 범위에 있는 상태 코드는 이 함수가 호출됨

    return response;
  }, async (error) => {
    console.error('에러 응답 인터셉터 호출', error);
    // 2xx 외의 범위에 있는 상태 코드는 이 함수가 호출됨
    // 공통 에러 처리
    const errors = error.response?.data.errors;
    if(error.status === 422 && errors){
      for(const err in errors){
        const validationError = errors[err];
        // input이나 textarea에 에러 메시지 표시
        const element = document.querySelector(`input[name="${err}"] + .validation-error, textarea[name="${err}"] + .validation-error`);
        if(element){
          element.textContent = validationError.msg;
        }
      }
      // 에러 처리를 했으므로 에러를 반환하지 않음
      return Promise.resolve(error.response);
    }
    return Promise.reject(error);
  });

  return instance;
}

/**
 * Axios 에러를 처리하는 함수
 * AxiosError인 경우 서버의 에러 응답 메시지 출력
 * 그 외의 경우 일반 Error 메시지를 표시합니다.
 * 
 * @function handleAxiosError
 * @param {unknown} err - 처리할 에러 객체
 * @returns {void}
 */
export function handleAxiosError(err: unknown){
  if(err instanceof AxiosError){
    alert(err.response?.data.message || err.message);
  }else{
    alert((err as Error).message);
  }
}