'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react'; // Ikonka uchun (npm install lucide-react)

// Tillar ro'yxati
const locales = [
  { code: 'uz', label: 'O‘zbekcha' },
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations(); // Tarjimalarni qo‘llab-quvvatlash uchun
  const [isOpen, setIsOpen] = useState(false); // Dropdown holati
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Hozirgi tilni topish
  const currentLocale = locales.find((l) => l.code === locale) || locales[0];

  // Dropdown ni ochish/yopish
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Tilni o‘zgartirish
  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === locale) {
      setIsOpen(false);
      return;
    }

    // URL ni yangilash
    const segments = pathname.split('/');
    if (locales.some((l) => l.code === segments[1])) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }

    const newPath = segments.join('/') || '/';
    router.push(newPath);
    setIsOpen(false);
  };

  // Dropdown ni tashqaridan bosganda yopish
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative block w-full text-left" ref={dropdownRef}>
      {/* Dropdown tugmasi */}
      <button
        onClick={toggleDropdown}
        className="flex items-center w-full justify-between gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
      >
        <span>{currentLocale.label}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {/* Dropdown menyusi */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="py-1">
            {locales.map((l) => (
              <button
                key={l.code}
                onClick={() => handleLocaleChange(l.code)}
                className={`w-full text-left px-4 py-2 text-sm ${
                  l.code === locale
                    ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                } transition-colors duration-150`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}