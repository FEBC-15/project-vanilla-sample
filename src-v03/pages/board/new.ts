import { createPostApi } from "../../apis/post";
import type { CreatePostRequest } from "../../types/post";
import { getUser, navigateLogin } from "../../utils/user";

/**
 * 로그인 여부 확인
 * 로그인 안한 경우 로그인 페이지로 이동
 */
const user = getUser();
if(!user){
  navigateLogin();
}

/**
 * 게시글을 생성하는 비동기 함수
 * URL 쿼리 파라미터에서 게시판 타입을 가져오고,
 * 폼 데이터를 수집하여 API를 호출합니다.
 * 생성 성공 시 해당 게시판 목록 페이지로 이동합니다.
 */
async function createPost() {
  const type = new URLSearchParams(window.location.search).get('type');
  const formData = new FormData(document.querySelector<HTMLFormElement>('#new-form')!);
  const post: CreatePostRequest = {
    type: type || 'info',
    title: formData.get('title') as string,
    content: formData.get('content') as string,
  };
  const postRes = await createPostApi(post);
  if(postRes?.ok){  
    alert('게시글이 등록되었습니다.');
    location.href = `list?type=${type}`;
  }
}

/**
 * 폼 제출 이벤트 핸들러
 * 기본 폼 제출 동작을 막고, 유효성 검사 에러 메시지를 초기화한 후
 * 게시글 생성 함수를 호출합니다.
 * @param event - 폼 제출 이벤트 객체
 */
async function handleSubmit(event: Event) {
  event.preventDefault();
  const formElement = event.target as HTMLFormElement;
  const isValid = validateForm(formElement);
  if(isValid){
    createPost();
  }
}

/**
 * 폼 유효성 검사 함수
 * 폼 데이터를 검사하여 유효성 검사 에러 메시지를 초기화한 후
 * 게시글 생성 함수를 호출합니다.
 * @param formElement - 폼 요소
 * @returns {boolean} - 유효성 검사 결과
 */
function validateForm(formElement: HTMLFormElement): boolean {
  let result: boolean = true;

  const title = formElement.querySelector<HTMLInputElement>('[name=title]')!;
  const content = formElement.querySelector<HTMLTextAreaElement>('[name=content]')!;

  if(content.value.trim() === ''){
    content.nextElementSibling!.textContent = '내용은 필수입니다.';
    content.focus();
    result = false;
  }else{
    content.nextElementSibling!.textContent = '';
  }

  if(title.value.trim() === ''){
    title.nextElementSibling!.textContent = '제목은 필수입니다.';
    title.focus();
    result = false;
  }else{
    title.nextElementSibling!.textContent = '';
  }
  return result;
}

document.querySelector('#new-form')?.addEventListener('submit', handleSubmit);

// `취소` 버튼 클릭시 자유게시판 목록 화면으로 이동(list?type=free)
const cancelButton = document.querySelector('#button-container > a') as HTMLAnchorElement;
const type = new URLSearchParams(window.location.search).get('type') || 'info';
cancelButton.href = `list?type=${type}`;