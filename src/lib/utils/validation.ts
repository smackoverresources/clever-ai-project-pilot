import { z } from 'zod';

// Common validation schemas
export const emailSchema = z
  .string()
  .email('Please enter a valid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  );

export const phoneSchema = z
  .string()
  .regex(
    /^\+?[\d\s-]{10,}$/,
    'Please enter a valid phone number (e.g., +1 234 567 8900)'
  );

export const urlSchema = z.string().url('Please enter a valid URL');

export const dateSchema = z.coerce
  .date()
  .refine((date) => !isNaN(date.getTime()), 'Please enter a valid date');

export const futureDate = z.coerce
  .date()
  .refine(
    (date) => date > new Date(),
    'Please enter a date in the future'
  );

export const pastDate = z.coerce
  .date()
  .refine(
    (date) => date < new Date(),
    'Please enter a date in the past'
  );

// Common validation functions
export function isValidEmail(email: string): boolean {
  return emailSchema.safeParse(email).success;
}

export function isValidPassword(password: string): boolean {
  return passwordSchema.safeParse(password).success;
}

export function isValidPhone(phone: string): boolean {
  return phoneSchema.safeParse(phone).success;
}

export function isValidUrl(url: string): boolean {
  return urlSchema.safeParse(url).success;
}

export function isValidDate(date: string | Date): boolean {
  return dateSchema.safeParse(date).success;
}

export function isFutureDate(date: string | Date): boolean {
  return futureDate.safeParse(date).success;
}

export function isPastDate(date: string | Date): boolean {
  return pastDate.safeParse(date).success;
}

// Form validation schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  phone: phoneSchema.optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  website: urlSchema.optional(),
  avatar: z
    .instanceof(File)
    .refine((file) => file.size <= 5000000, 'File size must be less than 5MB')
    .refine(
      (file) =>
        ['image/jpeg', 'image/png', 'image/gif'].includes(file.type),
      'File must be an image (JPEG, PNG, or GIF)'
    )
    .optional(),
});

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  startDate: dateSchema,
  endDate: dateSchema.optional(),
  status: z.enum(['active', 'completed', 'archived']),
  priority: z.enum(['low', 'medium', 'high']),
}).refine(
  (data) => !data.endDate || data.startDate <= data.endDate,
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  projectId: z.string().min(1, 'Project is required'),
  status: z.enum(['todo', 'in_progress', 'review', 'done']),
  priority: z.enum(['low', 'medium', 'high']),
  assignees: z.array(z.string()).min(1, 'At least one assignee is required'),
  dueDate: dateSchema.optional(),
  estimatedHours: z
    .number()
    .min(0, 'Estimated hours must be positive')
    .max(100, 'Estimated hours must be less than 100')
    .optional(),
});

export const resourceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['file', 'link', 'document']),
  category: z.enum(['design', 'development', 'marketing', 'other']),
  url: urlSchema,
  projectId: z.string().optional(),
  teamId: z.string().optional(),
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 50000000, 'File size must be less than 50MB')
    .optional(),
});

// Error handling
export function getValidationError(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.errors[0]?.message || 'Validation error';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
} 