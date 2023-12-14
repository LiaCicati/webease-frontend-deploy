import { Attribute } from "./Attribute";
export interface Post {
  postId?: string;
  collectionId?: string;
  attributes: Record<string, Attribute>;
  userId?: string;
}
