"use client";

import axios from "@/app/(axios)";
import moment from "moment";

import { useFetch } from "@/app/(hooks)/useFetch";
import React from "react";

import TheCard from "@/app/(components)/TheCard";
import PostComment from "@/app/(components)/PostComment";
import { Comment, Post } from "@/app/(types)";

export default function Page({ params }: { params: { id: string } }) {
  const { data: post, loading: loadingPost, error: errorPost, fetch: fetchPost } = useFetch<Post>(`/api/posts/${params.id}`);
  const { data: comments, loading: loadingComments, error: errorComments, fetch: fetchComments } = useFetch<Comment[]>(`/api/posts/${params.id}/comments`);

  React.useEffect(() => {
    fetchPost();
    fetchComments();
  }, []);

  const [newCommentContent, setNewCommentContent] = React.useState("");

  const addComment = (async (event: React.FormEvent) => {
    event.preventDefault();
    await axios.post(`/api/posts/${params.id}/comments`, { content: newCommentContent });

    setNewCommentContent("");
    fetchPost();
    fetchComments();
  });

  return (
    <>
      {loadingPost ? (
        <p>Loading...</p>
      
      ) : errorPost ? (
        <p>{errorPost}</p>
      
      ) : post !== null ? (
        <>
          <div className="flex justify-between">
            <div>
              <h1 className="text-2xl font-medium">{post.title}</h1>
              <div className="text-xs text-slate-500">{moment(post.created).calendar()}</div>
            </div>
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
                  <button type="submit" className="px-4 py-3 bg-slate-600 text-white shadow-md rounded">Comment</button>
                </div>
              </form>

              {loadingComments ? (
                <p>Loading...</p>
              
              ) : errorComments ? (
                <p>{errorPost}</p>
              
              ) : comments?.length === 0 ? (
                <p>No comments yet</p>
              
              ) : comments !== null ? (
                comments.map((comment: Comment) => (
                  <div key={comment.id} className="mt-4">
                    <PostComment created={comment.created} content={comment.content} />
                  </div>
                ))

              ) : (
                <></>
              )}
            </TheCard>
          </div>
        </>

      ) : (
        <></>
      )}
    </>
  );
}