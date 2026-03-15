"use client"

import { useState, useEffect } from "react"
import GovernancePipeline from "../components/GovernancePipeline"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import SentinelHeader from "../components/SentinelHeader"
import MCPIntegrationPanel from "../components/MCPIntegrationPanel"
import AgentPipeline from "../components/AgentPipeline"

export default function Home() {

  const [user, setUser] = useState("")
  const [amount, setAmount] = useState("")
  const [logs, setLogs] = useState<any[]>([])
  const [stats, setStats] = useState<any>({})
  const [trace, setTrace] = useState<any>(null)
  const [suggestedRule, setSuggestedRule] = useState<any>(null)

  const API = "http://localhost:5000"

  const fetchLogs = async () => {
    const res = await fetch(`${API}/governance/logs`)
    const data = await res.json()
    setLogs(data)
  }

  const fetchStats = async () => {
    const res = await fetch(`${API}/governance/stats`)
    const data = await res.json()
    setStats(data)
  }

  const sendTransaction = async () => {
    const res = await fetch("http://localhost:8000/transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, amount })
    })
    const data = await res.json()
    setTrace(data.trace)
    setSuggestedRule(data.suggestedRule)
    fetchLogs()
    fetchStats()
  }

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
    <div className="min-h-screen bg-gray-950 text-white p-10">
      

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-white">
          🛡️ Trace Shield
        </h1>
        <p className="text-gray-400 mt-1 text-sm">Governance & Threat Intelligence Dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">

        <Card className="bg-gray-900 border border-gray-700">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-gray-400 uppercase tracking-widest">Total Requests</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-white">{stats.totalRequests || 0}</CardContent>
        </Card>

        <Card className="bg-gray-900 border border-red-800">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-red-400 uppercase tracking-widest">Blocked</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-red-400">{stats.blockedRequests || 0}</CardContent>
        </Card>

        <Card className="bg-gray-900 border border-yellow-700">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-yellow-400 uppercase tracking-widest">Monitoring</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-yellow-400">{stats.monitoringEvents || 0}</CardContent>
        </Card>

        <Card className="bg-gray-900 border border-orange-700">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-orange-400 uppercase tracking-widest">High Risk</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-orange-400">{stats.highRiskEvents || 0}</CardContent>
        </Card>

      </div>

      {/* Transaction Simulator */}
      <Card className="mb-10 bg-gray-900 border border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg"> Transaction Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <input
              className="bg-gray-800 border border-gray-600 text-white placeholder-gray-500 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="User"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
            <input
              className="bg-gray-800 border border-gray-600 text-white placeholder-gray-500 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold px-6 py-2 rounded"
              onClick={sendTransaction}
            >
              Send Transaction
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Governance Logs */}
      <Card className="mb-10 bg-gray-900 border border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">📋 Governance Logs</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-y-auto max-h-72 rounded-b-lg">
            <Table>
              <TableHeader className="sticky top-0 bg-gray-800 z-10">
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-400">User</TableHead>
                  <TableHead className="text-gray-400">Amount</TableHead>
                  <TableHead className="text-gray-400">Decision</TableHead>
                  <TableHead className="text-gray-400">Reason</TableHead>
                  <TableHead className="text-gray-400">Time</TableHead>
                  <TableHead className="text-gray-400">Explanation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log: any) => (
                  <TableRow key={log._id} className="border-gray-800 hover:bg-gray-800 transition-colors">
                    <TableCell className="text-white font-medium">{log.user}</TableCell>
                    <TableCell className="text-green-400 font-mono">{log.amount}</TableCell>
                    <TableCell>
                      <span
                        className={`text-xs font-semibold ${["blocked", "block"].includes(String(log.decision).toLowerCase())
                          ? "text-red-300"
                          : ["allowed", "allow"].includes(String(log.decision).toLowerCase())
                            ? "text-green-300"
                            : "text-yellow-300"
                          }`}
                      >
                        {["blocked", "block"].includes(String(log.decision).toLowerCase())
                          ? " "
                          : ["allowed", "allow"].includes(String(log.decision).toLowerCase())
                            ? " "
                            : " "}
                        {log.decision}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-300">{log.reason}</TableCell>
                    <TableCell className="text-gray-400 text-xs">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </TableCell>
                    <TableCell className="text-gray-400 text-xs max-w-xs">
                      {log.explanation || "No explanation"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Agent Execution Trace */}
      {trace && (
        <Card className="mb-10 bg-gray-900 border border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-lg"> Governance Trace</CardTitle>
            <p className="text-gray-400 text-xs mt-1">Trace ID: <span className="font-mono text-blue-400">{trace.traceId}</span></p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trace.steps.map((step: any, index: number) => (
                <div key={index} className="border-l-2 border-blue-500 pl-4 py-1">
                  <p className="font-semibold text-blue-300 text-sm">
                    {index + 1}. {step.agent}
                  </p>
                  <p className="text-gray-400 text-xs">Action: {step.action}</p>
                  <pre className="text-xs bg-gray-950 text-green-300 p-2 mt-1 rounded overflow-x-auto">
                    {JSON.stringify(step.result, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <GovernancePipeline trace={trace} />
            </div>
          </CardContent>
          {suggestedRule && (

            <div className="mt-6 p-4 border rounded bg-gray-900 text-white">

              <h2 className="text-lg font-bold mb-2">
                🤖 AI Governance Suggestion
              </h2>

              <p><b>Rule Name:</b> {suggestedRule.name}</p>

              <p>
                <b>Condition:</b> {suggestedRule.field} {suggestedRule.operator} {suggestedRule.value}
              </p>

              <p><b>Action:</b> {suggestedRule.action}</p>

              <p><b>Reason:</b> {suggestedRule.reason}</p>

            </div>


          )}
        </Card>
      )}
<div>
<AgentPipeline />
  </div>
  <div>
    <MCPIntegrationPanel />
  </div>

    </div>
  )
}