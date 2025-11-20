import type { User } from '../types/user';

/**
 * 헤더 웹 컴포넌트
 * 사이트 상단 네비게이션 바 렌더링 및 사용자 인증 상태에 따른 UI 변경
 */
class HeaderComponent extends HTMLElement {
  /**
   * 웹 컴포넌트가 DOM에 연결될 때 호출되는 생명주기 메서드
   * 컴포넌트 렌더링과 이벤트 초기화 수행
   */
  connectedCallback() {
    this.render();
    this.initEvent();
  }

  /**
   * 헤더 UI 렌더링
   * 사용자 로그인 상태에 따라 로그인/회원가입 버튼 또는 사용자 정보와 로그아웃 버튼 표시
   */
  private render() {
    const user = this.getUserData();
    // index.html의 <header> 태그를 복사해서 수정
    this.innerHTML = `
      <header class="px-8 min-w-80 bg-slate-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 transition-color duration-500 ease-in-out">
        <nav class="flex flex-wrap justify-center items-center p-4 md:flex-nowrap md:justify-between">
          <div class="w-1/2 order-1 md:w-auto">
            <a href="/" class="flex items-center gap-2">
              <img class="mr-3 h-6 w-auto sm:h-9" src="/assets/images/favicon.svg" width="24" height="24" alt="로고 이미지" />
              <span class="text-lg font-bold">라이언 보드 v03</span>
            </a>
          </div>
          <div class="w-auto order-2 text-base mt-4 md:mt-0">
            <ul class="flex items-center gap-6 uppercase">
              <li class="hover:text-amber-500 hover:font-semibold">
                <a href="/src/pages/board/list?type=info">정보공유</a>
              </li>
              <li class="hover:text-amber-500 hover:font-semibold">
                <a href="/src/pages/board/list?type=free">자유게시판</a>
              </li>
              <li class="hover:text-amber-500 hover:font-semibold">
                <a href="/src/pages/board/list?type=qna">질문게시판</a>
              </li>
            </ul>
          </div>

          <div class="w-1/2 order-1 flex justify-end items-center md:order-2 md:w-auto">

          ${ user.name ? `
            <form id="logout-form" action="/">
              <p class="flex items-center">
                ${user.image ? 
                  `<img 
                    class="w-8 rounded-full mr-2" 
                    src="${user.image}"
                    alt="${user.name} 프로필 이미지" />
                  ${user.name}님 :)
                ` : ``}
                <button type="submit" class="bg-gray-900 py-1 px-2 text-sm text-white font-semibold ml-2 hover:bg-amber-400 rounded">로그아웃</button>
              </p>
            </form>
          ` : `
            <div class="flex justify-end">
              <a href="/src/pages/user/login" class="bg-orange-500 py-1 px-2 text-sm text-white font-semibold ml-2 hover:bg-amber-400 rounded">로그인</a>
              <a href="/src/pages/user/signup" class="bg-gray-900 py-1 px-2 text-sm text-white font-semibold ml-2 hover:bg-amber-400 rounded">회원가입</a>
            </div>
          `}
            <button
              type="button"
              data-toggle-dark="dark"
              class="ml-4 flex items-center w-8 h-8 justify-center text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg toggle-dark-state-example hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 dark:bg-gray-800 focus:outline-none dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              <svg
                data-toggle-icon="moon"
                class="w-3.5 h-3.5 hidden"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 18 20"
              >
                <path d="M17.8 13.75a1 1 0 0 0-.859-.5A7.488 7.488 0 0 1 10.52 2a1 1 0 0 0 0-.969A1.035 1.035 0 0 0 9.687.5h-.113a9.5 9.5 0 1 0 8.222 14.247 1 1 0 0 0 .004-.997Z"></path>
              </svg>
              <svg
                data-toggle-icon="sun"
                class="w-3.5 h-3.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-11a1 1 0 0 0 1-1V1a1 1 0 0 0-2 0v2a1 1 0 0 0 1 1Zm0 12a1 1 0 0 0-1 1v2a1 1 0 1 0 2 0v-2a1 1 0 0 0-1-1ZM4.343 5.757a1 1 0 0 0 1.414-1.414L4.343 2.929a1 1 0 0 0-1.414 1.414l1.414 1.414Zm11.314 8.486a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM4 10a1 1 0 0 0-1-1H1a1 1 0 0 0 0 2h2a1 1 0 0 0 1-1Zm15-1h-2a1 1 0 1 0 0 2h2a1 1 0 0 0 0-2ZM4.343 14.243l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414a1 1 0 0 0-1.414-1.414ZM14.95 6.05a1 1 0 0 0 .707-.293l1.414-1.414a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 .707 1.707Z"></path>
              </svg>
              <span class="sr-only">Toggle dark/light mode</span>
            </button>

          </div>
        </nav>
      </header>
    `;
  }

  /**
   * localStorage에서 사용자 데이터 조회
   * @returns {User} 사용자 정보 객체 (없을 경우 빈 객체)
   */
  private getUserData(): User {
    let user: User = JSON.parse(localStorage.getItem('user') || '{}');
    return user;
  }

  /**
   * 헤더 내부의 이벤트 리스너 초기화
   * 로그아웃 폼 제출 이벤트 등록
   */
  private initEvent(){
    this.querySelector('#logout-form')?.addEventListener('submit', this.handleLogout.bind(this)) || null;
  }

  /**
   * 로그아웃 처리
   * localStorage에서 사용자 정보 제거 및 헤더 리렌더링
   */
  private handleLogout() {
    localStorage.removeItem('user');
    this.render();
  }

}

// HeaderComponent를 '<lion-header>' 태그명으로 등록
customElements.define('lion-header', HeaderComponent);