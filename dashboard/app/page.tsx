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
    <div className="min-h-screen bg-background text-foreground bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background p-8 font-sans transition-colors duration-500">

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex items-center space-x-4 pb-6 border-b border-white/10">
          <div className="p-3 bg-blue-500/10 rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.2)]">
            <Activity className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 drop-shadow-sm">
              Argus Sentinel
            </h1>
            <p className="text-muted-foreground text-sm font-medium tracking-wide mt-1">Real-time Governance & Transaction Interception Engine</p>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-white/5 border-white/10 shadow-lg hover:shadow-xl hover:bg-white/[0.08] transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold tracking-wide text-zinc-400">Total Intercepted</CardTitle>
              <ArrowRightLeft className="h-5 w-5 text-zinc-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-zinc-100">{totalLogs}</div>
              <p className="text-xs text-zinc-500 mt-1 font-medium">All monitored transactions</p>
            </CardContent>
          </Card>

          <Card className="bg-red-500/5 flex-1 border-red-500/20 shadow-lg hover:shadow-red-500/10 hover:bg-red-500/10 transition-all duration-300 text-red-500 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold tracking-wide text-red-400">Blocked Activity</CardTitle>
              <ShieldAlert className="h-5 w-5 text-red-500/70 group-hover:text-red-400 group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] transition-all" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-red-400">{blockedLogs}</div>
              <p className="text-xs text-red-500/60 mt-1 font-medium">Governance flags raised</p>
            </CardContent>
          </Card>

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
    </div>
  )
}