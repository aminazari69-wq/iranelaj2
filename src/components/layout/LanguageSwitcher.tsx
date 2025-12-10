"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { Globe } from 'lucide-react'

const languages = [
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
]

export default function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const router = useRouter()

  const handleLanguageChange = (newLocale: string) => {
    // Set cookie and reload
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`
    router.refresh()
    window.location.reload()
  }

  const currentLang = languages.find(l => l.code === currentLocale) || languages[0]

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity">
        <Globe className="w-4 h-4" />
        <span>{currentLang.flag} {currentLang.name}</span>
      </button>
      <div className="absolute top-full end-0 mt-1 bg-white text-gray-800 rounded-lg shadow-lg py-1 min-w-[140px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`w-full px-4 py-2 text-start text-sm hover:bg-gray-100 flex items-center gap-2 ${
              currentLocale === lang.code ? 'bg-gray-50 text-[#0099A8]' : ''
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
