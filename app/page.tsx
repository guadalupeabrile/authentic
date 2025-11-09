import TickerList from "@/components/TickerList"
import { tickerRows } from "@/data/tickerRows"

export default function Page() {
    return <TickerList rows={tickerRows} />
}

