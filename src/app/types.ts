export type User = {
  _id: string;
  username: string;
  fullname: string;
  password: string;

  email: string | null;
  phone: string | null;
};
export type PostComment = {
  _id: string;
  text: string;
  createdAt: string;
  createdBy: User;
};

export type PostLike = {
  _id: string;
  createdAt: string;
  createdBy: User;
};
export type Post = {
  _id: string;
  imageUrl: string;
  description: string;
  createdAt: string;
  likes: number;
  likedUsers: string[]; // <-- add this
  liked?: boolean; // <-- optional, computed
  user: {
    _id: string;
    username: string;
    avatar?: string;
  };
  comments: {
    user: string;
    text: string;
    createdAt?: string;
  }[];
};

export type Comment = {
  user: string;
  text: string;
  createdAt?: string;
};
