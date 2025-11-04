/**
 * Template Types for Site Builder
 * Defines template structure and configuration
 */

import { SectionType } from './section.types';
import { PageMetadata } from './page.types';

export interface TemplateSectionConfig {
  id: string;
  type: SectionType;
  order: number;
  props?: Record<string, any>;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  category: 'event' | 'conference' | 'concert' | 'custom';
  metadata: PageMetadata;
  sections: TemplateSectionConfig[];
  defaultData: {
    [sectionId: string]: any;
  };
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  templates: Template[];
}
