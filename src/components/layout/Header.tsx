"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Menu, X, ChevronDown, Globe, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import LanguageSwitcher from './LanguageSwitcher'

interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

export default function Header({ locale }: { locale: string }) {
  const t = useTranslations('nav')
  const tAuth = useTranslations('auth')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const isRTL = locale === 'ar' || locale === 'fa'

  const navItems: NavItem[] = [
    { label: t('home'), href: '/' },
    {
      label: t('services'),
      href: '/services',
      children: [
        { label: t('cosmetic'), href: '/services/cosmetic' },
        { label: t('cardiology'), href: '/services/cardiology' },
        { label: t('orthopedics'), href: '/services/orthopedics' },
        { label: t('dentistry'), href: '/services/dentistry' },
        { label: t('ophthalmology'), href: '/services/ophthalmology' },
        { label: t('other'), href: '/services/other' },
      ],
    },
    {
      label: t('packages'),
      href: '/packages',
      children: [
        { label: t('treatmentPackages'), href: '/packages/treatment' },
        { label: t('travelPackages'), href: '/packages/travel' },
      ],
    },
    { label: t('doctors'), href: '/doctors' },
    { label: t('hospitals'), href: '/hospitals' },
    {
      label: t('specialServices'),
      href: '/special-services',
      children: [
        { label: t('onlineConsultation'), href: '/special-services/consultation' },
        { label: t('airportTransfer'), href: '/special-services/transfer' },
        { label: t('patientSupport'), href: '/special-services/support' },
      ],
    },
    {
      label: t('travelInfo'),
      href: '/travel-info',
      children: [
        { label: t('visaGuide'), href: '/travel-info/visa' },
        { label: t('flightInfo'), href: '/travel-info/flights' },
        { label: t('stayGuide'), href: '/travel-info/stay' },
      ],
    },
    { label: t('hotels'), href: '/hotels' },
    { label: t('contact'), href: '/contact' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-[#026D73] text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <a href="tel:+989120995507" className="hover:underline">
              📞 +98 912 099 5507
            </a>
            <a href="mailto:info@iranelaj.com" className="hover:underline hidden sm:inline">
              ✉️ info@iranelaj.com
            </a>
          </div>
          <LanguageSwitcher currentLocale={locale} />
        </div>
      </div>

      {/* Main navigation */}
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0099A8] to-[#026D73] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">IE</span>
            </div>
            <span className="text-xl font-bold text-[#026D73]">IranElaj</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.href}
                className="relative group"
                onMouseEnter={() => setActiveSubmenu(item.href)}
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#0099A8] flex items-center gap-1 transition-colors",
                    item.children && "cursor-pointer"
                  )}
                >
                  {item.label}
                  {item.children && <ChevronDown className="w-4 h-4" />}
                </Link>

                {/* Dropdown */}
                {item.children && activeSubmenu === item.href && (
                  <div className={cn(
                    "absolute top-full bg-white shadow-lg rounded-lg py-2 min-w-[200px] z-50 border",
                    isRTL ? "right-0" : "left-0"
                  )}>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#0099A8]/10 hover:text-[#0099A8] transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden lg:flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4 me-2" />
                {tAuth('login')}
              </Button>
            </Link>
            <Link href="/request">
              <Button size="sm">{tAuth('register')}</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            {navItems.map((item) => (
              <div key={item.href}>
                <div
                  className="flex items-center justify-between py-3 text-gray-700"
                  onClick={() => {
                    if (item.children) {
                      setActiveSubmenu(activeSubmenu === item.href ? null : item.href)
                    } else {
                      setMobileMenuOpen(false)
                    }
                  }}
                >
                  <Link href={item.href} className="flex-1">
                    {item.label}
                  </Link>
                  {item.children && (
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 transition-transform",
                        activeSubmenu === item.href && "rotate-180"
                      )}
                    />
                  )}
                </div>
                {item.children && activeSubmenu === item.href && (
                  <div className={cn("pb-2", isRTL ? "pr-4" : "pl-4")}>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block py-2 text-sm text-gray-600 hover:text-[#0099A8]"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex gap-2 mt-4 pt-4 border-t">
              <Link href="/login" className="flex-1">
                <Button variant="outline" className="w-full">
                  {tAuth('login')}
                </Button>
              </Link>
              <Link href="/request" className="flex-1">
                <Button className="w-full">{tAuth('register')}</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
