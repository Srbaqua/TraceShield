"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {

  const [logs, setLogs] = useState<any[]>([])

  const fetchLogs = async () => {
    const res = await fetch("http://localhost:5000/governance/logs")
    const data = await res.json()
    setLogs(data)
  }

  useEffect(() => {
    fetchLogs()

    // auto refresh every 3 seconds
    const interval = setInterval(fetchLogs, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-10">

      <Card>

        <CardHeader>
          <CardTitle className="text-2xl">
            Argus Sentinel Governance Dashboard
          </CardTitle>
        </CardHeader>

        <CardContent>

          <Table>

            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Decision</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>

              {logs.map((log, index) => (

                <TableRow key={index}>

                  <TableCell>{log.user}</TableCell>

                  <TableCell>{log.amount}</TableCell>

                  <TableCell>
                    <Badge
                      variant={log.decision === "BLOCK" ? "destructive" : "default"}
                    >
                      {log.decision}
                    </Badge>
                  </TableCell>

                  <TableCell>{log.reason}</TableCell>

                  <TableCell>
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>

        </CardContent>

      </Card>

    </div>
  )
}