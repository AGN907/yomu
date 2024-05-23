import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@yomu/ui/components/card'

type StatCardProps = {
  label: string
  value: number
  icon: React.ReactNode
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <span className="text-2xl font-bold">{value}</span>
      </CardContent>
    </Card>
  )
}

export { StatCard }
