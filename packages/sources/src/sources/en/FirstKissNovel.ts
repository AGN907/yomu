import { MadaraSource } from '@sources/multiSrc/Madara/MadaraSource'

export class FirstKissNovel extends MadaraSource {
  constructor() {
    super(
      'FirstKissNovel',
      'First Kiss Novel',
      'https://1stkissnovel.org',
      'EN',
    )
  }
}
