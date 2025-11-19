import type { ListRes, DetailRes } from "../types/api";
import type { Post, CreatePostRequest, UpdatePostRequest, Reply, CreateReplyRequest } from "../types/post";
import { getAxios, handleAxiosError } from "../utils/axios";

const axiosInstance = getAxios();

/**
 * 게시글 목록을 조회합니다.
 * @param params - 쿼리 파라미터 (페이지네이션, 필터링 등)
 * @returns 게시글 목록과 페이지네이션 정보를 포함한 응답
 * @throws 네트워크 오류 또는 서버 오류 시 예외 발생
 */
export async function getPostListApi(params: Record<string, string> = {}): Promise<ListRes<Post> | undefined> {
  try{
    const res = await axiosInstance.get<ListRes<Post>>('/posts', { params });
    return res.data;
  }catch(err){
    handleAxiosError(err);
  }
}

/**
 * 게시글을 상세 조회합니다.
 * @param id - 조회할 게시글의 ID
 * @returns 게시글 정보를 포함한 응답
 * @throws 네트워크 오류 또는 서버 오류 시 예외 발생
 */
export async function getPostApi(id: string): Promise<DetailRes<Post> | undefined> {
  try{
    const res = await axiosInstance.get<DetailRes<Post>>(`/posts/${id}`);
    return res.data;
  }catch(err){
    handleAxiosError(err);
  }
}

/**
 * 새로운 게시글을 생성합니다.
 * @param post - 생성할 게시글 정보
 * @returns 생성된 게시글 정보를 포함한 응답
 * @throws 네트워크 오류 또는 서버 오류 시 예외 발생
 */
export async function createPostApi(post: CreatePostRequest): Promise<DetailRes<Post> | undefined> {
  try{
    const res = await axiosInstance.post<DetailRes<Post>>('/posts', post);
    return res.data;
  }catch(err){
    handleAxiosError(err);
  }
}

/**
 * 게시글을 수정합니다.
 * @param id - 수정할 게시글의 ID
 * @param post - 수정할 게시글 정보
 * @returns 수정된 게시글 정보를 포함한 응답
 * @throws 네트워크 오류 또는 서버 오류 시 예외 발생
 */
export async function updatePostApi(id: string, post: UpdatePostRequest): Promise<DetailRes<Post> | undefined> {
  try{
    const res = await axiosInstance.patch<DetailRes<Post>>(`/posts/${id}`, post);
    return res.data;
  }catch(err){
    handleAxiosError(err);
  }
}

/**
 * 게시글을 삭제합니다.
 * @param id - 삭제할 게시글의 ID
 * @returns 삭제된 게시글 정보를 포함한 응답
 * @throws 네트워크 오류 또는 서버 오류 시 예외 발생
 */
export async function deletePostApi(id: string): Promise<DetailRes<Post> | undefined> {
  try{
    const res = await axiosInstance.delete<DetailRes<Post>>(`/posts/${id}`);
    return res.data;
  }catch(err){
    handleAxiosError(err);
  }
}

/**
 * 게시글의 댓글 목록을 조회합니다.
 * @param id - 댓글을 조회할 게시글의 ID
 * @returns 댓글 목록과 페이지네이션 정보를 포함한 응답
 * @throws 네트워크 오류 또는 서버 오류 시 예외 발생
 */
export async function getReplyListApi(id: string): Promise<ListRes<Reply> | undefined> {
  try{
    const res = await axiosInstance.get<ListRes<Reply>>(`/posts/${id}/replies`);
    return res.data;
  }catch(err){
    handleAxiosError(err);
  }
}

/**
 * 게시글에 새로운 댓글을 생성합니다.
 * @param id - 댓글을 생성할 게시글의 ID
 * @param reply - 생성할 댓글 정보
 * @returns 생성된 댓글 정보를 포함한 응답
 * @throws 네트워크 오류 또는 서버 오류 시 예외 발생
 */
export async function createReplyApi(id: string, reply: CreateReplyRequest): Promise<DetailRes<Reply> | undefined> {
  try{
    const res = await axiosInstance.post<DetailRes<Reply>>(`/posts/${id}/replies`, reply);
    return res.data;
  }catch(err){
    handleAxiosError(err);
  }
}

/**
 * 게시글의 댓글을 삭제합니다.
 * @param postId - 댓글이 속한 게시글의 ID
 * @param replyId - 삭제할 댓글의 ID
 * @returns 삭제된 댓글 정보를 포함한 응답
 * @throws 네트워크 오류 또는 서버 오류 시 예외 발생
 */
export async function deleteReplyApi(postId: string, replyId: string): Promise<DetailRes<Reply> | undefined> {
  try{
    const res = await axiosInstance.delete<DetailRes<Reply>>(`/posts/${postId}/replies/${replyId}`);
    return res.data;
  }catch(err){
    handleAxiosError(err);
  }
}