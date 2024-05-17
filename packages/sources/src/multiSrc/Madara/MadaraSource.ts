import { parseReleaseDate } from '@yomu/core/date-helpers'

import * as cheerio from 'cheerio'
import {
  BaseSource,
  ChapterItemWithoutContent,
  NovelItem,
  NovelItemData,
  NovelStatus,
} from '../../types'

export class MadaraSource extends BaseSource {
  constructor(id: string, name: string, baseUrl: string, lang: string) {
    super(id, name, baseUrl, lang)
  }

  protected useNewEndpoint = true

  protected novelsSubString = 'novel'
  protected novelSubString = 'novel'
  protected chapterSubString = 'novel'

  override fetchedNovelSelector() {
    return '.page-item-detail'
  }

  override searchedNovelSelector() {
    return '.c-tabs-item__content'
  }

  override chapterSelector() {
    return '.wp-manga-chapter'
  }

  override fetchedNovelCountSelector() {
    return 'div.c-page__content .h4'
  }
  override searchedNovelCountSelector() {
    return 'div.c-blog__heading h1.h4'
  }

  override async fetchNovels(page: number, showLatest?: boolean) {
    const sortOrder = showLatest ? '?m_orderby=latest' : '?m_orderby=trending'
    const url = `${this.novelsSubString}/page/${page}${sortOrder}`

    try {
      const body = await this.httpClient.get(url).text()

      const doc = cheerio.load(body)
      const novels: NovelItem[] = []

      doc(this.fetchedNovelSelector()).each((_, el) => {
        const title: string = doc(el).find('.post-title > h3 > a').text().trim()

        const image = doc(el).find('img')
        const thumbnail = image.attr('data-src') || image.attr('src') || ''

        const url = doc(el)
          ?.find('.post-title')
          ?.find('a')
          ?.attr('href')
          ?.split('/')[4]

        novels.push({
          title,
          thumbnail: this.getHighQualtiyThumbnail(thumbnail),
          url: url || '',
          genres: [],
          status: NovelStatus.UNKNOWN,
        })
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

  override async searchNovels(page: number, query: string) {
    const url = `${this.novelsSubString}/page/${page}/?s=${query}&post_type=wp-manga`

    try {
      const body = await this.httpClient.get(url).text()

      const doc = cheerio.load(body)

      const novels: NovelItem[] = []

      doc(this.searchedNovelSelector()).each((index, el) => {
        const url =
          this.extractPathname(doc(el).find('a').attr('href'))?.[1] || ''

        const title = doc(el).find('.post-title').text().trim()
        const thumbnail =
          doc(el).find('.tab-thumb img').attr('data-src') ||
          doc(el).find('.tab-thumb img').attr('src') ||
          ''

        novels.push({
          title,
          thumbnail,
          url,
          genres: [],
          summary: '',
          author: 'Unknown',
          status: NovelStatus.UNKNOWN,
        })
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

  override async fetchNovel(url: string) {
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

      if (!novelId) throw new Error('Novel ID not found')

      const novel: NovelItemData = {
        title,
        author: 'Unknown',
        thumbnail: this.getHighQualtiyThumbnail(thumbnail),
        url,
        summary,
        genres: [],
        status: NovelStatus.UNKNOWN,
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

      const chapters = await this.fetchNovelChapters(url, novelId)

      return { novel, chapters }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
      return { novel: null, chapters: [] }
    }
  }

  override async fetchNovelChapters(url: string, novelId: string) {
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

      const chapters: ChapterItemWithoutContent[] = []

      doc(this.chapterSelector())
        .toArray()
        .reverse()
        .forEach((chapter, index) => {
          const url = this.extractPathname(doc(chapter).find('a').attr('href'))
            .slice(1, 3)
            .join('/')
          const title = doc(chapter).find('a').text().trim()
          const releaseDate = doc(chapter)
            .find('.chapter-release-date')
            .text()
            .trim()

          const date = parseReleaseDate(releaseDate)

          chapters.push({
            title,
            url,
            releaseDate: date || new Date(),
            number: index + 1,
          })
        })

      return chapters
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
      return []
    }
  }

  override async fetchChapter(url: string) {
    const chapterUrl = `${this.chapterSubString}/${url}`

    try {
      const body = await this.httpClient.get(chapterUrl).text()

      const doc = cheerio.load(body)

      const title =
        doc('.text-center').text().trim() ||
        doc('#chapter-heading').text().trim() ||
        doc('ol.breadcrumb .active').text().trim()

      if (doc('.text-right')) {
        doc('.text-right div').remove()
      } else if (doc('.text-left')) {
        doc('.text-left div').remove()
      } else if (doc('.entry-content')) {
        doc('.entry-content div').remove()
      }

      const content =
        doc('.text-left') ||
        doc('.text-right') ||
        doc('.entry-content') ||
        'No content was extracted from the website. Check if there is any content on the original website, and create an issue on the github page.'

      const contentLines: string[] = []
      content.find('p').each(function () {
        const line = doc(this).text().trim()

        contentLines.push(line)
      })

      const chapterNumber = title?.match(/(c|C)hapter?(\s|-)(\d+)/)?.[3]

      return {
        title,
        url,
        content: JSON.stringify(contentLines),
        number: parseInt(chapterNumber || '0'),
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

  extractPathname(url: string | undefined) {
    if (!url) return []

    const { pathname } = new URL(url)
    return pathname.split('/').filter(Boolean)
  }
}
