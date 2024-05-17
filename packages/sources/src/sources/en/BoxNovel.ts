import { MadaraSource } from '@sources/multiSrc/Madara/MadaraSource'

export class BoxNovel extends MadaraSource {
  constructor() {
    super('BoxNovel', 'Box Novel', 'https://boxnovel.com', 'EN')
  }
}
