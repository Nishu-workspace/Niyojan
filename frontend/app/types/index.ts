export interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: Date;
  isEmailVerfied: boolean;
  updatedAt: Date;
  profilePicture?:string;
}
export interface Workspace {
  _id:string,
  name:string,
  description?:string;
  owner: User | string;
  color: string;
  members: {
    user: User | string;
    role:"admin" | "member" | "owner" | "veiwer";
    joinedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}