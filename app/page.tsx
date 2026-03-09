import { getWorkLogs, getObservations, getSOPs, getWorks } from "@/lib/notion"
import PortfolioClient from "@/components/portfolio-client"

// Revalidate every 30 seconds — new Notion content appears within half a minute
export const revalidate = 30

export default async function Portfolio() {
  const [workLogs, observations, sops, works] = await Promise.all([
    getWorkLogs(),
    getObservations(),
    getSOPs(),
    getWorks(),
  ])

  return (
    <PortfolioClient
      workLogs={workLogs}
      observations={observations}
      sops={sops}
      works={works}
    />
  )
}
