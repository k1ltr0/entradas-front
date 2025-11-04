/**
 * JSON Parser Utilities
 * Handles parsing and validation of JSON configurations
 */

import { PageConfig, PageData, SectionProps, Template } from '../types';

export class JsonParser {
  /**
   * Parse and validate page configuration
   */
  static parsePageConfig(json: string): PageConfig {
    try {
      const data = JSON.parse(json);
      this.validatePageConfig(data);
      return data as PageConfig;
    } catch (error) {
      throw new Error(`Invalid page configuration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse and validate page data
   */
  static parsePageData(json: string): PageData {
    try {
      const data = JSON.parse(json);
      this.validatePageData(data);
      return data as PageData;
    } catch (error) {
      throw new Error(`Invalid page data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse and validate template
   */
  static parseTemplate(json: string): Template {
    try {
      const data = JSON.parse(json);
      this.validateTemplate(data);
      return data as Template;
    } catch (error) {
      throw new Error(`Invalid template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate page configuration structure
   */
  private static validatePageConfig(data: any): void {
    if (!data.id || typeof data.id !== 'string') {
      throw new Error('Page config must have a valid id');
    }
    if (!data.name || typeof data.name !== 'string') {
      throw new Error('Page config must have a valid name');
    }
    if (!data.metadata || typeof data.metadata !== 'object') {
      throw new Error('Page config must have valid metadata');
    }
    if (!Array.isArray(data.sections)) {
      throw new Error('Page config must have a sections array');
    }
  }

  /**
   * Validate page data structure
   */
  private static validatePageData(data: any): void {
    if (!data.pageId || typeof data.pageId !== 'string') {
      throw new Error('Page data must have a valid pageId');
    }
    if (!data.metadata || typeof data.metadata !== 'object') {
      throw new Error('Page data must have valid metadata');
    }
    if (!data.sectionData || typeof data.sectionData !== 'object') {
      throw new Error('Page data must have valid sectionData');
    }
  }

  /**
   * Validate template structure
   */
  private static validateTemplate(data: any): void {
    if (!data.id || typeof data.id !== 'string') {
      throw new Error('Template must have a valid id');
    }
    if (!data.name || typeof data.name !== 'string') {
      throw new Error('Template must have a valid name');
    }
    if (!Array.isArray(data.sections)) {
      throw new Error('Template must have a sections array');
    }
  }

  /**
   * Merge template with data to create a complete page config
   */
  static mergeTemplateWithData(template: Template, data: PageData): PageConfig {
    const sections: SectionProps[] = template.sections.map((sectionConfig) => {
      const sectionData = data.sectionData[sectionConfig.id] || template.defaultData[sectionConfig.id] || {};

      return {
        id: sectionConfig.id,
        type: sectionConfig.type,
        order: sectionConfig.order,
        data: { ...sectionData }
      } as SectionProps;
    });

    return {
      id: data.pageId,
      name: template.name,
      metadata: { ...template.metadata, ...data.metadata },
      sections: sections.sort((a, b) => a.order - b.order),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Export page config as JSON string
   */
  static exportPageConfig(pageConfig: PageConfig): string {
    return JSON.stringify(pageConfig, null, 2);
  }

  /**
   * Export page data as JSON string
   */
  static exportPageData(pageConfig: PageConfig): string {
    const pageData: PageData = {
      pageId: pageConfig.id,
      metadata: pageConfig.metadata,
      sectionData: pageConfig.sections.reduce((acc, section) => {
        acc[section.id] = section.data;
        return acc;
      }, {} as Record<string, any>)
    };

    return JSON.stringify(pageData, null, 2);
  }

  /**
   * Generate HTML from page config
   */
  static exportToHTML(pageConfig: PageConfig): string {
    const { metadata, sections } = pageConfig;

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metadata.title}</title>
  ${metadata.description ? `<meta name="description" content="${metadata.description}">` : ''}
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: ${metadata.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'};
      line-height: 1.6;
      color: #333;
    }
    /* Add section styles here */
  </style>
</head>
<body>
  ${sections.map(section => `
    <!-- ${section.type} section -->
    <section id="${section.id}" class="${section.type}-section">
      <!-- Section content would be rendered here -->
    </section>
  `).join('\n')}
</body>
</html>`;

    return html;
  }
}

export default JsonParser;
