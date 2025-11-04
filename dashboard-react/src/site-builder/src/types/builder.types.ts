/**
 * Builder Types for Site Builder
 * Defines builder state and actions
 */

import { PageConfig, PageMetadata } from './page.types';
import { SectionProps } from './section.types';

export interface BuilderState {
  page: PageConfig | null;
  selectedSectionId: string | null;
  isDirty: boolean;
  previewMode: boolean;
}

export interface BuilderAction {
  type: 'SET_PAGE' | 'ADD_SECTION' | 'UPDATE_SECTION' | 'DELETE_SECTION' |
        'REORDER_SECTIONS' | 'SELECT_SECTION' | 'UPDATE_METADATA' |
        'SET_PREVIEW_MODE' | 'TOGGLE_SECTION_VISIBILITY' | 'RESET';
  payload?: any;
}

export interface DragItem {
  id: string;
  type: string;
  index?: number;
}

export interface DropResult {
  id: string;
  index: number;
}
