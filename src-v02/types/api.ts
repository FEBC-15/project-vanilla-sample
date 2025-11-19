/**
 * API 에러 응답
 */
export interface ApiError {
  ok: 0;
  message: string;
  // 인증 관련 에러
  errorName?: 'EmptyAuthorization' | 'TokenExpiredError' | 'JsonWebTokenError';
  // 유효성 검사 에러
  errors?: {
    [key: string]: {
      type: string;
      value: string;
      msg: string;
      location: string;
    };
  }
}

/**
 * 게시물 목록 조회 응답 (GET /posts)
 * 성공: { ok: 1, item: [...], pagination: {...} }
 * 실패: { ok: 0, message: "에러 메시지" }
 */
export type ListRes<T> = 
  | {
      ok: 1;
      item: T[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }
  | ApiError;

/**
 * 게시물 상세 조회 응답 (GET /posts/:id)
 * 성공: { ok: 1, item: {...} }
 * 실패: { ok: 0, message: "에러 메시지" }
 */
export type DetailRes<T> = 
| {
    ok: 1;
    item: T;
  }
| ApiError;

