import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { BuilderState, BuilderAction, PageConfig, SectionProps } from '../types';

const initialState: BuilderState = {
  page: null,
  selectedSectionId: null,
  isDirty: false,
  previewMode: false
};

function builderReducer(state: BuilderState, action: BuilderAction): BuilderState {
  switch (action.type) {
    case 'SET_PAGE':
      return {
        ...state,
        page: action.payload,
        isDirty: false
      };

    case 'ADD_SECTION': {
      if (!state.page) return state;
      const newSection: SectionProps = {
        ...action.payload,
        order: state.page.sections.length
      };
      return {
        ...state,
        page: {
          ...state.page,
          sections: [...state.page.sections, newSection]
        },
        isDirty: true
      };
    }

    case 'UPDATE_SECTION': {
      if (!state.page) return state;
      const { sectionId, updates } = action.payload;
      return {
        ...state,
        page: {
          ...state.page,
          sections: state.page.sections.map(section =>
            section.id === sectionId
              ? { ...section, ...updates }
              : section
          )
        },
        isDirty: true
      };
    }

    case 'DELETE_SECTION': {
      if (!state.page) return state;
      const sectionId = action.payload;
      return {
        ...state,
        page: {
          ...state.page,
          sections: state.page.sections
            .filter(section => section.id !== sectionId)
            .map((section, index) => ({ ...section, order: index }))
        },
        selectedSectionId: state.selectedSectionId === sectionId ? null : state.selectedSectionId,
        isDirty: true
      };
    }

    case 'REORDER_SECTIONS': {
      if (!state.page) return state;
      const { sourceIndex, destinationIndex } = action.payload;
      const sections = Array.from(state.page.sections);
      const [removed] = sections.splice(sourceIndex, 1);
      sections.splice(destinationIndex, 0, removed);

      return {
        ...state,
        page: {
          ...state.page,
          sections: sections.map((section, index) => ({ ...section, order: index }))
        },
        isDirty: true
      };
    }

    case 'SELECT_SECTION':
      return {
        ...state,
        selectedSectionId: action.payload
      };

    case 'UPDATE_METADATA': {
      if (!state.page) return state;
      return {
        ...state,
        page: {
          ...state.page,
          metadata: {
            ...state.page.metadata,
            ...action.payload
          }
        },
        isDirty: true
      };
    }

    case 'SET_PREVIEW_MODE':
      return {
        ...state,
        previewMode: action.payload
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

interface BuilderContextType {
  state: BuilderState;
  dispatch: React.Dispatch<BuilderAction>;
  setPage: (page: PageConfig) => void;
  addSection: (section: SectionProps) => void;
  updateSection: (sectionId: string, updates: Partial<SectionProps>) => void;
  deleteSection: (sectionId: string) => void;
  reorderSections: (sourceIndex: number, destinationIndex: number) => void;
  selectSection: (sectionId: string | null) => void;
  updateMetadata: (metadata: Partial<PageConfig['metadata']>) => void;
  setPreviewMode: (enabled: boolean) => void;
  reset: () => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export const BuilderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(builderReducer, initialState);

  const setPage = (page: PageConfig) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  };

  const addSection = (section: SectionProps) => {
    dispatch({ type: 'ADD_SECTION', payload: section });
  };

  const updateSection = (sectionId: string, updates: Partial<SectionProps>) => {
    dispatch({ type: 'UPDATE_SECTION', payload: { sectionId, updates } });
  };

  const deleteSection = (sectionId: string) => {
    dispatch({ type: 'DELETE_SECTION', payload: sectionId });
  };

  const reorderSections = (sourceIndex: number, destinationIndex: number) => {
    dispatch({ type: 'REORDER_SECTIONS', payload: { sourceIndex, destinationIndex } });
  };

  const selectSection = (sectionId: string | null) => {
    dispatch({ type: 'SELECT_SECTION', payload: sectionId });
  };

  const updateMetadata = (metadata: Partial<PageConfig['metadata']>) => {
    dispatch({ type: 'UPDATE_METADATA', payload: metadata });
  };

  const setPreviewMode = (enabled: boolean) => {
    dispatch({ type: 'SET_PREVIEW_MODE', payload: enabled });
  };

  const reset = () => {
    dispatch({ type: 'RESET' });
  };

  return (
    <BuilderContext.Provider
      value={{
        state,
        dispatch,
        setPage,
        addSection,
        updateSection,
        deleteSection,
        reorderSections,
        selectSection,
        updateMetadata,
        setPreviewMode,
        reset
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error('useBuilder must be used within BuilderProvider');
  }
  return context;
};
