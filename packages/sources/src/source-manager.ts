import * as allSources from './sources'
import { Source, SourceInfo } from './types'

import sourcesData from './sources/sources.json'

type SourceClass = {
  new (): Source
}

export class SourceManager {
  sources: Map<string, SourceClass>

  constructor() {
    this.sources = new Map(Object.entries(allSources))
  }

  getSource(id: string) {
    const source = this.sources.get(id)

    if (!source) {
      throw new Error('Source not found')
    }

    return new source()
  }

  getAllSources() {
    return sourcesData as SourceInfo[]
  }
}
