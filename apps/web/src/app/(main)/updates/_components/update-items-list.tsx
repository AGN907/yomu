'use client'

import { UpdateItemCard } from './update-item-card'

import { toCalendar } from '@yomu/core/utils/dates'
import type { UpdateItem } from '@yomu/sources/types'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@yomu/ui/components/accordion'

import Image from 'next/image'
import Link from 'next/link'

type GroupedItem = { title: string; chapters: UpdateItem[] }

type UpdatesListProps = {
  items: GroupedItem[]
  listName: string
}

function UpdatesList({ items, listName }: UpdatesListProps) {
  const sectionName = toCalendar(listName)

  return (
    <div>
      <h3 className="mb-4 text-lg font-medium">{sectionName}</h3>
      <div>
        <Accordion type="single" collapsible>
          {items.map((item) => renderNovelUpdates(item))}
        </Accordion>
      </div>
    </div>
  )
}

const renderNovelUpdates = ({ title, chapters }: GroupedItem) => {
  const novelSlug = chapters[0].novelSlug
  const novelId = chapters[0].novelId
  const thumbnail = chapters[0].novelThumbnail

  const totalChapters = chapters.length

  return (
    <AccordionItem key={novelId} value={title}>
      <AccordionTrigger className="grid grid-cols-[50px_1fr_40px] gap-4">
        <Link href={`/novels/${novelId}/${novelSlug}`}>
          <Image
            className="rounded"
            src={thumbnail}
            alt={title}
            width={50}
            height={80}
          />
        </Link>
        <div className="flex min-w-0 flex-col gap-4 text-left">
          <p className="truncate">{title}</p>
          <span className="text-muted-foreground text-sm font-normal">
            {totalChapters} updates
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="divide-border divide-y">
        {chapters.map((chapter) => (
          <UpdateItemCard key={chapter.id} item={chapter} />
        ))}
      </AccordionContent>
    </AccordionItem>
  )
}

export { UpdatesList }
