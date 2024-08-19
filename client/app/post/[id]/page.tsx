"use client";

import axios from "@/app/(axios)";
import moment from "moment";

import { useFetch } from "@/app/(hooks)/useFetch";
import React from "react";

import TheCard from "@/app/(components)/TheCard";
import { Comment, Post } from "@/app/(types)";

const PostComments = React.memo(({ comments }: { comments: Comment[] }) => (
  <div>
    {comments.map((comment) => (
      <div key={comment.id} className="mt-4 shadow-md p-3 bg-slate-200">
        <div className="text-xs text-slate-500">{moment(comment.created).calendar()}</div>
        <p className="mt-2">{comment.content}</p>
      </div>
    ))}
  </div>
));

const AddCommentForm = React.memo(
  ({ onSubmit, value, onChange }: { onSubmit: (event: React.FormEvent) => void; value: string; onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void }) => (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="content" className="text-base font-medium">Add comment</label>
        <textarea
          id="content"
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Interesting, but..."
          value={value}
          onChange={onChange}
        />
      </div>
      <div className="flex justify-end w-full mt-2">
        <button type="submit" className="px-4 py-3 bg-slate-600 text-white shadow-md rounded">Comment</button>
      </div>
    </form>
  )
);

export default function Page({ params }: { params: { id: string } }) {
  const { data: post, loading: loadingPost, error: errorPost, fetch: fetchPost } = useFetch<Post>(`/api/posts/${params.id}`);
  const { data: comments, loading: loadingComments, error: errorComments, fetch: fetchComments } = useFetch<Comment[]>(`/api/posts/${params.id}/comments`);

  React.useEffect(() => {
    fetchPost();
    fetchComments();
  }, []);

  const [newCommentContent, setNewCommentContent] = React.useState("");

  const handleChange = React.useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewCommentContent(event.target.value);
  }, []);

  const handleSubmit = React.useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    await axios.post(`/api/posts/${params.id}/comments`, { content: newCommentContent });
    setNewCommentContent("");
    fetchPost();
    fetchComments();
  }, [newCommentContent, fetchPost, fetchComments, params.id]);

  return (
    <>
      {loadingPost && <p>Loading...</p>}
      {errorPost && <p>{errorPost}</p>}

      {post !== null && (
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
              <AddCommentForm onSubmit={handleSubmit} value={newCommentContent} onChange={handleChange} />

              {loadingComments && <p>Loading...</p>}
              {errorComments && <p>{errorComments}</p>}
              {comments?.length === 0 && <p>No comments yet</p>}
              {comments !== null && <PostComments comments={comments} />}
            </TheCard>
          </div>
        </>
      )}
    </>
  );
}