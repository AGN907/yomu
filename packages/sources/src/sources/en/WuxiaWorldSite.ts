import { MadaraSource } from '@sources/multiSrc/Madara/MadaraSource'

export class WuxiaWorldSite extends MadaraSource {
  constructor() {
    super(
      'WuxiaWorldSite',
      'Wuxia World Site',
      'https://wuxiaworldsite.com',
      'EN',
    )
  }
}
