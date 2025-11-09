"use client"
import React from "react"

interface RowItem {
    text: string
    speed: number  // seconds
}

interface Props {
    rows: RowItem[]
}

const TickerList: React.FC<Props> = ({ rows }) => {
    return (
        <div className="w-full flex flex-col gap-2">
            {rows.map((row, i) => (
                <div key={i} className="overflow-hidden whitespace-nowrap border-y border-black py-2">
                    <div
                        className="inline-block animate-ticker"
                        style={{ animationDuration: `${row.speed}s` }}
                    >
                        {row.text} — {row.text} — {row.text} — {row.text}
                    </div>
                </div>
            ))}

            <style jsx>{`
        @keyframes ticker {
          from { transform: translateX(0%); }
          to { transform: translateX(-100%); }
        }
        .animate-ticker {
          animation-name: ticker;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
        </div>
    )
}

export default TickerList

