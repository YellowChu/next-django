export interface Post {
  id: number;
  created: string;
  updated: string;
  title: string;
  content: string;
  comments_count: number; 
}

export interface Comment {
  id: number;
  created: string;
  updated: string;
  content: string;
}