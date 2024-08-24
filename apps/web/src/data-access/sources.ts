import { sourceManager } from '@/lib/source-manager'

export function getSourceById(sourceId: string) {
  return sourceManager.getSource(sourceId)
}

export function getSourceNovel(sourceId: string, novelUrl: string) {}
