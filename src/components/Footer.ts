/**
 * 푸터 웹 컴포넌트
 * 사이트 하단 정보 렌더링
 */
class FooterComponent extends HTMLElement {
  /**
   * 웹 컴포넌트가 DOM에 연결될 때 호출되는 생명주기 메서드
   * 컴포넌트 렌더링과 이벤트 초기화 수행
   */
  connectedCallback() {
    this.render();
  }

  /**
   * 푸터 UI 렌더링
   */
  private render() {
    // index.html의 <footer> 태그 복사
    this.innerHTML = `
      <footer class="p-4 pb-12 w-full border-t border-t-slate-200  dark:border-t-slate-500 dark:bg-gray-600 text-gray-600 dark:text-white transition-color duration-500 ease-in-out">
        <div class="min-w-[320px] flex flex-wrap gap-4 justify-center items-center text-sm text-slate-400">
          <a href="/" class="hover:font-semibold dark:hover:text-gray-200">이용 약관</a>
          <a href="/" class="hover:font-semibold dark:hover:text-gray-200">게시판 정책</a>
          <a href="/" class="hover:font-semibold dark:hover:text-gray-200">회사소개</a>
          <a href="/" class="hover:font-semibold dark:hover:text-gray-200">광고</a>
          <a href="/" class="hover:font-semibold dark:hover:text-gray-200">마이비즈니스</a>
          <a href="/" class="hover:font-semibold dark:hover:text-gray-200">제휴 제안</a>
          <a href="/" class="hover:font-semibold dark:hover:text-gray-200">이용약관</a>
          <a href="/" class="hover:font-semibold dark:hover:text-gray-200">개인정보취급방침</a>
          <a href="/" class="hover:font-semibold dark:hover:text-gray-200">청소년보호 정책</a>
          <a href="/" class="hover:font-semibold dark:hover:text-gray-200">고객센터</a>
        </div>
      </footer>
    `;
  }

}

// FooterComponent를 '<lion-footer>' 태그명으로 등록
customElements.define('lion-footer', FooterComponent);