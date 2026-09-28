import { z } from "zod";

export const LoginSchema = z.object({
    email: z.email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});


export const RecordJobSchema = z.object({
    customer: z.string().trim().min(1, "Customer name is required"),
    job: z.string().trim().min(1, "Job description is required"),
    amount: z
        .number({ message: "Please enter a valid amount" })
        .gt(0, "Amount must be greater than 0"),
});

export type RecordJobFormInputs = z.infer<typeof RecordJobSchema>;