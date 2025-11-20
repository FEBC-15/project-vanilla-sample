import { getPostListApi } from "../../apis/post";
import type { Pagination } from "../../types/api";
import type { Post } from "../../types/post";

/** 페이지당 게시글 개수 */
const LIMIT = '3';

/**
 * 게시글 목록을 조회하고 렌더링하는 함수
 * URL 쿼리 파라미터에서 type, keyword, page를 가져와 해당 조건의 게시글 목록을 표시합니다.
 * 기본값은 type='info', keyword='', page='1'이며, LIMIT(3)개 게시글을 조회합니다.
 * 
 * @async
 * @function listView
 * @returns {Promise<void>}
 */
async function listView(){
  const type = new URLSearchParams(window.location.search).get('type') || 'info';
  const keyword = new URLSearchParams(window.location.search).get('keyword') || '';
  const page = new URLSearchParams(window.location.search).get('page') || '1';
  const data = await getPostListApi({ type, limit: LIMIT, keyword, page });
  if(data?.ok){
    render(data.item);
    renderPagination(data.pagination);
  }
}

/**
 * 게시글 목록을 테이블 행으로 렌더링하는 함수
 * Post 배열을 받아서 각 게시글을 테이블 행(tr) HTML로 변환하고,
 * 페이지의 #list-container tbody 요소에 삽입합니다.
 * 
 * @function render
 * @param {Post[]} posts - 렌더링할 게시글 배열
 * @returns {void}
 */
function render(posts: Post[]) {
  const keyword = new URLSearchParams(window.location.search).get('keyword') || '';
  (document.querySelector('#search-form > input[name="keyword"]') as HTMLInputElement).value = keyword;

  const result = posts.map(post => {
    // list.html 파일에서 복사 후 수정
    return `
      <tr class="border-b border-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300 ease-in-out">
        <td class="p-2 text-center">${post._id}</td>
        <td class="p-2 truncate indent-4"><a href="detail?id=${post._id}&type=${post.type}" class="hover:text-orange-500 hover:underline">${post.title}</a></td>
        <td class="p-2 text-center truncate">${post.user.name}</td>
        <td class="p-2 text-center hidden sm:table-cell">${post.views}</td>
        <td class="p-2 truncate text-center hidden sm:table-cell">${post.createdAt}</td>
      </tr>
    `;
  });
  const tbody = document.querySelector('#list-container tbody');
  if (tbody) {
    tbody.innerHTML = result.join('');
  }
}

/**
 * 게시글 목록 로딩 중 스켈레톤 UI를 렌더링하는 함수
 * LIMIT 개수만큼 스켈레톤 테이블 행을 생성하여 페이지의 tbody 요소에 삽입합니다.
 * 데이터 로딩 전에 사용자에게 로딩 상태를 시각적으로 표시합니다.
 * 
 * @function renderSkeleton
 * @returns {void}
 */
function renderSkeleton() {
  const skeletonRows = Array.from({ length: parseInt(LIMIT) }, () => {
    // list.html 파일에서 복사
    return `
      <tr class="border-b border-gray-200 animate-pulse">
        <td class="p-2 text-center"><div class="h-6 leading-normal bg-gray-300 dark:bg-gray-600 rounded mx-auto w-8"></div></td>
        <td class="p-2 truncate indent-4"><div class="h-6 leading-normal bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div></td>
        <td class="p-2 text-center truncate"><div class="h-6 leading-normal bg-gray-300 dark:bg-gray-600 rounded mx-auto w-16"></div></td>
        <td class="p-2 text-center hidden sm:table-cell"><div class="h-6 leading-normal bg-gray-300 dark:bg-gray-600 rounded mx-auto w-12"></div></td>
        <td class="p-2 truncate text-center hidden sm:table-cell"><div class="h-6 leading-normal bg-gray-300 dark:bg-gray-600 rounded mx-auto"></div></td>
      </tr>
    `;
  }).join('');

  const tbody = document.querySelector('#list-container tbody');
  if (tbody) {
    tbody.innerHTML = skeletonRows;
  }

  // `글작성` 버튼 클릭시 자유게시판 등록 화면으로 이동(new?type=free)
  const type = new URLSearchParams(window.location.search).get('type') || 'info';
  const newButton = document.querySelector('#search-form + a') as HTMLAnchorElement;
  newButton.href = `new?type=${type}`;
}

renderSkeleton();
listView();

/**
 * 검색 폼 제출 이벤트 핸들러
 * 검색 키워드를 URL 쿼리 파라미터에 추가하고, 페이지를 새로고침하지 않고 목록을 다시 조회합니다.
 * 브라우저 히스토리에 URL을 추가하여 뒤로가기/앞으로가기가 가능하도록 합니다.
 * 
 * @function handleSearch
 * @param {Event} event - 폼 제출 이벤트 객체
 * @returns {void}
 */
function handleSearch(event: Event) {
  event.preventDefault();

  // url에 keyword 쿼리 파라미터 추가
  const target = event.target as HTMLFormElement;
  const formData = new FormData(target);
  const keyword = formData.get('keyword') as string;
  const url = new URL(window.location.href);
  url.searchParams.set('keyword', keyword);
  window.history.pushState({}, '', url.toString());
  listView();
}

document.querySelector('#search-form')!.addEventListener('submit', handleSearch);

/**
 * 페이지네이션 UI를 렌더링하는 함수
 * 페이지네이션 정보를 받아서 페이지 번호 링크를 생성하고,
 * 현재 페이지를 강조 표시합니다.
 * 
 * @function renderPagination
 * @param {Pagination} pagination - 페이지네이션 정보 (page, limit, total, totalPages)
 * @returns {void}
 */
function renderPagination(pagination: Pagination) {
  const searchParams = new URLSearchParams(window.location.search);
  const keyword = searchParams.get('keyword') || '';
  const currentPage = searchParams.get('page') || '1';
  const pageListElement = document.querySelector('#pagination > ul')!;

  let pageList = '';
  for(let i = 1; i <= pagination.totalPages; i++) {
    const isActive = i === parseInt(currentPage);
    // list.html 파일에서 복사
    pageList += `
      <li class="${isActive ? 'font-bold text-blue-700' : ''}"><a href="list?type=info&keyword=${keyword}&page=${i}">${i}</a></li>
    `;
  }
  pageListElement.innerHTML = pageList;
}


