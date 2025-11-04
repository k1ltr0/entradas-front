# Site Builder i18n Implementation Plan

## Overview
This document outlines the implementation of internationalization (i18n) for the Site Builder, supporting English and Spanish languages.

## Date
2025-11-04

## Implementation Summary

### 1. Technologies Used
- **react-i18next**: React integration for i18next
- **i18next**: Core internationalization framework
- Languages supported: English (en) and Spanish (es)

### 2. Files Created

#### Configuration
- `/dashboard-react/src/site-builder/src/i18n/config.ts` - i18n configuration and initialization
- `/dashboard-react/src/site-builder/src/i18n/locales/es.json` - Spanish translations (~200+ strings)
- `/dashboard-react/src/site-builder/src/i18n/locales/en.json` - English translations (~200+ strings)

#### Components
- `/dashboard-react/src/site-builder/src/components/LanguageSwitcher/LanguageSwitcher.tsx` - Language switcher component
- `/dashboard-react/src/site-builder/src/components/LanguageSwitcher/LanguageSwitcher.css` - Styles for language switcher
- `/dashboard-react/src/site-builder/src/components/LanguageSwitcher/index.ts` - Export file

### 3. Files Modified

#### Main Components
1. **SiteBuilder.tsx** - Added i18n initialization import
2. **BuilderTopBar.tsx** - Integrated translations and language switcher
3. **BuilderSidebar.tsx** - Integrated translations for sidebar UI
4. **BuilderCanvas.tsx** - Integrated translations for canvas messages
5. **TemplateGallery.tsx** - Integrated translations for template selection

#### Section Components
6. **PricingSection.tsx** - Translated button labels (Buy/Sold Out)
7. **ScheduleSection.tsx** - Translated speaker and location labels
8. **ContactSection.tsx** - Translated contact field labels

### 4. Translation Structure

#### Translation Keys Organization
```
{
  "builder": {}, // Top bar UI elements
  "sidebar": {}, // Sidebar UI elements
  "canvas": {}, // Canvas messages
  "templates": {
    "categories": {}, // Template categories
    "basicEvent": {}, // Basic event template
    "conference": {}, // Conference template
    "concert": {} // Concert template
  },
  "sections": {
    "hero": {}, // Hero section defaults
    "pricing": {}, // Pricing section UI
    "gallery": {}, // Gallery section defaults
    "about": {}, // About section defaults
    "schedule": {}, // Schedule section UI
    "contact": {} // Contact section UI
  },
  "templateContent": {
    "basicEvent": {}, // Full basic event content
    "conference": {}, // Full conference content
    "concert": {} // Full concert content
  }
}
```

### 5. Features Implemented

1. **Language Persistence**
   - Language preference saved to localStorage
   - Automatically loads saved preference on initialization
   - Default language: Spanish (es)

2. **Language Switcher**
   - Visual flag-based switcher (🇪🇸/🇺🇸)
   - Integrated into BuilderTopBar
   - Real-time language switching
   - Active state indication

3. **Translation Coverage**
   - All UI text in builder interface
   - All section component labels
   - All template metadata
   - Default content for sections
   - Complete template content (all 3 templates)

### 6. Translation Categories

#### UI Elements (~60 strings)
- Builder top bar buttons and labels
- Sidebar tabs and actions
- Canvas empty states
- Template gallery interface

#### Section Defaults (~30 strings)
- Default titles and descriptions for 6 section types
- Placeholder content

#### Template Content (~150+ strings)
- Basic Event template (full content)
- Conference template (full content including 8 schedule events)
- Concert template (full content including ticket types)

### 7. Usage Example

```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();

  return (
    <button>{t('builder.save')}</button>
  );
};
```

### 8. Language Switching

Users can switch languages via:
1. Language switcher in the top bar (ES/EN buttons)
2. Preference persists across sessions
3. Instant UI update without page reload

### 9. Future Enhancements

Potential improvements:
- Add more languages (French, German, etc.)
- Implement RTL support for Arabic/Hebrew
- Add date/time localization
- Currency formatting per locale
- Pluralization rules for dynamic content

### 10. Testing Checklist

- [x] All UI elements translate properly
- [x] Language switcher works
- [x] Language preference persists
- [x] Default content in sections uses translations
- [x] Template content translates correctly
- [x] No missing translation keys (fallbacks work)

## Architecture Decisions

### Why react-i18next?
- Industry standard for React i18n
- Excellent TypeScript support
- Lightweight and performant
- Great documentation
- Easy integration with existing React components

### Why JSON for translations?
- Easy to read and edit
- Can be managed by non-developers
- Supports nesting for organization
- Compatible with translation management tools

### Default Language: Spanish
- Original content was in Spanish
- Primary target audience
- English as fallback for missing keys

## Implementation Notes

1. **Component Pattern**: Added `useTranslation()` hook to each component
2. **Translation Keys**: Used dot notation for hierarchical organization
3. **Template Translations**: Full content translated, not just UI elements
4. **Performance**: Translations loaded synchronously (small size, no impact)
5. **Maintenance**: Centralized in JSON files, easy to update

## Installation

```bash
cd dashboard-react
npm install react-i18next i18next --legacy-peer-deps
```

## File Structure

```
dashboard-react/src/site-builder/src/
├── i18n/
│   ├── config.ts
│   └── locales/
│       ├── en.json
│       └── es.json
├── components/
│   ├── Builder/
│   │   ├── BuilderTopBar.tsx (modified)
│   │   ├── BuilderSidebar.tsx (modified)
│   │   └── BuilderCanvas.tsx (modified)
│   ├── Templates/
│   │   └── TemplateGallery.tsx (modified)
│   ├── Sections/
│   │   ├── PricingSection.tsx (modified)
│   │   ├── ScheduleSection.tsx (modified)
│   │   └── ContactSection.tsx (modified)
│   └── LanguageSwitcher/
│       ├── LanguageSwitcher.tsx (new)
│       ├── LanguageSwitcher.css (new)
│       └── index.ts (new)
└── SiteBuilder.tsx (modified)
```

## Success Metrics

- ✅ 100% of UI text is translatable
- ✅ 2 languages fully supported (English, Spanish)
- ✅ 200+ translation strings implemented
- ✅ Zero hardcoded user-facing strings remaining
- ✅ Language switcher integrated and functional
- ✅ Persistence working correctly

## Conclusion

The Site Builder now has full internationalization support for English and Spanish. All user-facing text is translatable, and users can seamlessly switch between languages with their preference saved across sessions. The implementation is scalable and can easily accommodate additional languages in the future.
