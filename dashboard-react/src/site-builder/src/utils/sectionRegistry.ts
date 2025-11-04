/**
 * Section Registry
 * Manages available sections and their configurations
 */

import { SectionDefinition, SectionType } from '../types';
import sectionRegistryData from '../data/sections/section-registry.json';

export class SectionRegistry {
  private static sections: Map<SectionType, SectionDefinition> = new Map();

  /**
   * Initialize the registry with section definitions
   */
  static initialize(): void {
    sectionRegistryData.sections.forEach((section) => {
      this.sections.set(section.type as SectionType, section as SectionDefinition);
    });
  }

  /**
   * Get all available sections
   */
  static getAllSections(): SectionDefinition[] {
    if (this.sections.size === 0) {
      this.initialize();
    }
    return Array.from(this.sections.values());
  }

  /**
   * Get a specific section by type
   */
  static getSection(type: SectionType): SectionDefinition | undefined {
    if (this.sections.size === 0) {
      this.initialize();
    }
    return this.sections.get(type);
  }

  /**
   * Get default data for a section type
   */
  static getDefaultData(type: SectionType): any {
    const section = this.getSection(type);
    return section ? { ...section.defaultData } : null;
  }

  /**
   * Create a new section instance with default data
   */
  static createSection(type: SectionType, id?: string): any {
    const defaultData = this.getDefaultData(type);
    if (!defaultData) {
      throw new Error(`Unknown section type: ${type}`);
    }

    return {
      id: id || `${type}-${Date.now()}`,
      type,
      order: 0,
      data: defaultData
    };
  }

  /**
   * Validate if a section type exists
   */
  static isValidSectionType(type: string): type is SectionType {
    if (this.sections.size === 0) {
      this.initialize();
    }
    return this.sections.has(type as SectionType);
  }
}

// Initialize on import
SectionRegistry.initialize();

export default SectionRegistry;
