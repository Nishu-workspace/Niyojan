import { ProjectStatus } from '@/types';
import { z } from 'zod';

export const signInSchema = z.object({
    email: z.string().email("Invalid email address!!"),
    password: z.string().min(6, "Password is required!!"),
});

export const signUpSchema = z.object({
    email: z.string().email("Invalid email address!!"),
    password: z.string().min(8, "Password must be 8 characters!!"),
    name: z.string().min(3, "Name must be 3 characters!!"),
    confirmPassword: z.string().min(8, "Confirm Password must be 8 characters!!"),
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
});

export const resetPasswordSchema = z.object({
    newPassword: z.string().min(8, "Password must be 8 characters!!"),
    confirmPassword: z.string().min(8, "Confirm Password must be 8 characters!!"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
});

export const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address!!"),
});

export const workspaceSchema = z.object({
    name: z.string().min(3,"Name must be at least 3 characters"),
    color: z.string().min(3,"Color must be at least 3 characters"),
    description: z.string().optional()
})

export const projectSchema = z.object({
    title: z.string().min(3,'Title must be 3 characters'),
    description: z.string().optional(),
    status: z.nativeEnum(ProjectStatus),
    startDate: z.string().min(10,'Start date is required'),
    dueDate: z.string().min(10,"Due date is required"),
    members: z.array(
        z.object({
            user: z.string(),
            role: z.enum(["admin","member","owner",'viewer'])
        })
    )
    .optional(),
    tags: z.string().optional()
})