/**
 * 게시글 관련 타입 정의
 */

import type { User } from './user';

// 게시글 정보 (기본 타입 - 모든 속성 포함)
export interface Post {
  _id: number;
  type: string;
  user: User;
  title: string;
  content: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

// 게시글 목록 조회용 (replies 제외)
export interface PostListItem extends Omit<Post, 'replies'> {
  
}

// 게시글 생성 요청
export interface CreatePostRequest extends Pick<Post, 'type' | 'title' | 'content'> {

}

// 게시글 수정 요청
export interface UpdatePostRequest extends Pick<Post, 'title' | 'content'> {

}

// 댓글 정보 (기본 타입 - 모든 속성 포함)
export interface Reply {
  _id: number;
  user: User;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// 댓글 생성 요청
export interface CreateReplyRequest extends Pick<Reply, 'content'> {
  
}


