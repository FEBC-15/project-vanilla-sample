import type { UserDetail } from "../types/user";

/**
 * localStorage에서 사용자 정보를 가져오는 함수
 * 저장된 사용자 정보가 있으면 JSON 파싱하여 반환하고, 없으면 null을 반환합니다.
 * 
 * @function getUser
 * @returns {UserDetail | null} - 사용자 객체 또는 null
 */
export function getUser(): UserDetail | null {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

/**
 * 사용자 정보를 localStorage에 저장하는 함수
 * 
 * @function setUser
 * @param {UserDetail} user - 저장할 사용자 객체
 * @returns {void}
 */
export function setUser(user: UserDetail): void {
  localStorage.setItem('user', JSON.stringify(user));
}

/**
 * localStorage에서 사용자 정보를 제거하는 함수
 * 
 * @function removeUser
 * @returns {void}
 */
export function removeUser(): void {
  localStorage.removeItem('user');
}