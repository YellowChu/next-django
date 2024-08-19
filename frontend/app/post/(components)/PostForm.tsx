"use client";

import axios from "@/app/(axios)";
import React from "react";

export default function PostForm({ onSubmit }: { onSubmit: () => void }) {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await axios.post("/api/posts", { title, content });
    onSubmit();
  };

  return (
    <form>
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
        <button type="submit" className="px-4 py-3 bg-slate-600 text-white shadow-md rounded" onClick={handleSubmit}>Submit</button>
      </div>
    </form>
  );
}