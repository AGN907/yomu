import { sourceManager } from '@/lib/source-manager'

export function getSourceById(sourceId: string) {
  return sourceManager.getSource(sourceId)
}
