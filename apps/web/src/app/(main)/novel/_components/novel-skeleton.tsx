import { Card, CardContent, CardFooter } from '@yomu/ui/components/card'
import { Skeleton } from '@yomu/ui/components/skeleton'

function NovelSkeleton() {
  return (
    <Card className="w-full">
      <CardContent className="bg-accent dark:bg-card flex flex-col gap-8 rounded-2xl border p-4 lg:flex-row">
        <div className="flex-shrink-0 self-center lg:self-start">
          <Skeleton className="h-[250px] w-[200px]" />
        </div>
        <div className="flex max-w-3xl flex-col gap-4">
          <Skeleton className="h-8 w-full" />
          <div className="flex gap-2">
            {Array(4)
              .fill(0)
              .map((_) => (
                <Skeleton key={_} className="h-4 w-20" />
              ))}
          </div>

          <div className="mt-auto">
            <div className="flex gap-2">
              {Array(3)
                .fill(0)
                .map((genre) => (
                  <Skeleton key={genre} className="h-6 w-20" />
                ))}
            </div>
          </div>
        </div>

        <div className="ml-auto flex gap-2">
          <Skeleton className="h-8 w-8" />
        </div>
      </CardContent>
      <CardFooter className="relative flex w-full flex-col-reverse gap-16 pt-8 xl:flex-row xl:items-start">
        <div className="w-full space-y-4">
          <Skeleton className="h-8 w-28" />
          <div className="w-full space-y-2 pt-10">
            {Array(6)
              .fill(0)
              .map((_) => (
                <Skeleton key={_} className="h-12" />
              ))}
          </div>
        </div>
        <div className="w-full space-y-4 xl:sticky xl:top-4 xl:max-w-md">
          <Skeleton className="h-8 w-28" />
          <div className="w-full space-y-2 pt-10">
            {Array(6)
              .fill(0)
              .map((_) => (
                <Skeleton key={_} className="h-3" />
              ))}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export { NovelSkeleton }
