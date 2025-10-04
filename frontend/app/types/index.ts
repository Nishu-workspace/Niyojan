import type { StringValidation } from "zod/v3";

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
export enum ProjectStatus {
  PLANNING = "Planning",
  IN_PROGRESS = "In Progress",
  ON_HOLD = "On Hold",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled"
}
export interface Project {
  _id: string;
  title: string;
  description?: string;
  status:ProjectStatus;
  workspace: Workspace;
  StartDate: Date;
  dueDate: Date;
  progress: number;
  task: Task[];
  members:{
    user: User;
    role: "admin" | "member" | "owner" | "viewer";
  }
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean
}