import { Heading, Text } from '@chakra-ui/react'
import classNames from 'classnames'
import { type FC, useState } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, type TooltipProps, XAxis, YAxis } from 'recharts'

import { formatDate } from '@/utils/date.utils'

import fakeChartData from './fakedata.json'

interface GraphDataPoint {
  time: number
  date: string
  value: number
}

interface GraphTooltipProps extends TooltipProps<number, string> {
  section: graphSections
}

const GraphTooltip: FC<GraphTooltipProps> = ({ payload, section }) => {
  if (payload == null) return null
  if (payload.length !== 1) return null

  const graphPoint = payload[0]
  const point = graphPoint.payload as GraphDataPoint

  // FIXME: formatting is subject to the type of value, refer to 'section'
  const valueString = `${(graphPoint.value as number).toFixed(2)} %`

  return (
    <div className="flex flex-col px-6 py-4 border rounded-xl border-1 border-secondary-100 bg-primary-200">
      <div className="flex flex-row items-center gap-2">
        <Text textStyle="sm">Date:</Text>
        <Text textStyle="slender-sm2">{point.date}</Text>
      </div>
      <div className="flex flex-row items-center gap-2">
        <Text textStyle="sm">{section}:</Text>
        <Text textStyle="slender-sm2">{valueString}</Text>
      </div>
    </div>
  )
}

const graphData = fakeChartData.map<GraphDataPoint>(({ t, v }) => ({
  date: formatDate(new Date(t * 1000)),
  value: v * 100,
  time: t,
}))

type graphWindows = '3m' | '1m' | '1w'
type graphSections = 'TVL' | 'Price' | 'APY'

export const Graph = () => {
  const [graphWindow, setGraphWindow] = useState<graphWindows>('3m')
  const [graphSection, setGraphSection] = useState<graphSections>('APY')

  const windowClassnames = 'px-3 py-2 rounded-xl cursor-pointer'
  const windowChoices: graphWindows[] = ['3m', '1m', '1w']

  const sectionClassnames = 'px-3 py-1 rounded-xl cursor-pointer'
  const sectionChoices: graphSections[] = ['TVL', 'Price', 'APY']

  return (
    <div className="p-5 rounded-xl bg-primary-100">
      <div className="flex flex-row items-center justify-between gap-4">
        <Heading size="h2">Historical Rate</Heading>
        <div className="flex flex-row gap-4 py-1 overflow-hidden rounded-xl bg-primary-200">
          {windowChoices.map((choice) => (
            <div
              className={classNames(windowClassnames, { 'bg-primary-300': graphWindow === choice })}
              onClick={() => setGraphWindow(choice)}
              key={choice}
            >
              {choice}
            </div>
          ))}
        </div>
        <div className="flex flex-row gap-4 py-2 overflow-hidden rounded-xl bg-primary-200">
          {sectionChoices.map((choice) => (
            <div
              className={classNames(sectionClassnames, { 'bg-primary-300': graphSection === choice })}
              onClick={() => setGraphSection(choice)}
              key={choice}
            >
              {choice}
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <ResponsiveContainer height={400}>
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="2 2" stroke="#363B63" />
            <Line type="monotone" dataKey="value" stroke="var(--primary-action)" dot={false} />
            <XAxis dataKey="date" tickMargin={10} minTickGap={20} />
            <YAxis dataKey="value" scale="sqrt" />
            <Tooltip content={<GraphTooltip section={graphSection} />} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
