/**
 * @bradtech-oss/hey-brad
 * Modaka Engine, OKF v0.1 Specification & Tenant Open Data Serving (xxx.brad.farm)
 */

export interface OkfDocument {
  type: 'specification' | 'guide' | 'observation' | 'recipe'
  title: string
  description: string
  tags: string[]
  timestamp: string
  content: string
}

export function parseOkfMarkdown(rawMarkdown: string): OkfDocument {
  return {
    type: 'guide',
    title: 'Sample OKF Document',
    description: 'Sample description',
    tags: ['sample'],
    timestamp: new Date().toISOString(),
    content: rawMarkdown
  }
}
