import { uploadFileApi } from "../../apis/file";
import { createUserApi } from "../../apis/user";
import type { CreateUserRequest, UserType } from "../../types/user";

/**
 * 회원가입을 처리하는 함수
 * 폼 데이터에서 사용자 정보를 추출하고, 프로필 이미지가 있으면 업로드한 후
 * 사용자 생성 API를 호출합니다. 회원가입이 성공하면 메인 페이지로 이동합니다.
 * 
 * @async
 * @function signup
 * @param {HTMLFormElement} formElement - 회원가입 폼 요소
 * @returns {Promise<void>}
 */
async function signup(formElement: HTMLFormElement) {
  const formData = new FormData(formElement);

  // 첨부파일(프로필 이미지) 처리
  let image;
  const attachFile = formData.get('attach') as File;
  
  if(attachFile.size > 0){
    // 파일 업로드 API 호출
    const fileRes = await uploadFileApi(attachFile);
    console.log(`fileRes`, fileRes);
    if(fileRes?.ok){
      image = fileRes.item[0].path;
    }
  }

  const user: CreateUserRequest = {
    type: (formData.get('type') || 'user') as UserType ,
    email: formData.get('email') as string,
    name: formData.get('name') as string,
    password: formData.get('password') as string,
    image,
  };

  // 사용자 생성 API 호출
  const userData = await createUserApi(user);
  console.log(`userData`, userData);
  if(userData?.ok){
    alert('회원가입이 완료되었습니다.');
    location.href = '/'; // 메인 페이지로 이동
  }
}

/**
 * 폼 제출 이벤트를 처리하는 함수
 * 기본 제출 동작을 방지하고, 폼 데이터를 검증한 후
 * 검증이 통과하면 signup 함수를 호출하여 회원가입을 진행합니다.
 * 
 * @async
 * @function handleSubmit
 * @param {Event} event - 폼 제출 이벤트 객체
 * @returns {Promise<void>}
 */
async function handleSubmit(event: Event) {
  event.preventDefault(); // 브라우저 기본 동작 취소
  const formElement = event.target as HTMLFormElement;
  // 입력 데이터 검증
  const isValid = validateForm(formElement);
  if(isValid){
    await signup(formElement); // 회원가입 진행
  }  
}

/**
 * 폼 데이터 검증 함수
 * 이름, 이메일, 비밀번호 필드의 필수 입력 여부를 검증하고,
 * 검증 실패 시 오류 메시지를 표시합니다.
 * 
 * @function validateForm
 * @param {HTMLFormElement} formElement - 검증할 폼 요소
 * @returns {boolean} - 검증 통과 여부 (true: 통과, false: 실패)
 */
function validateForm(formElement: HTMLFormElement) {
  let result: boolean = true;

  const name = formElement.querySelector<HTMLInputElement>('[name=name]')!;
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

  if(name.value.trim() === ''){
    name.nextElementSibling!.textContent = '이름은 필수입니다.';
    name.focus();
    result = false;
  }else{
    name.nextElementSibling!.textContent = '';
  }
  
  return result;
}

document.querySelector('#signup-form')?.addEventListener('submit', handleSubmit);