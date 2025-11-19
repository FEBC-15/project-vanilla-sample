import { getPostListApi } from "../../apis/post";
import type { Post } from "../../types/post";

const LIMIT = '10';

/**
 * 게시글 목록을 조회하고 렌더링하는 함수
 * URL 쿼리 파라미터에서 type을 가져와 해당 타입의 게시글 목록을 표시합니다.
 * 기본값은 'info'이며, 첫 페이지의 LIMIT(10)개 게시글을 조회합니다.
 * 
 * @async
 * @function listView
 * @returns {Promise<void>}
 */
async function listView(){
  const type = new URLSearchParams(window.location.search).get('type') || 'info';

  const data = await getPostListApi({ type, page: '1', limit: LIMIT });
  if(data?.ok){
    render(data.item);
  }
}

/**
 * 게시글 목록을 테이블 행으로 렌더링하는 함수
 * Post 배열을 받아서 각 게시글을 테이블 행(tr) HTML로 변환하고,
 * 페이지의 tbody 요소에 삽입합니다.
 * 
 * @function render
 * @param {Post[]} posts - 렌더링할 게시글 배열
 * @returns {void}
 */
function render(posts: Post[]) {
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
}

renderSkeleton();
listView();