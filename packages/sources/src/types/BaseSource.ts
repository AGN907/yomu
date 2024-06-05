/* eslint-disable @typescript-eslint/no-unused-vars */
import ky from 'ky'
import {
  ChapterItemContent,
  ChapterItemWithoutContent,
  Source,
  SourceNovelFetchResponse,
  SourceNovelsFetchResponse,
} from './'

export abstract class BaseSource implements Source {
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

  fetchedNovelSelector(): string {
    throw new Error('Method not implemented.')
  }
  searchedNovelSelector(): string {
    throw new Error('Method not implemented.')
  }
  chapterSelector(): string {
    throw new Error('Method not implemented.')
  }

  fetchedNovelCountSelector(): string {
    throw new Error('Method not implemented.')
  }
  searchedNovelCountSelector(): string {
    throw new Error('Method not implemented.')
  }

  async fetchNovels(
    page: number,
    showLatest = false,
  ): Promise<SourceNovelsFetchResponse> {
    throw new Error('Method not implemented.')
  }

  async searchNovels(
    page: number,
    query: string,
  ): Promise<SourceNovelsFetchResponse> {
    throw new Error('Method not implemented.')
  }

  async fetchNovel(url: string): Promise<SourceNovelFetchResponse> {
    throw new Error('Method not implemented.')
  }

  async fetchNovelChapters(
    url: string,
    novelId: string,
  ): Promise<ChapterItemWithoutContent[]> {
    throw new Error('Method not implemented.')
  }

  async fetchChapterContent(url: string): Promise<ChapterItemContent | null> {
    throw new Error('Method not implemented.')
  }
}
