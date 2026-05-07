import { z } from 'zod';

/**
 * Chat Mesaj Şeması
 * Discriminated Union kullanılarak farklı mesaj tipleri güvenli hale getirilmiştir.
 */
export const MessageSchema = z.discriminatedUnion('role', [
  z.object({
    role: z.literal('user'),
    content: z.string().min(1, 'Mesaj boş olamaz'),
    timestamp: z.date(),
  }),
  z.object({
    role: z.literal('assistant'),
    content: z.string(),
    timestamp: z.date(),
    metadata: z.object({
      confidence: z.number().optional(),
      sources: z.array(z.string()).optional(),
    }).optional(),
  }),
  z.object({
    role: z.literal('system'),
    content: z.string(),
    timestamp: z.date(),
  }),
]);

export type Message = z.infer<typeof MessageSchema>;

/**
 * Kullanıcı Profil Şeması
 */
export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  email: z.string().email('Geçersiz e-posta adresi'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  preferences: z.object({
    notifications: z.boolean().default(true),
    theme: z.enum(['dark', 'light']).default('dark'),
  }),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;
