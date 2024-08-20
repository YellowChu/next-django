"use client";

import axios from "@/app/(axios)";
import React from "react";
import moment from "moment";
import Link from "next/link";

import PostForm from "@/app/(components)/PostForm";
import TheCard from "@/app/(components)/TheCard";
import { useFetch } from "@/app/(hooks)/useFetch";
import { Post } from "@/app/(types)";


export default function Home() {
  const { data, loading, error, fetch } = useFetch<Post[]>("/api/posts");

  React.useEffect(() => {
    fetch();
  }, []);

  const addPost = async (title: string, content: string) => {
    await axios.post("/api/posts", { title, content });
    fetch();
  };

  return (
    <>
      <h1 className="text-2xl font-medium">Posts</h1>

      <div className="mt-8">
        <TheCard>
          <PostForm onSubmit={addPost} />
        </TheCard>
      </div>

      <div className="mt-8">
        {data !== null ? (
          data.map((post: Post) => (
            <div className="mb-4" key={post.id}>
              <TheCard>
                <h2 className="text-lg font-medium">{post.title}</h2>
                <div className="text-xs text-slate-500">{moment(post.created).calendar()}</div>
                <p className="truncate mt-4">{post.content}</p>
    
                <div className="mt-4 flex justify-between">
                  <div className="text-sm text-slate-500">{post.comments_count} comments</div>
                  <Link href={`/post/${post.id}`} className="text-sm underline text-slate-500">
                    full post -&gt;
                  </Link>
                </div>
              </TheCard>
            </div>
          ))

        ) : error ? (
          <p>{error}</p>

        ) : loading ? (
          <p>Loading...</p>
        
        ) : (
          <></>
        )}
      </div>
    </>
  );
}