import type { DetailRes } from "../types/api";
import type { CreateUserRequest, UserDetail } from "../types/user";
import { getAxios, handleAxiosError } from "../utils/axios";

const axiosInstance = getAxios();

/**
 * 새로운 사용자를 생성합니다.
 * @param user - 생성할 사용자 정보
 * @returns 생성된 사용자 정보를 포함한 응답
 * @throws 네트워크 오류 또는 서버 오류 시 예외 발생
 */
export async function createUserApi(user: CreateUserRequest): Promise<DetailRes<UserDetail> | undefined> {
  try{
    const res = await axiosInstance.post<DetailRes<UserDetail>>('/users', user);
    return res.data;
  }catch(err){
    handleAxiosError(err);
  }
}

/**
 * 사용자 로그인을 수행합니다.
 * @param email - 사용자 이메일
 * @param password - 사용자 비밀번호
 * @returns 로그인된 사용자 정보를 포함한 응답
 * @throws 네트워크 오류 또는 서버 오류 시 예외 발생
 */
export async function loginUserApi(email: string, password: string): Promise<DetailRes<UserDetail> | undefined> {
  try{
    const res = await axiosInstance.post<DetailRes<UserDetail>>('/users/login', { email, password });
    return res.data;
  }catch(err){
    handleAxiosError(err);
  }
}