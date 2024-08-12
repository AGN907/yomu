'use client'

import { capitalize } from '@yomu/core/utils/string'

import { useTheme } from 'next-themes'
import { useMemo } from 'react'
import { Cell, Pie, PieChart } from 'recharts'

const COLORS = ['#2B94D0', '#154A68', '#91BAEA', '#ADCAED', '#CFE4F1']

type GenreGraphProps = {
  data: {
    name: string
    value: number
  }[]
}

function GenresGraph({ data }: GenreGraphProps) {
  const memoizedData = useMemo(() => data, [data])
  const { theme, systemTheme } = useTheme()

  const currentTheme = theme === 'system' ? systemTheme : theme

  return (
    <div>
      {memoizedData.length <= 3 ? (
        <div className="flex flex-col">
          <p className="text-muted-foreground text-center">
            We would need more data to show you some cool graphs
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <PieChart width={140} height={140}>
            <Pie
              data={memoizedData}
              dataKey={'value'}
              innerRadius={50}
              outerRadius={60}
              paddingAngle={0}
              cx={'50%'}
              stroke={currentTheme === 'dark' ? '#262626' : '#E5E5E5'}
            >
              {memoizedData.map((entry, index) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
          <div className="flex flex-wrap gap-x-6 gap-y-4 pt-6">
            {memoizedData.map((genre, index) => (
              <div className="flex items-center gap-2" key={genre.name}>
                <div
                  className="size-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <p>{capitalize(genre.name)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export { GenresGraph }
