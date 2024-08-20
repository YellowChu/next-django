import moment from "moment";
import React from "react";

import { Comment } from "@/app/(types)";
import TheButton from "@/app/(components)/TheButton";

interface PostCommentsProps {
  comments: Comment[];
  replyToComment: (commentId: number, content: string) => void;
  deleteComment: (commentId: number) => void;
}

interface PostCommentProp {
  comment: Comment;
  replyingTo: number | null;
  light: boolean;
  setReplyingTo: (commentId: number | null) => void;
  replyToComment: (commentId: number, content: string) => void;
  deleteComment: (commentId: number) => void;
}

const PostComment = ({ comment, replyingTo, light, setReplyingTo, replyToComment, deleteComment }: PostCommentProp) => {
  const [replyContent, setReplyContent] = React.useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (replyingTo === null) return;

    replyToComment(replyingTo, replyContent);
    setReplyContent("");
    setReplyingTo(null);
  }

  return (
    <div className={`shadow-md p-3 mt-4 rounded-lg ${light ? 'bg-slate-100' : 'bg-slate-200'}`}>
      <div className="text-xs text-slate-500">{moment(comment.created).calendar()}</div>
      <p className="mt-2 mb-5">{comment.content}</p>

      {comment.replies.length > 0 && (
        <>
          {comment.replies.map((reply) => (
            <div key={reply.id}>
              <PostComment
                comment={reply}
                replyingTo={replyingTo}
                light={light ? false : true}
                setReplyingTo={setReplyingTo}
                replyToComment={replyToComment}
                deleteComment={deleteComment}
              />
            </div>
          ))}
        </>
      )}

      {replyingTo === comment.id && (
        <form onSubmit={handleSubmit} className="mt-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Reply to this comment"
              value={replyContent}
              onChange={(event) => setReplyContent(event.target.value)}
            />
            <TheButton type="submit">Reply</TheButton>
          </div>
        </form>
      )}

      <div className="flex gap-3 mt-4">
        <a className="underline text-xs cursor-pointer" onClick={() => setReplyingTo(comment.id)}>
          Reply
        </a>
        <div className="underline text-xs cursor-pointer" onClick={() => deleteComment(comment.id)}>
          Delete
        </div>
      </div>
    </div>
  )
}

export default function PostComments({ comments, replyToComment, deleteComment }: PostCommentsProps) {
  const [replyingTo, setReplyingTo] = React.useState<number | null>(null);

  return (
    <>
      {comments.map((comment) => (
        <div key={comment.id}>
          <PostComment
            comment={comment}
            replyingTo={replyingTo}
            light={false}
            setReplyingTo={setReplyingTo}
            replyToComment={replyToComment}
            deleteComment={deleteComment}
          />
        </div>
      ))}      
    </>
  )
}