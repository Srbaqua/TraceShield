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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ShieldCheck, ShieldAlert, Activity, ArrowRightLeft } from "lucide-react"

export default function Home() {

  const [logs, setLogs] = useState<any[]>([])

  const fetchLogs = async () => {
    try {
      const res = await fetch("http://localhost:5000/governance/logs")
      if (res.ok) {
        const data = await res.json()
        setLogs(data)
      }
    } catch (e) {
      console.error("Failed to fetch logs", e)
    }
  }

  useEffect(() => {
    fetchLogs()
    const interval = setInterval(fetchLogs, 3000)
    return () => clearInterval(interval)
  }, [])

  const totalLogs = logs.length;
  const blockedLogs = logs.filter(l => l.decision === "BLOCK").length;
  const allowedLogs = totalLogs - blockedLogs;

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

          <Card className="bg-emerald-500/5 flex-1 border-emerald-500/20 shadow-lg hover:shadow-emerald-500/10 hover:bg-emerald-500/10 transition-all duration-300 text-emerald-500 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold tracking-wide text-emerald-400">Allowed Passings</CardTitle>
              <ShieldCheck className="h-5 w-5 text-emerald-500/70 group-hover:text-emerald-400 group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.8)] transition-all" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-emerald-400">{allowedLogs}</div>
              <p className="text-xs text-emerald-500/60 mt-1 font-medium">Cleared and safe</p>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card className="bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden">
          <CardHeader className="bg-white/[0.02] border-b border-white/5 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold tracking-tight text-zinc-100">Live Interception Feed</CardTitle>
                <CardDescription className="text-zinc-500 mt-1">Real-time logs from the policy engine.</CardDescription>
              </div>
              <div className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-black/20">
                <TableRow className="border-white/5 hover:bg-transparent data-[state=selected]:bg-transparent">
                  <TableHead className="text-zinc-400 font-semibold px-6">User / Identifier</TableHead>
                  <TableHead className="text-zinc-400 font-semibold text-right">Amount</TableHead>
                  <TableHead className="text-zinc-400 font-semibold text-center">Status</TableHead>
                  <TableHead className="text-zinc-400 font-semibold">Reasoning Layer</TableHead>
                  <TableHead className="text-zinc-400 font-semibold text-right pr-6">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={5} className="text-center py-12 text-zinc-500 items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                        <Activity className="h-8 w-8 animate-pulse text-zinc-700" />
                        Awaiting governance events...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log, index) => (
                    <TableRow 
                      key={index} 
                      className="border-white/5 transition-colors hover:bg-white/[0.04] group animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell className="font-mono text-sm text-blue-300/80 px-6">{log.user}</TableCell>
                      <TableCell className="text-right font-medium text-zinc-200">
                        ${Number(log.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className={`
                            px-3 py-1 font-bold uppercase tracking-wider text-xs shadow-sm
                            ${log.decision === "BLOCK" 
                              ? "bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]" 
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                            }
                          `}
                        >
                          {log.decision}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-zinc-400 text-sm max-w-[200px] truncate group-hover:text-zinc-300 transition-colors">
                        {log.reason}
                      </TableCell>
                      <TableCell className="text-right text-xs font-mono text-zinc-500 pr-6">
                        {new Date(log.timestamp).toLocaleTimeString(undefined, {
                          hour: '2-digit', minute:'2-digit', second:'2-digit', fractionalSecondDigits: 3
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}