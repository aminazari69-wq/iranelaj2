import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string, locale: string = 'en') {
  const d = new Date(date)
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : locale === 'fa' ? 'fa-IR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(d)
}

export function formatWhatsAppNumber(number: string): string {
  return number.replace(/[^0-9+]/g, '')
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function isRTL(locale: string): boolean {
  return ['ar', 'fa'].includes(locale)
}

export function getDirection(locale: string): 'rtl' | 'ltr' {
  return isRTL(locale) ? 'rtl' : 'ltr'
}

export const specialties = [
  { id: 'cosmetic', nameAr: 'جراحی زیبایی', nameFa: 'جراحی زیبایی', nameEn: 'Cosmetic Surgery' },
  { id: 'cardiology', nameAr: 'قلب و عروق', nameFa: 'قلب و عروق', nameEn: 'Cardiology' },
  { id: 'orthopedics', nameAr: 'ارتوپدی', nameFa: 'ارتوپدی', nameEn: 'Orthopedics' },
  { id: 'dentistry', nameAr: 'دندان‌پزشکی', nameFa: 'دندان‌پزشکی', nameEn: 'Dentistry' },
  { id: 'ophthalmology', nameAr: 'چشم پزشکی', nameFa: 'چشم پزشکی', nameEn: 'Eye Surgery' },
  { id: 'other', nameAr: 'سایر تخصص‌ها', nameFa: 'سایر تخصص‌ها', nameEn: 'Other Specialties' },
]

export const requestStatuses = {
  new: { ar: 'جدید', fa: 'جدید', en: 'New', color: 'blue' },
  under_review: { ar: 'قید بررسی', fa: 'در حال بررسی', en: 'Under Review', color: 'yellow' },
  need_documents: { ar: 'نیاز به مدارک', fa: 'نیاز به مدارک', en: 'Need Documents', color: 'orange' },
  approved: { ar: 'تایید شده', fa: 'تایید شده', en: 'Approved', color: 'green' },
  rejected: { ar: 'رد شده', fa: 'رد شده', en: 'Rejected', color: 'red' },
  travel_planning: { ar: 'برنامه‌ریزی سفر', fa: 'برنامه‌ریزی سفر', en: 'Travel Planning', color: 'purple' },
  completed: { ar: 'تکمیل شده', fa: 'تکمیل شده', en: 'Completed', color: 'gray' },
}
