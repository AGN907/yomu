export * from './BaseSource'

export interface NovelItem {
  title: string
  url: string
  thumbnail: string
  sourceId: string
}

export interface NovelItemData extends NovelItem {
  genres: string[]
  status: NovelStatus
  summary: string
  author: string
}

export enum NovelStatus {
  COMPLETED = 'Completed',
  ONGOING = 'Ongoing',
  UNKNOWN = 'Unknown',
}

export interface ChapterItemWithoutContent {
  title: string
  url: string
  number: number
  releaseDate: Date
}

export interface ChapterItemContent {
  content: string[]
}

export interface HistoryItem {
  id: number
  novelId: number
  chapterId: number
  novelTitle: string
  chapterTitle: string
  novelUrl: string
  chapterUrl: string
  chapterNumber: number
  novelThumbnail: string
  sourceId: string
}

export type UpdateItem = HistoryItem

export interface SourceNovelsFetchResponse {
  novels: NovelItem[]
  hasNextPage: boolean
}

export interface SourceInfo {
  id: string
  name: string
  baseUrl: string
  icon: string
  lang: string
}
