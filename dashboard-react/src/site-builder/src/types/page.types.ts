/**
 * Page Types for Site Builder
 * Defines page configuration and metadata
 */

import { SectionProps } from './section.types';

export interface PageMetadata {
  title: string;
  description?: string;
  favicon?: string;
  theme?: 'light' | 'dark' | 'auto';
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
}

export interface PageConfig {
  id: string;
  name: string;
  metadata: PageMetadata;
  sections: SectionProps[];
  createdAt: string;
  updatedAt: string;
}

export interface PageData {
  pageId: string;
  metadata: PageMetadata;
  sectionData: {
    [sectionId: string]: any;
  };
}
