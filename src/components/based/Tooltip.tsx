/** @jsxImportSource @emotion/react */
import 'twin.macro'
import React, { FC, useState } from 'react'
import { Question } from 'phosphor-react'
import ReactTooltip from 'react-tooltip'
import { v4 as uuidv4 } from 'uuid'

import Txt from 'src/components/based/Txt'

interface ITooltip {
  text: string
}

const Tooltip: FC<ITooltip> = ({ text }) => {
  const [id] = useState(uuidv4())

  return (
    <>
      <Question
        data-tip
        data-for={id}
        height={16}
        width={16}
        className="cursor-help text-font-200 dark:text-font-200"
      />
      <ReactTooltip
        id={id}
        type="info"
        backgroundColor="rgb(54, 65, 83)"
        place="right"
        effect="solid"
        clickable
      >
        <Txt.MobileMedium className="text-white">{text}</Txt.MobileMedium>
      </ReactTooltip>
    </>
  )
}

export default Tooltip
