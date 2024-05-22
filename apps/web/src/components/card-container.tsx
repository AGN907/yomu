import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@yomu/ui/components/card'

type CardContainerProps = {
  title?: React.ReactNode
  description?: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>

function CardContainer(props: CardContainerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>{props.description}</CardDescription>
      </CardHeader>
      <CardContent>{props.children}</CardContent>
      <CardFooter>{props.footer}</CardFooter>
    </Card>
  )
}

export { CardContainer }
