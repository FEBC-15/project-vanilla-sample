import { deletePostApi, getPostApi } from "../../apis/post";
import type { Post } from "../../types/post";
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