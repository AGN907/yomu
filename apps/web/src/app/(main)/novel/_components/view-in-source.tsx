import { Button } from '@yomu/ui/components/button'
import { Globe } from '@yomu/ui/components/icons'

type ViewInSource = {
  url: string
}

function ViewInSource({ url }: ViewInSource) {
  return (
    <Button variant="outline" size="icon" asChild>
      <a className="hover:underline" target="_blank" href={url}>
        <Globe size={24} />
      </a>
    </Button>
  )
}

export { ViewInSource }
