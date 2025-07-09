import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { languageOptions } from '@/i18n';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // Store the selected language preference
    localStorage.setItem('i18nextLng', lng);
  };

  const currentLanguage = languageOptions.find(
    (lang) => lang.code === i18n.language
  ) || languageOptions[0];

  return (
    <>
      {/* Desktop version */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden sm:flex"
            title="Change Language"
          >
            <Globe className="h-[18px] w-[18px]" />
            <span className="sr-only">Language</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Select Language</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {languageOptions.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className={`flex items-center gap-2 cursor-pointer ${
                i18n.language === language.code ? 'bg-muted' : ''
              }`}
            >
              <span className="text-sm">{language.name}</span>
              {language.nativeName !== language.name && (
                <span className="text-xs text-muted-foreground">
                  ({language.nativeName})
                </span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Mobile version */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="sm:hidden"
            title="Change Language"
          >
            <Globe className="h-[18px] w-[18px]" />
            <span className="sr-only">Language</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Select Language</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {languageOptions.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className={`flex items-center gap-2 cursor-pointer ${
                i18n.language === language.code ? 'bg-muted' : ''
              }`}
            >
              <span className="text-sm">{language.name}</span>
              {language.nativeName !== language.name && (
                <span className="text-xs text-muted-foreground">
                  ({language.nativeName})
                </span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default LanguageSelector;