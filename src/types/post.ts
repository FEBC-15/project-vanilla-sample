/**
 * 게시글 전체 정보 (서버에서 반환하는 완전한 형태)
 */
export interface PostInfo {
  "_id": number,
  "type": string,
  "user": {
    "_id": number,
    "name": string
  },
  "title": string,
  "content": string,
  "createdAt": string,
  "updatedAt": string,
  "repliesCount": 3
}

/**
 * 게시글 목록 항목 (목록 조회 시 content 제외)
 */
export type PostListItem = Omit<PostInfo, 'content'>;
