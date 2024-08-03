import { BaseSource, NovelItemData, NovelStatus } from '../../types'

import { parseReleaseDate } from '@yomu/core/date-helpers'

import * as cheerio from 'cheerio'

export class MadaraSource extends BaseSource {
  constructor(id: string, name: string, baseUrl: string, lang: string) {
    super(id, name, baseUrl, lang)
  }

  protected useNewEndpoint = true

  protected novelsSubString = 'novel'
  protected novelSubString = 'novel'
  protected chapterSubString = 'novel'

  fetchedNovelSelector() {
    return '.page-item-detail'
  }

  searchedNovelSelector() {
    return '.c-tabs-item__content'
  }

  chapterSelector() {
    return '.wp-manga-chapter'
  }

  fetchedNovelCountSelector() {
    return 'div.c-page__content .h4'
  }
  searchedNovelCountSelector() {
    return 'div.c-blog__heading h1.h4'
  }

  async fetchNovels(page: number, showLatest?: boolean) {
    const sortOrder = showLatest ? '?m_orderby=latest' : '?m_orderby=trending'
    const url = `${this.novelsSubString}/page/${page}${sortOrder}`

    try {
      const body = await this.httpClient.get(url).text()

      const doc = cheerio.load(body)

      const novels = doc(this.fetchedNovelSelector())
        .toArray()
        .map((el) => {
          const title = doc(el).find('.post-title > h3 > a').text().trim()
          const url = doc(el)
            .find('.post-title > h3 > a')
            .attr('href')
            ?.split('/')[4] as string

          const image = doc(el).find('img')
          const thumbnail = image.attr('data-src') || image.attr('src') || ''

          return {
            title,
            thumbnail: this.getHighQualtiyThumbnail(thumbnail),
            url,
            sourceId: this.id,
          }
        })

      const hasNextPage = !!doc('.nav-previous').html()

      return { novels, hasNextPage }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }

      return { novels: [], hasNextPage: false }
    }
  }

  async searchNovels(page: number, query: string) {
    const url = `${this.novelsSubString}/page/${page}/?s=${query}&post_type=wp-manga`

    try {
      const body = await this.httpClient.get(url).text()

      const doc = cheerio.load(body)

      const novels = doc(this.searchedNovelSelector())
        .toArray()
        .map((el) => {
          const title = doc(el).find('.post-title').text().trim()
          const url =
            this.extractPathname(doc(el).find('a').attr('href'))?.[1] || ''

          const image = doc(el).find('.tab-thumb img')
          const thumbnail = image.attr('data-src') || image.attr('src') || ''

          return {
            title,
            thumbnail,
            url,
            sourceId: this.id,
          }
        })

      const hasNextPage = !!doc('.nav-previous').html()

      return { novels, hasNextPage }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }

      return { novels: [], hasNextPage: false }
    }
  }

  async fetchNovel(url: string) {
    try {
      const body = await this.httpClient
        .get(`${this.novelSubString}/${url}`)
        .text()

      const doc = cheerio.load(body)

      const title = doc('.post-title h1').text().trim()
      const image = doc('.summary_image > a > img')
      const thumbnail =
        image.attr('data-lazy-src') ||
        image.attr('data-src') ||
        image.attr('src') ||
        ''

      doc('div.summary__content .code-block,script').remove()
      const summary = doc('div.summary__content').text().trim()

      const novelId =
        doc('rating-post-id').attr('value') ||
        doc('#manga-chapters-holder').attr('data-id')

      if (!novelId) throw new Error('Failed to extract novel id')

      const novel: NovelItemData = {
        title,
        author: 'Unknown',
        thumbnail: this.getHighQualtiyThumbnail(thumbnail),
        url,
        summary,
        genres: [],
        status: NovelStatus.UNKNOWN,
        sourceId: this.id,
      }

      doc('.post-content_item, .post-content').each(function () {
        const detailName = doc(this).find('h5').text().trim()
        const detail = doc(this).find('.summary-content').text().trim()

        switch (detailName) {
          case 'Genre(s)':
          case 'التصنيفات':
            novel.genres = detail.replace(/[\t\n]/g, ',').split(',')
            break
          case 'Author(s)':
          case 'المؤلف':
          case 'المؤلف (ين)':
            novel.author = detail.split(',')[0] || novel.author
            break
          case 'Status':
          case 'الحالة':
            novel.status =
              detail.includes('OnGoing') || detail.includes('مستمرة')
                ? NovelStatus.ONGOING
                : NovelStatus.COMPLETED
            break
        }
      })

      return novel
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
      return null
    }
  }

  async fetchNovelChapters(url: string, novelId: string) {
    try {
      const body = this.useNewEndpoint
        ? await this.httpClient
            .post(`${this.novelSubString}/${url}/ajax/chapters`)
            .text()
        : await this.httpClient
            .post('wp-admin/admin-ajax.php', {
              json: {
                action: 'manga_get_chapters',
                manga: novelId,
              },
            })
            .text()

      const doc = cheerio.load(body)

      const chapters = doc(this.chapterSelector())
        .toArray()
        .reverse()
        .map((el, index) => {
          const title = doc(el).find('a').text().trim()
          const url = this.extractPathname(doc(el).find('a').attr('href'))
            .slice(1, 3)
            .join('/')

          const releaseDate = doc(el)
            .find('.chapter-release-date')
            .text()
            .trim()

          const date = parseReleaseDate(releaseDate)

          return {
            title,
            url,
            releaseDate: date || new Date(),
            number: index + 1,
          }
        })

      return chapters
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
      return []
    }
  }

  async fetchChapterContent(url: string) {
    const chapterUrl = `${this.chapterSubString}/${url}`

    try {
      const body = await this.httpClient.get(chapterUrl).text()

      const doc = cheerio.load(body)

      if (doc('.text-right')) {
        doc('.text-right div').remove()
      } else if (doc('.text-left')) {
        doc('.text-left div').remove()
      } else if (doc('.entry-content')) {
        doc('.entry-content div').remove()
      }

      const content =
        doc('.text-left') || doc('.text-right') || doc('.entry-content')

      const contentLines: string[] = []
      content.find('p').each(function () {
        const line = doc(this).text().trim()

        contentLines.push(line)
      })

      if (content.length === 0)
        throw new Error('Could not extract chapter content')

      return {
        content: contentLines,
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
      return null
    }
  }

  getHighQualtiyThumbnail(image: string) {
    const regex = /((-\d{1,3}x\d{1,3})?(\.(jpg|png|jpeg)))/
    return image?.match(regex) ? image.replace(regex, '$3') : image
  }

  getOriginalNovelUrl(url: string) {
    return `${this.baseUrl}/${this.novelSubString}/${url}`
  }

  getOriginalChapterUrl(url: string): string {
    return `${this.baseUrl}/${this.chapterSubString}/${url}`
  }

  extractPathname(url: string | undefined) {
    if (!url) return []

    const { pathname } = new URL(url)
    return pathname.split('/').filter(Boolean)
  }
}
