export * from './BaseSource'

export interface NovelItem {
  title: string
  url: string
  thumbnail: string
  genres: string[]
  summary?: string
  author?: string
  status: NovelStatus
  sourceId: string
}

export interface NovelItemData extends NovelItem {
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

export interface ChapterItemWithContent
  extends Omit<ChapterItemWithoutContent, 'releaseDate'> {
  content: string
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

export interface SourceNovelFetchResponse {
  novel: NovelItemData | null
  chapters: ChapterItemWithoutContent[]
}

export interface SourceInfo {
  id: string
  name: string
  baseUrl: string
  icon: string
  lang: string
}

export interface Source {
  fetchNovels: (
    page: number,
    showLatest?: boolean,
  ) => Promise<SourceNovelsFetchResponse>
  searchNovels: (
    page: number,
    query: string,
  ) => Promise<SourceNovelsFetchResponse>
  fetchNovel: (url: string) => Promise<SourceNovelFetchResponse>

  fetchChapter: (url: string) => Promise<ChapterItemWithContent | null>
}
