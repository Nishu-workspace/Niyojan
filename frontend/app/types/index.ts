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
  tasks: Task[];
  members:{
    user: User;
    role: "admin" | "member" | "owner" | "viewer";
  }
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean
}
export type TaskStatus = "To Do" | "In Progress" | "Done";
export type TaskPriority = "High" | "Medium" | "Low";

export interface Substask {
  _id:string;
  title:string;
  completed: boolean;
  createdAt: Date;
}
export interface Attachment {
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: Date;
  _id: string;
}

export interface Task {
  _id: string,
  title: string,
  description?: string,
  status: TaskStatus;
  project: Project;
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
  dueDate: Date;
  priority: TaskPriority;
  assignee: User | string;
  createdBy: User | string;
  assigness: User[];
  substasks?: Substask[];
  watchers?:User[];
  attachments?: Attachment[];
}

export interface MembersProps {
  _id:string;
  user: User;
  role: "admin" | 'member' | 'owner' | "viewer";
  joinedAt:Date
}