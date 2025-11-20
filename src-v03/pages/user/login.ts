import { loginUserApi } from "../../apis/user";
import type { UserDetail } from "../../types/user";
import { setUser } from "../../utils/user";

/**
 * 로그인을 처리하는 함수
 * 폼 데이터에서 이메일과 비밀번호를 추출하여 로그인 API를 호출하고,
 * 로그인이 성공하면 사용자 정보를 localStorage에 저장한 후 메인 페이지로 이동합니다.
 * 
 * @async
 * @function login
 * @param {HTMLFormElement} formElement - 로그인 폼 요소
 * @returns {Promise<void>}
 */
async function login(formElement: HTMLFormElement) {
  const formData = new FormData(formElement);
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const loginRes = await loginUserApi(email, password);
  if(loginRes?.ok){
    const user: UserDetail = {
      _id: loginRes.item._id,
      email: loginRes.item.email,
      name: loginRes.item.name,
      image: loginRes.item.image,
      token: loginRes.item.token,
    };
    setUser(user);
    alert('로그인이 완료되었습니다.');
    // location.href = '/';
    const fromUrl = new URLSearchParams(location.search).get('from') || '/';
    // 뒤로가기 이동시 다시 로그인 페이지로 이동하는 문제를 해결하기 위해 현재 히스토리를 덮어 씌우는 replace 메서드 사용
    location.replace(fromUrl);
  }
}

/**
 * 폼 제출 이벤트를 처리하는 함수
 * 기본 제출 동작을 방지하고, 폼 데이터를 검증한 후
 * 검증이 통과하면 login 함수를 호출하여 로그인을 진행합니다.
 * 
 * @async
 * @function handleSubmit
 * @param {Event} event - 폼 제출 이벤트 객체
 * @returns {Promise<void>}
 */
async function handleSubmit(event: Event) {
  event.preventDefault();

  const formElement = event.target as HTMLFormElement;
  // 입력 데이터 검증
  const isValid = validateForm(formElement);
  if(isValid){
    await login(formElement); // 로그인 진행
  }
}

/**
 * 폼 데이터 검증 함수
 * 이메일, 비밀번호 필드의 필수 입력 여부를 검증하고,
 * 검증 실패 시 오류 메시지를 표시합니다.
 * 
 * @function validateForm
 * @param {HTMLFormElement} formElement - 검증할 폼 요소
 * @returns {boolean} - 검증 통과 여부 (true: 통과, false: 실패)
 */
function validateForm(formElement: HTMLFormElement) {
  let result: boolean = true;

  const email = formElement.querySelector<HTMLInputElement>('[name=email]')!;
  const password = formElement.querySelector<HTMLInputElement>('[name=password]')!;

  if(password.value.trim() === ''){
    password.nextElementSibling!.textContent = '비밀번호는 필수입니다.';
    password.focus();
    result = false;
  }else{
    password.nextElementSibling!.textContent = '';
  }
  
  if(email.value.trim() === ''){
    email.nextElementSibling!.textContent = '이메일은 필수입니다.';
    email.focus();
    result = false;
  }else{
    email.nextElementSibling!.textContent = '';
  }
  return result;
}

document.querySelector('#login-form')?.addEventListener('submit', handleSubmit);