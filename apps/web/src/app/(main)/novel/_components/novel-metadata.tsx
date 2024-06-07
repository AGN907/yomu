import { BookOpen, Database, Info, User } from '@yomu/ui/components/icons'

type NovelMetadataProps = {
  author: string
  status: string
  sourceId: string
  totalChapters: number
}

function NovelMetadata(props: NovelMetadataProps) {
  const { author, status, sourceId, totalChapters } = props
  return (
    <div className="flex flex-col flex-wrap gap-2 lg:flex-row lg:items-center">
      <NovelMetadataItem value={author} Icon={User} />
      <NovelMetadataItem value={status} Icon={Info} />
      <NovelMetadataItem value={sourceId} Icon={Database} />
      <NovelMetadataItem
        value={`${totalChapters} chapter${totalChapters !== 1 ? 's' : ''}`}
        Icon={BookOpen}
      />
    </div>
  )
}

type NovelMetadataItemProps = {
  value: string
  Icon: JSX.ElementType
}

function NovelMetadataItem(props: NovelMetadataItemProps) {
  const { value, Icon } = props

  return (
    <div className="flex items-center gap-2 px-2 py-1">
      <Icon className="stroke-muted-foreground size-6" />
      <span>{value}</span>
    </div>
  )
}

export { NovelMetadata }
