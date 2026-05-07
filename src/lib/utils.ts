import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// PREMIUM UI: Tailwind CSS sınıflarını koşullu olarak birleştirmek ve çakışmaları çözmek için yardımcı fonksiyon.
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
