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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ShieldCheck, ShieldAlert, Activity, ArrowRightLeft } from "lucide-react"

export default function Home() {

  const [logs, setLogs] = useState<any[]>([])

const fetchLogs = async () => {
  const res = await fetch("http://localhost:5000/governance/logs")
  const data = await res.json()
  setLogs(data)
}
const [stats, setStats] = useState<any>({})
const fetchStats = async () => {
  const res = await fetch("http://localhost:5000/governance/stats")
  const data = await res.json()
  setStats(data)
}

useEffect(() => {

  fetchLogs()
  fetchStats()

  const interval = setInterval(() => {
    fetchLogs()
    fetchStats()
  }, 3000)

  return () => clearInterval(interval)
}, [])
  // useEffect(() => {
  //   fetchLogs()

  //   const interval = setInterval(fetchLogs, 3000)

  //   return () => clearInterval(interval)
  // }, [])

  const [user, setUser] = useState("")
const [amount, setAmount] = useState("")

const sendTransaction = async () => {

  await fetch("http://localhost:6000/transfer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user,
      amount: Number(amount)
    })
  })

}


  return (
    <div className="p-10">

      <Card>

        <CardHeader>
          <CardTitle className="text-2xl">
            Argus Sentinel Governance Dashboard
          </CardTitle>
        </CardHeader>

        <CardContent>
<Card className="mb-6">

  <CardHeader>
    <CardTitle>Transaction Simulator</CardTitle>
  </CardHeader>

  <CardContent className="flex gap-4">

    <Input
      placeholder="User"
      value={user}
      onChange={(e) => setUser(e.target.value)}
    />

    <Input
      placeholder="Amount"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
    />

    <Button onClick={sendTransaction}>
      Send Transaction
    </Button>

  </CardContent>

</Card>

      <div className="grid grid-cols-4 gap-4 mb-6">

<Card>
<CardHeader>
<CardTitle>Total Requests</CardTitle>
</CardHeader>
<CardContent>{stats.totalRequests || 0}</CardContent>
</Card>

<Card>
<CardHeader>
<CardTitle>Blocked Requests</CardTitle>
</CardHeader>
<CardContent>{stats.blockedRequests || 0}</CardContent>
</Card>

<Card>
<CardHeader>
<CardTitle>Monitoring Events</CardTitle>
</CardHeader>
<CardContent>{stats.monitoringEvents || 0}</CardContent>
</Card>

<Card>
<CardHeader>
<CardTitle>High Risk Events</CardTitle>
</CardHeader>
<CardContent>{stats.highRiskEvents || 0}</CardContent>
</Card>

</div>
          <Table>

            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Decision</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Time</TableHead>
            <TableHead>Explanation</TableHead>
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
                  <TableCell>{log.explanation}</TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>

        </CardContent>

      </Card>

      </div>
  )
}