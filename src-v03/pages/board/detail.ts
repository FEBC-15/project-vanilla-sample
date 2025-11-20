import { createReplyApi, deletePostApi, deleteReplyApi, getPostApi, getReplyListApi } from "../../apis/post";
import type { Post, Reply } from "../../types/post";
import { getUser } from "../../utils/user";

/**
 * 게시글 상세 정보를 조회하고 렌더링하는 함수
 * URL 쿼리 파라미터에서 id를 가져와 해당 게시글의 상세 정보를 조회하고 표시합니다.
 * 
 * @async
 * @function detailView
 * @returns {Promise<void>}
 */
async function detailView(){
  const id = new URLSearchParams(window.location.search).get('id');
  if(id){
    const data = await getPostApi(id);
    if(data?.ok){
      render(data.item);
      replyListView();
    }
  }
}

/**
 * 게시글 상세 정보를 DOM에 렌더링하는 함수
 * Post 객체를 받아서 제목, 작성자명, 수정일시, 내용을 각각의 DOM 요소에 삽입합니다.
 * 
 * @function render
 * @param {Post} post - 렌더링할 게시글 객체
 * @returns {void}
 */
function render(post: Post) {
  document.querySelector('#title')!.innerHTML = post.title;
  document.querySelector('#user-name')!.innerHTML = post.user.name;
  document.querySelector('#updated-at')!.innerHTML = post.updatedAt;
  document.querySelector('#content > p')!.innerHTML = post.content;
  renderButtons(post);
}

/**
 * 게시글 상세 페이지의 버튼들을 렌더링하는 함수
 * 목록 버튼은 항상 표시하며, 로그인한 사용자가 게시글 작성자인 경우에만 수정/삭제 버튼을 추가로 표시합니다.
 * 
 * @function renderButtons
 * @param {Post} post - 버튼을 렌더링할 게시글 객체
 * @returns {void}
 */
function renderButtons(post: Post) {
  // detail.html 파일에서 복사 후 수정
  let buttonContent = `<a href="list?type=${post.type}" class="bg-orange-500 py-1 px-4 text-base text-white font-semibold ml-2 hover:bg-amber-400 rounded">목록</a>`;
  const user = getUser();
  // 로그인한 사용자 id와 게시물 작성자 id가 일치할 경우 수정, 삭제 버튼 추가
  if(user?._id === post.user._id){
    // detail.html 파일에서 복사 후 수정
    buttonContent += `
      <a href="edit?id=${post._id}&type=${post.type}" class="bg-gray-900 py-1 px-4 text-base text-white font-semibold ml-2 hover:bg-amber-400 rounded">수정</a>
      <button type="submit" class="bg-red-500 py-1 px-4 text-base text-white font-semibold ml-2 hover:bg-amber-400 rounded">삭제</button>
    `;
  }
  
  document.querySelector('#button-container')!.innerHTML = buttonContent;
}

detailView();

/**
 * 게시글 삭제 이벤트 핸들러
 * 폼 제출 시 기본 동작을 막고, URL 쿼리 파라미터에서 게시글 ID를 가져와 삭제 요청을 보냅니다.
 * 삭제가 성공하면 알림을 표시하고 게시글 목록 페이지로 이동합니다.
 * 
 * @async
 * @function handleDeletePost
 * @param {Event} event - 폼 제출 이벤트
 * @returns {Promise<void>}
 */
async function handleDeletePost(event: Event) {
  event.preventDefault();
  if(confirm('게시글을 삭제하시겠습니까?')){
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('id');
    const type = searchParams.get('type');
    if(id){
      const data = await deletePostApi(id);
      if(data?.ok){
        alert('게시글이 삭제되었습니다.');
        location.href = `list?type=${type}`;
      }
    }
  }
}

document.querySelector('#detail-form')?.addEventListener('submit', handleDeletePost);

/**
 * 댓글 목록을 조회하고 렌더링하는 함수
 * URL 쿼리 파라미터에서 게시글 ID를 가져와 해당 게시글의 댓글 목록을 조회하고 표시합니다.
 * 
 * @async
 * @function replyListView
 * @returns {Promise<void>}
 */
async function replyListView(){
  const id = new URLSearchParams(window.location.search).get('id');
  if(id){
    const data = await getReplyListApi(id);
    if(data?.ok){
      renderReplyList(data.item);
    }
  }
}

/**
 * 댓글 목록을 DOM에 렌더링하는 함수
 * Reply 배열을 받아서 각 댓글을 HTML로 변환하여 댓글 목록 영역에 삽입합니다.
 * 댓글 작성자 본인인 경우에만 삭제 버튼을 표시합니다.
 * 
 * @function renderReplyList
 * @param {Reply[]} replies - 렌더링할 댓글 배열
 * @returns {void}
 */
