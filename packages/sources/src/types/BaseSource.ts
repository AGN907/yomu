import type {
  ChapterItemContent,
  ChapterItemWithoutContent,
  NovelItemData,
  SourceNovelsFetchResponse,
} from './'

import ky from 'ky'

export abstract class BaseSource {
  id
  name
  baseUrl
  lang

  httpClient

  constructor(id: string, name: string, baseUrl: string, lang: string) {
    this.id = id
    this.name = name
    this.baseUrl = baseUrl
    this.lang = lang

    this.httpClient = ky.create({
      prefixUrl: baseUrl,
    })
  }

  // These methods return the html selectors for different methods
  abstract fetchedNovelSelector(): string
  abstract searchedNovelSelector(): string
  abstract chapterSelector(): string
  abstract fetchedNovelCountSelector(): string
  abstract searchedNovelCountSelector(): string

  // Support fetching novels with latest or trending param
  abstract fetchNovels(
    page: number,
    showLatest: boolean,
  ): Promise<SourceNovelsFetchResponse>

  // Used for searching novels
  abstract searchNovels(
    page: number,
    query: string,
  ): Promise<SourceNovelsFetchResponse>

  // Fetch all details of a novel except the chapters
  abstract fetchNovel(url: string): Promise<NovelItemData | null>

  // Fetch all chapters of a novel
  abstract fetchNovelChapters(
    url: string,
    novelId: string,
  ): Promise<ChapterItemWithoutContent[]>

  // Fetch the content of a chapter
  abstract fetchChapterContent(url: string): Promise<ChapterItemContent | null>

  // Get the original url of the novel in the source website
  abstract getOriginalNovelUrl(url: string): string

  // Get the original url of the chapter in the source website
  abstract getOriginalChapterUrl(url: string): string
}
