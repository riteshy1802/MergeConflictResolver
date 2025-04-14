"use client"

import { useState } from "react"
import {
  GitBranch,
  Zap,
  Save,
  Upload,
  ChevronLeft,
  ChevronRight,
  Edit,
  ArrowDownToLine,
  ArrowUpToLine,
  Code,
  Layers,
  LogOut,
  Settings,
  User,
  HelpCircle,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function FullView() {
  const [currentFile, setCurrentFile] = useState("App.jsx")
  const [currentConflict, setCurrentConflict] = useState(1)

  // Mock data
  const user = {
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
  }

  const repo = {
    name: "awesome-project",
    branch: "feature/new-login",
    url: "https://github.com/sarahjohnson/awesome-project",
  }

  const conflictFiles = [
    { name: "index.js", path: "/src/index.js", resolved: true },
    { name: "App.jsx", path: "/src/App.jsx", resolved: false },
    { name: "utils.js", path: "/src/utils/utils.js", resolved: false },
    { name: "styles.css", path: "/src/styles/styles.css", resolved: false },
  ]

  const history = [
    { file: "index.js", action: "Accepted Incoming", time: "2 mins ago", user: "sarahjohnson" },
    { file: "package.json", action: "Merged Both", time: "10 mins ago", user: "sarahjohnson" },
    { file: "README.md", action: "AI Suggestion", time: "25 mins ago", user: "sarahjohnson" },
    { file: "server.js", action: "Manual Edit", time: "1 hour ago", user: "sarahjohnson" },
  ]

  const totalConflicts = 3 // Total conflicts in current file

  // Sample code for the conflict panels
  const incomingCode = `function login(username, password) {
  // New implementation with OAuth
  if (!username || !password) {
    throw new Error('Missing credentials');
  }
  
  return authService.authenticate({
    username,
    password,
    useOAuth: true,
    rememberUser: false
  });
}`

  const currentCode = `function login(username, password) {
  // Check if credentials exist
  if (!username) return false;
  if (!password) return false;
  
  // Use the auth service
  return authService.login(username, password, {
    remember: true,
    timeout: 3600
  });
}`

  const aiSuggestion =
    "Merge both implementations, keeping the OAuth support from incoming changes while preserving the timeout parameter from current code."

  return (
    <div className="flex flex-col h-full bg-[#24292e] text-[#f5f5f5] overflow-y-scroll">
      {/* Header */}
      <div className="p-4 bg-[#2b3137] border-b border-[#3c3c3c] flex items-center justify-between">
        <div className="flex items-center">
          {/* GitWiz Logo */}
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-13%20190209-0xtuHMlkOcyqEONeiqCc3KQohvTdMz.png"
            alt="GitWiz Logo"
            className="h-10 w-10 mr-3"
          />
          <div className="flex flex-col">
            <h1 className="text-base font-semibold text-white">GitWiz Merge Resolution Center</h1>
            <div className="flex items-center text-xs text-[#e0e0e0]">
              <span className="mr-3">{repo.name}</span>
              <div className="flex items-center">
                <GitBranch className="h-3 w-3 mr-1" />
                <span>{repo.branch}</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
              <div className="mr-2 text-right">
                <p className="text-xs font-medium text-white">{user.name}</p>
                <p className="text-xs text-[#e0e0e0]">@{user.name.toLowerCase().replace(" ", "")}</p>
              </div>
              <Avatar className="h-8 w-8 border-2 border-[#2dba4e]">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="bg-[#2dba4e] text-white">
                  {user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#2b3137] border-[#3c3c3c] text-[#f5f5f5]">
            <div className="flex items-center justify-start p-2 border-b border-[#3c3c3c]">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-[#a0a0a0]">@{user.name.toLowerCase().replace(" ", "")}</p>
              </div>
            </div>
            <DropdownMenuItem className="hover:bg-[#3c3c3c] cursor-pointer">
              <User className="h-4 w-4 mr-2" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-[#3c3c3c] cursor-pointer">
              <Settings className="h-4 w-4 mr-2" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-[#3c3c3c] cursor-pointer">
              <HelpCircle className="h-4 w-4 mr-2" />
              <span>Help & Feedback</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#3c3c3c]" />
            <DropdownMenuItem className="hover:bg-[#3c3c3c] text-[#ff6b6b] cursor-pointer">
              <LogOut className="h-4 w-4 mr-2" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* File Navigation Tabs */}
      <Tabs defaultValue={currentFile} className="w-full" onValueChange={setCurrentFile}>
        <div className="bg-[#2b3137] border-b border-[#3c3c3c]">
          <TabsList className="bg-transparent h-9 px-2">
            {conflictFiles.map((file) => (
              <TabsTrigger
                key={file.path}
                value={file.name}
                className="data-[state=active]:bg-[#24292e] data-[state=active]:border-t-2 data-[state=active]:border-t-[#2dba4e] data-[state=active]:shadow-none rounded-none px-3 h-9 text-[#f5f5f5] transition-colors"
              >
                {file.name}
                {file.resolved && <span className="ml-1 text-[#2dba4e]">✓</span>}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Main content area - Made scrollable */}
        <ScrollArea className="flex-1 h-[calc(100vh-13rem)]">
          {conflictFiles.map((file) => (
            <TabsContent key={file.path} value={file.name} className="m-0 data-[state=active]:block h-full">
              {/* Conflict Navigation */}
              <div className="flex items-center justify-between p-3 bg-[#2b3137] border-b border-[#3c3c3c]">
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 mr-1 hover:bg-[#3c3c3c] text-[#f5f5f5] transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-white">
                    Conflict {currentConflict} of {totalConflicts}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 ml-1 hover:bg-[#3c3c3c] text-[#f5f5f5] transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center text-xs text-[#e0e0e0]">
                  <Code className="h-3 w-3 mr-1" />
                  <span>{file.path}</span>
                </div>
              </div>

              {/* Conflict Display */}
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Incoming Changes */}
                  <Card className="border-[#3c3c3c] bg-[#2b3137]">
                    <CardHeader className="py-2 px-4 bg-[#24292e] border-b border-[#3c3c3c]">
                      <CardTitle className="text-sm flex items-center text-white">
                        <ArrowDownToLine className="h-4 w-4 mr-2 text-[#2dba4e]" />
                        Incoming Changes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <pre className="p-4 text-sm font-mono overflow-auto max-h-[300px]">
                        <code className="text-[#f5f5f5]">{incomingCode}</code>
                      </pre>
                    </CardContent>
                  </Card>

                  {/* Current Branch Changes */}
                  <Card className="border-[#3c3c3c] bg-[#2b3137]">
                    <CardHeader className="py-2 px-4 bg-[#24292e] border-b border-[#3c3c3c]">
                      <CardTitle className="text-sm flex items-center text-white">
                        <ArrowUpToLine className="h-4 w-4 mr-2 text-[#f0ad4e]" />
                        Current Branch
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <pre className="p-4 text-sm font-mono overflow-auto max-h-[300px]">
                        <code className="text-[#f5f5f5]">{currentCode}</code>
                      </pre>
                    </CardContent>
                  </Card>
                </div>

                {/* AI Suggestion */}
                <Card className="mt-4 border-[#3c3c3c] bg-[#2b3137]">
                  <CardHeader className="py-2 px-4 bg-[#24292e] border-b border-[#3c3c3c]">
                    <CardTitle className="text-sm flex items-center text-white">
                      <Zap className="h-4 w-4 mr-2 text-[#2dba4e]" />
                      AI Suggestion
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-sm text-[#f5f5f5]">{aiSuggestion}</p>
                  </CardContent>
                </Card>

                {/* Resolution Buttons */}
                <div className="flex items-center justify-between mt-4">
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      className="border-[#3c3c3c] hover:bg-[#3c3c3c] text-white hover:text-white transition-colors shadow hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      Accept Incoming
                    </Button>
                    <Button
                      variant="outline"
                      className="border-[#3c3c3c] hover:bg-[#3c3c3c] text-white hover:text-white transition-colors shadow hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      Accept Current
                    </Button>
                    <Button
                      variant="outline"
                      className="border-[#3c3c3c] hover:bg-[#3c3c3c] text-white hover:text-white transition-colors shadow hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      Accept Both
                    </Button>
                  </div>
                  <div className="space-x-2">
                    <Button className="bg-[#2dba4e] hover:bg-[#25a042] text-white font-medium transition-colors">
                      <Zap className="h-4 w-4 mr-2" />
                      Accept AI Suggestion
                    </Button>
                    <Button
                      variant="outline"
                      className="border-[#3c3c3c] hover:bg-[#3c3c3c] text-white hover:text-white transition-colors"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Manually
                    </Button>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-3 bg-[#2b3137] border-t border-[#3c3c3c] flex items-center justify-between mt-4">
                <div className="space-x-2">
                  <Button className="bg-[#2dba4e] hover:bg-[#25a042] text-white font-medium transition-colors">
                    <Save className="h-4 w-4 mr-2" />
                    Resolve & Save
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[#3c3c3c] hover:bg-[#3c3c3c] text-white hover:text-white transition-colors"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Autopilot (Resolve All)
                  </Button>
                </div>
                <Button
                  variant="outline"
                  className="border-[#3c3c3c] hover:bg-[#3c3c3c] text-white hover:text-white transition-colors"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Push Changes
                </Button>
              </div>
            </TabsContent>
          ))}
        </ScrollArea>
      </Tabs>

      {/* Change History */}
      <div className="p-4 bg-[#2b3137] border-t border-[#3c3c3c]">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium text-white">Change History</h2>
          <div className="flex items-center text-xs text-[#e0e0e0]">
            <Layers className="h-3 w-3 mr-1" />
            <span>MongoDB Log</span>
          </div>
        </div>
        <div className="bg-[#24292e] rounded border border-[#3c3c3c]">
          <Table>
            <TableHeader>
              <TableRow className="border-[#3c3c3c] hover:bg-transparent">
                <TableHead className="text-xs font-medium text-[#e0e0e0]">File</TableHead>
                <TableHead className="text-xs font-medium text-[#e0e0e0]">Action</TableHead>
                <TableHead className="text-xs font-medium text-[#e0e0e0]">Time</TableHead>
                <TableHead className="text-xs font-medium text-[#e0e0e0]">User</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item, index) => (
                <TableRow key={index} className="border-[#3c3c3c] hover:bg-[#2b3137] transition-colors">
                  <TableCell className="text-xs py-1.5 text-[#f5f5f5]">{item.file}</TableCell>
                  <TableCell className="text-xs py-1.5 text-[#f5f5f5]">{item.action}</TableCell>
                  <TableCell className="text-xs py-1.5 text-[#f5f5f5]">{item.time}</TableCell>
                  <TableCell className="text-xs py-1.5 text-[#f5f5f5]">{item.user}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