function renderReplyList(replies: Reply[]){
  // 사용자 정보 가져오기
  const user = getUser();
  const replySection = document.querySelector('#reply-section')!;
  const replyList = document.querySelector('#reply-list')!;

  // 댓글 개수 표시
  replySection.querySelector('#reply-count')!.innerHTML = `${replies.length}`;
  
  // 댓글 목록 초기화
  const id = new URLSearchParams(window.location.search).get('id');
  replyList.innerHTML = '';
  
  replies.forEach(reply => {
    // detail.html 파일에서 복사 후 수정
    replyList.innerHTML += `
      <div class="shadow-md rounded-lg p-4 mb-4">
        <div class="flex justify-between items-center mb-2">
          <div class="flex items-center">
            ${ reply.user.image ? `
              <img
                class="w-8 mr-2 rounded-full"
                src="${reply.user.image}"
                alt="${reply.user.name} 프로필 이미지"
              />
            ` : `
              <img
                class="w-8 mr-2 rounded-full"
                src="/assets/images/favicon.svg"
                alt="라이언 보드 로고"
              />
            ` }
            <a href="/" class="text-orange-400">${reply.user.name}</a>
          </div>
          <time class="text-gray-500" datetime="${reply.updatedAt}">${reply.updatedAt}</time>
        </div>
        <div class="flex justify-between items-start mb-2">
          <p class="whitespace-pre-wrap text-sm flex-1">${reply.content}</p>
          <form data-reply-id="${reply._id}" class="reply-delete-form inline ml-2" action="detail?id=${id}">
            ${ user?._id === reply.user._id ? `
              <button type="submit" class="bg-red-500 py-1 px-2 text-sm text-white font-semibold ml-2 hover:bg-amber-400 rounded">삭제</button>
            ` : ``}
          </form>
        </div>
      </div>
    `;
  });

  // 댓글 삭제 이벤트 핸들러
  replyList.querySelectorAll<HTMLFormElement>('.reply-delete-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if(confirm('댓글을 삭제하시겠습니까?')){
        const replyId = form.dataset.replyId;
        if(replyId){
          deleteReply(replyId);
        }
      }
    });
  });
}

/**
 * 댓글을 추가하는 함수
 * URL 쿼리 파라미터에서 게시글 ID를 가져와 새로운 댓글을 생성합니다.
 * 댓글 생성이 성공하면 댓글 목록을 다시 조회하여 화면을 갱신합니다.
 * 
 * @async
 * @function addReply
 * @returns {Promise<void>}
 */
async function addReply() {
  const id = new URLSearchParams(window.location.search).get('id');
  const replyForm = document.querySelector<HTMLFormElement>('#reply-form')!;
  const formData = new FormData(replyForm);
  const content = formData.get('content') as string;
  if(id){
    const data = await createReplyApi(id, { content });
    if(data?.ok){
      replyListView();
      replyForm.reset();
    }
  }
}

/**
 * 댓글 추가 폼 제출 이벤트 핸들러
 * 폼 제출 시 기본 동작을 막고, 입력된 댓글 내용을 검증한 후 댓글을 추가합니다.
 * 댓글 추가가 성공하면 폼을 초기화합니다.
 * 
 * @async
 * @function handleAddReply
 * @param {Event} event - 폼 제출 이벤트
 * @returns {Promise<void>}
 */
async function handleAddReply(event: Event) {
  event.preventDefault();
  const formElement = event.target as HTMLFormElement;
  const isValid = validateForm(formElement);
  if(isValid){
    addReply();
  }
}

/**
 * 댓글 추가 폼의 유효성을 검증하는 함수
 * 폼 요소에서 댓글 내용을 가져와 필수 입력 여부를 확인합니다.
 * 검증 실패 시 에러 메시지를 표시하고 해당 입력 필드에 포커스를 설정합니다.
 * 
 * @function validateForm
 * @param {HTMLFormElement} formElement - 검증할 폼 요소
 * @returns {boolean} - 검증 결과 (true: 유효함, false: 유효하지 않음)
 */
function validateForm(formElement: HTMLFormElement): boolean {
  let result: boolean = true;

  const content = formElement.querySelector<HTMLTextAreaElement>('[name=content]')!;

  if(content.value.trim() === ''){
    content.nextElementSibling!.textContent = '내용은 필수입니다.';
    content.focus();
    result = false;
  }else{
    content.nextElementSibling!.textContent = '';
  }

  return result;
}

/**
 * 댓글을 삭제하는 함수
 * URL 쿼리 파라미터에서 게시글 ID를 가져와 지정된 댓글을 삭제합니다.
 * 삭제가 성공하면 댓글 목록을 다시 조회하여 화면을 갱신합니다.
 * 
 * @async
 * @function deleteReply
 * @param {string} replyId - 삭제할 댓글의 ID
 * @returns {Promise<void>}
 */
async function deleteReply(replyId: string) {
  const postId = new URLSearchParams(window.location.search).get('id');
  if(postId){
    const data = await deleteReplyApi(postId, replyId);
    if(data?.ok){
      replyListView();
    }
  }
}

document.querySelector('#reply-form')?.addEventListener('submit', handleAddReply);