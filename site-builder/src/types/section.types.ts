/**
 * Section Types for Site Builder
 * Defines all available section types and their properties
 */

export type SectionType =
  | 'hero'
  | 'pricing'
  | 'gallery'
  | 'about'
  | 'schedule'
  | 'contact';

export interface BaseSectionProps {
  id: string;
  type: SectionType;
  order: number;
}

export interface HeroSectionProps extends BaseSectionProps {
  type: 'hero';
  data: {
    title: string;
    subtitle?: string;
    backgroundImage?: string;
    ctaText?: string;
    ctaLink?: string;
    layout?: 'centered' | 'left' | 'right';
    overlay?: boolean;
  };
}

export interface PricingSectionProps extends BaseSectionProps {
  type: 'pricing';
  data: {
    title: string;
    description?: string;
    tickets: Array<{
      id: string;
      name: string;
      price: number;
      currency: string;
      description?: string;
      features?: string[];
      available: boolean;
    }>;
    columns?: 2 | 3 | 4;
  };
}

export interface GallerySectionProps extends BaseSectionProps {
  type: 'gallery';
  data: {
    title?: string;
    images: Array<{
      id: string;
      url: string;
      alt: string;
      caption?: string;
    }>;
    layout?: 'grid' | 'masonry' | 'carousel';
    columns?: 2 | 3 | 4;
  };
}

export interface AboutSectionProps extends BaseSectionProps {
  type: 'about';
  data: {
    title: string;
    content: string;
    image?: string;
    imagePosition?: 'left' | 'right';
  };
}

export interface ScheduleSectionProps extends BaseSectionProps {
  type: 'schedule';
  data: {
    title: string;
    events: Array<{
      id: string;
      time: string;
      title: string;
      description?: string;
      speaker?: string;
      location?: string;
    }>;
    layout?: 'timeline' | 'list';
  };
}

export interface ContactSectionProps extends BaseSectionProps {
  type: 'contact';
  data: {
    title: string;
    email?: string;
    phone?: string;
    address?: string;
    mapUrl?: string;
    socialLinks?: Array<{
      platform: string;
      url: string;
    }>;
  };
}

export type SectionProps =
  | HeroSectionProps
  | PricingSectionProps
  | GallerySectionProps
  | AboutSectionProps
  | ScheduleSectionProps
  | ContactSectionProps;

export interface SectionDefinition {
  type: SectionType;
  name: string;
  description: string;
  icon: string;
  defaultData: any;
}
