"use client";

import React from "react";

import TheButton from "@/app/(components)/TheButton";

export default function PostForm(
  { onSubmit }: { onSubmit: (title: string, content: string) => void }
) {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(title, content);
    setTitle("");
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title" className="text-base font-medium">Title</label>
        <input
          id="title"
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>
      <div className="mt-2">
        <label htmlFor="content" className="text-base font-medium">Content</label>
        <textarea
          id="content"
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="What did I do today?"
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
      </div>
      <div className="flex justify-end w-full">
        <TheButton type="submit">Submit</TheButton>
      </div>
    </form>
  );
}