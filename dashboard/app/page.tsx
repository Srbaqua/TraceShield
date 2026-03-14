"use client"

import { useState, useEffect } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

export default function Home() {

  const [user, setUser] = useState("")
  const [amount, setAmount] = useState("")
  const [logs, setLogs] = useState<any[]>([])
  const [stats, setStats] = useState<any>({})
  const [trace, setTrace] = useState<any>(null)

  const API = "http://localhost:5000"

  // -----------------------------
  // Fetch Governance Logs
  // -----------------------------
  const fetchLogs = async () => {

    const res = await fetch(`${API}/governance/logs`)
    const data = await res.json()

    setLogs(data)

  }

  // -----------------------------
  // Fetch Stats
  // -----------------------------
  const fetchStats = async () => {

    const res = await fetch(`${API}/governance/stats`)
    const data = await res.json()

    setStats(data)

  }

  // -----------------------------
  // Send Transaction
  // -----------------------------
  const sendTransaction = async () => {

    const res = await fetch(`${API}/intercept/transfer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user,
        amount: Number(amount)
      })
    })

    const data = await res.json()

    console.log("Trace:", data.trace)

    setTrace(data.trace)

    fetchLogs()
    fetchStats()

  }

  // -----------------------------
  // Initial Load
  // -----------------------------
  useEffect(() => {

    fetchLogs()
    fetchStats()

    const interval = setInterval(() => {
      fetchLogs()
      fetchStats()
    }, 4000)

    return () => clearInterval(interval)

  }, [])

  return (

    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        Trace Shield Governance Dashboard
      </h1>

      -----------------------------
          Threat Intelligence Cards
      ------------------------------

      <div className="grid grid-cols-4 gap-4 mb-10">

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

      {/* -----------------------------
          Transaction Simulator
      ------------------------------ */}

      <Card className="mb-10">

        <CardHeader>
          <CardTitle>Transaction Simulator</CardTitle>
        </CardHeader>

        <CardContent>

          <div className="flex gap-4">

            <input
              className="border p-2"
              placeholder="User"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />

            <input
              className="border p-2"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <button
              className="bg-black text-white px-4 py-2"
              onClick={sendTransaction}
            >
              Send Transaction
            </button>

          </div>

        </CardContent>

      </Card>

      {/* -----------------------------
          Agent Execution Trace
      ------------------------------ */}

      {trace && (

        <Card className="mb-10">

          <CardHeader>
            <CardTitle>Agent Execution Trace</CardTitle>
          </CardHeader>

          <CardContent>

            <p className="mb-4">
              Trace ID: {trace.traceId}
            </p>

            {trace.steps.map((step: any, index: number) => (

              <div
                key={index}
                className="border p-4 rounded mb-4"
              >

                <p><b>Agent:</b> {step.agent}</p>
                <p><b>Action:</b> {step.action}</p>

                <pre className=" p-2 mt-2 text-sm rounded">
                  {JSON.stringify(step.result, null, 2)}
                </pre>

              </div>

            ))}

          </CardContent>

        </Card>

      )}

      {/* -----------------------------
          Governance Logs Table
      ------------------------------ */}

      <Card>

        <CardHeader>
          <CardTitle>Governance Logs</CardTitle>
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
                <TableHead>Explanation</TableHead>
              </TableRow>

            </TableHeader>

            <TableBody>

              {logs.map((log: any) => (

                <TableRow key={log._id}>

                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.amount}</TableCell>
                  <TableCell>{log.decision}</TableCell>
                  <TableCell>{log.reason}</TableCell>

                  <TableCell>
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </TableCell>

                  <TableCell>
                    {log.explanation || "No explanation"}
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