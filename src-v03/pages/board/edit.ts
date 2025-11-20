import { getPostApi, updatePostApi } from "../../apis/post";
import type { Post, UpdatePostRequest } from "../../types/post";

/**
 * 게시글 수정 페이지 초기화 함수
 * URL 쿼리 파라미터에서 id를 가져와 해당 게시글의 정보를 조회하고 폼에 렌더링합니다.
 * 
 * @async
 * @function editView
 * @returns {Promise<void>}
 */
async function editView(){
  const id = new URLSearchParams(window.location.search).get('id');
  if(id){
    const data = await getPostApi(id);
    if(data?.ok){
      render(data.item);
    }
  }
}

/**
 * 게시글 정보를 폼에 렌더링하는 함수
 * Post 객체를 받아서 제목과 내용을 각각의 입력 필드에 설정합니다.
 * 
 * @function render
 * @param {Post} post - 폼에 렌더링할 게시글 객체
 * @returns {void}
 */
function render(post: Post) {
  const title = document.querySelector<HTMLInputElement>('#title');
  if(title){
    title.value = post.title;
  }
  
  const content = document.querySelector<HTMLTextAreaElement>('#content');
  if(content){
    content.value = post.content;
  }

  // `취소` 버튼 클릭시 자유게시판 상세 화면으로 이동(detail?type=free)
  const cancelButton = document.querySelector('#button-container > a') as HTMLAnchorElement;
  const type = new URLSearchParams(window.location.search).get('type') || 'info';
  const id = new URLSearchParams(window.location.search).get('id');
  cancelButton.href = `detail?id=${id}&type=${type}`;
}

/**
 * 게시글을 업데이트하는 함수
 * 폼에서 입력된 제목과 내용을 가져와 서버에 업데이트 요청을 보냅니다.
 * 업데이트가 성공하면 알림을 표시하고 게시글 상세 페이지로 이동합니다.
 * 
 * @async
 * @function updatePost
 * @returns {Promise<void>}
 */
async function updatePost() {
  const id = new URLSearchParams(window.location.search).get('id');
  const type = new URLSearchParams(window.location.search).get('type');
  if(id){
    const form = document.querySelector<HTMLFormElement>('#edit-form');
    const formData = new FormData(form!);
    const post: UpdatePostRequest = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
    };
    const data = await updatePostApi(id, post);
    if(data?.ok){
      alert('게시글이 수정되었습니다.');
      location.href = `detail?id=${id}&type=${type}`;
    }
  }
}

/**
 * 폼 유효성 검증 함수
 * 제목과 내용 필드가 비어있지 않은지 검증합니다.
 * 유효하지 않은 필드가 있으면 에러 메시지를 표시하고 해당 필드에 포커스를 설정합니다.
 * 
 * @function validateForm
 * @param {HTMLFormElement} formElement - 검증할 폼 요소
 * @returns {boolean} - 폼이 유효하면 true, 그렇지 않으면 false
 */
function validateForm(formElement: HTMLFormElement): boolean {
  let result: boolean = true;

  const title = formElement.querySelector<HTMLInputElement>('[name=title]')!;
  const content = formElement.querySelector<HTMLTextAreaElement>('[name=content]')!;

  // 내용 필드 검증
  if(content.value.trim() === ''){
    content.nextElementSibling!.textContent = '내용은 필수입니다.';
    content.focus();
    result = false;
  }else{
    content.nextElementSibling!.textContent = '';
  }
  
  // 제목 필드 검증
  if(title.value.trim() === ''){
    title.nextElementSibling!.textContent = '제목은 필수입니다.';
    title.focus();
    result = false;
  }else{
    title.nextElementSibling!.textContent = '';
  }
  return result;
}

/**
 * 폼 제출 이벤트 핸들러
 * 폼 제출 시 기본 동작을 막고, 유효성 검증을 수행한 후 유효한 경우에만 게시글을 업데이트합니다.
 * 
 * @async
 * @function handleSubmit
 * @param {Event} event - 폼 제출 이벤트
 * @returns {Promise<void>}
 */
async function handleSubmit(event: Event) {
  event.preventDefault();

  const formElement = event.target as HTMLFormElement;
  const isValid = validateForm(formElement);
  if(isValid){
    updatePost();
  }
}
  
// 페이지 로드 시 게시글 정보 조회 및 폼 렌더링
editView();
// 폼 제출 이벤트 리스너 등록
document.querySelector('#edit-form')?.addEventListener('submit', handleSubmit);
