/**
 * API 에러 응답
 */
export interface ApiError {
  /** 요청 실패 여부 (항상 0) */
  ok: 0;
  /** 에러 메시지 */
  message: string;
  /** 인증 관련 에러 타입 */
  errorName?: 'EmptyAuthorization' | 'TokenExpiredError' | 'JsonWebTokenError';
  /** 유효성 검사 에러 정보 (필드별 상세 에러) */
  errors?: {
    [key: string]: {
      /** 에러 타입 */
      type: string;
      /** 검증 실패한 값 */
      value: string;
      /** 에러 메시지 */
      msg: string;
      /** 에러 발생 위치 (body, query, params 등) */
      location: string;
    };
  }
}

/**
 * 페이지네이션 정보
 */
export interface Pagination {
  /** 현재 페이지 번호 (1부터 시작) */
  page: number;
  /** 페이지당 항목 수 */
  limit: number;
  /** 전체 항목 수 */
  total: number;
  /** 전체 페이지 수 */
  totalPages: number;
}

/**
 * 목록 조회 API 응답 타입
 * @template T 목록 항목의 타입
 * @example
 * // 성공 응답
 * { ok: 1, item: [...], pagination: {...} }
 * // 실패 응답
 * { ok: 0, message: "에러 메시지" }
 */
export type ListRes<T> = 
  | {
      /** 요청 성공 여부 (항상 1) */
      ok: 1;
      /** 조회된 항목 배열 */
      item: T[];
      /** 페이지네이션 정보 */
      pagination: Pagination;
    }
  | ApiError;

/**
 * 상세 조회 API 응답 타입
 * @template T 조회할 항목의 타입
 * @example
 * // 성공 응답
 * { ok: 1, item: {...} }
 * // 실패 응답
 * { ok: 0, message: "에러 메시지" }
 */
export type DetailRes<T> = 
  | {
      /** 요청 성공 여부 (항상 1) */
      ok: 1;
      /** 조회된 항목 */
      item: T;
    }
  | ApiError;
