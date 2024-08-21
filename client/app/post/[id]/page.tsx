"use client";

import { AxiosError } from "axios";
import axios from "@/app/(axios)";
import moment from "moment";
import React from "react";
import { useRouter } from "next/navigation";

import { useFetch } from "@/app/(hooks)/useFetch";

import TheButton from "@/app/(components)/TheButton";
import TheCard from "@/app/(components)/TheCard";
import PostComments from "@/app/(components)/PostComments";
import { Comment, Post } from "@/app/(types)";

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();

  const { data: post, loading: loadingPost, error: errorPost, fetch: fetchPost } = useFetch<Post>(`/api/posts/${params.id}`);
  const { data: comments, loading: loadingComments, error: errorComments, fetch: fetchComments } = useFetch<Comment[]>(`/api/posts/${params.id}/comments`);

  React.useEffect(() => {
    fetchPost();
    fetchComments();
  }, []);

  const [newCommentContent, setNewCommentContent] = React.useState("");

  const addComment = (async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await axios.post(`/api/posts/${params.id}/comments`, { content: newCommentContent });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 400 && err.response?.data?.msg) {
        alert(err.response.data.msg);
      } else {
        alert("An error occurred");
      }
    }

    setNewCommentContent("");
    fetchPost();
    fetchComments();
  });

  const replyToComment = async (commentId: number, content: string) => {
    try {
      await axios.post(`/api/posts/${params.id}/comments/${commentId}/reply`, { content });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 400 && err.response?.data?.msg) {
        alert(err.response.data.msg);
      } else {
        alert("An error occurred");
      }
    }

    fetchPost();
    fetchComments();
  }

  const deleteComment = async (commentId: number) => {
    await axios.delete(`/api/posts/${params.id}/comments/${commentId}`);
    fetchPost();
    fetchComments();
  }

  const deletePost = (async () => {
    await axios.delete(`/api/posts/${params.id}`);
    router.push("/");
  });

  return (
    <>      
      { post !== null ? (
        <>
          <div className="flex justify-between">
            <div>
              <h1 className="text-2xl font-medium">{post.title}</h1>
              <div className="text-xs text-slate-500">{moment(post.created).calendar()}</div>
            </div>

            <TheButton onClick={deletePost}>Delete post</TheButton>
          </div>

          <div className="mt-8">
            <TheCard>
              <p className="mt-4">{post.content}</p>

              <div className="mt-4 flex justify-between">
                <div className="text-sm text-slate-500">{post.comments_count} comments</div>
              </div>
            </TheCard>
          </div>

          <div className="mt-4">
            <TheCard>
              <form onSubmit={addComment}>
                <div>
                  <label htmlFor="content" className="text-base font-medium">Add comment</label>
                  <textarea
                    id="content"
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Interesting, but..."
                    value={newCommentContent}
                    onChange={(event) => setNewCommentContent(event.target.value)}
                  />
                </div>
                <div className="flex justify-end w-full mt-2">
                  <TheButton type="submit">Comment</TheButton>
                </div>
              </form>

              {comments !== null && comments.length > 0 ? (
                <PostComments
                  comments={comments}
                  replyToComment={replyToComment}
                  deleteComment={deleteComment}
                />

              ) : comments !== null && comments.length === 0 ? (
                <p>No comments yet</p>

              ) : errorComments ? (
                <p>{errorComments}</p>

              ) : loadingComments ? (
                <p>Loading...</p>

              ) : (
                <></>
              )}
            </TheCard>
          </div>
        </>

      ) : errorPost ? (
        <p>{errorPost}</p>
      
      ) : loadingPost ? (
        <p>Loading...</p>
      
      ) : (
        <></>
      )}
    </>
  );
}