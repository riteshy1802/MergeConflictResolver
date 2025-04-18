import { useState } from "react"
import React from "react";
import {
  Github,
  GitBranch, 
  Zap,
  Maximize2,
  ExternalLink,
  FileCode,
  CheckCircle,
  AlertTriangle,
  LogOut,
  Settings,
  User,
  HelpCircle,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SidebarView() {
  const [autopilotEnabled, setAutopilotEnabled] = useState(false)

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
    {
      file: "index.js",
      action: "Resolved",
      time: "2 mins ago", 
      details: "Accepted incoming changes for function declaration",
    },
    {
      file: "package.json",
      action: "Resolved",
      time: "10 mins ago",
      details: "Merged both dependency versions",
    },
    {
      file: "README.md",
      action: "Resolved", 
      time: "25 mins ago",
      details: "Accepted AI suggestion for documentation conflict",
    },
  ]

  const totalConflicts = 7 // Total conflict zones across all files

  return (
    <div className="flex flex-col border-r-2 border-[#3c3c3c] h-screen bg-[#24292e] text-[#f5f5f5] w-full overflow-hidden">
      <div className="p-4 bg-[#2b3137]">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* GitWiz Logo */}
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-13%20190209-0xtuHMlkOcyqEONeiqCc3KQohvTdMz.png"
              alt="GitWiz Logo"
              className="h-10 w-10 mr-3 rounded"
            />
            <div>
              <h1 className="text-sm font-semibold text-white">GitWiz Merge Helper</h1>
              <p className="text-xs text-[#e0e0e0]">Your AI-powered conflict resolver</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center bg-[#2e362e] px-2 py-0.5 rounded cursor-pointer hover:opacity-80 transition-opacity">
                <div className="mr-1.5 text-right">
                  <p className="text-[12px] font-medium text-white">{user.name}</p>
                  <p className="text-[10px] text-[#e0e0e0]">@{user.name.toLowerCase().replace(" ", "")}</p>
                </div>
                <Avatar className="h-8 w-8 border border-[#2dba4e]">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="bg-[#2dba4e] text-white text-[10px]">
                    {user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-[#2b3137] border-[#3c3c3c] text-[#f5f5f5]">
              <div className="flex items-center justify-start p-1.5 border-b border-[#3c3c3c]">
                <Avatar className="h-6 w-6 mr-1.5">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="text-[10px]">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-medium">{user.name}</p>
                  <p className="text-[10px] text-[#a0a0a0]">@{user.name.toLowerCase().replace(" ", "")}</p>
                </div>
              </div>
              <DropdownMenuItem className="hover:bg-[#3c3c3c] hover:text-white cursor-pointer text-xs py-1.5">
                <User className="h-3.5 w-3.5 mr-1.5" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-[#3c3c3c] hover:text-white cursor-pointer text-xs py-1.5">
                <Settings className="h-3.5 w-3.5 mr-1.5" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-[#3c3c3c] hover:text-white cursor-pointer text-xs py-1.5">
                <HelpCircle className="h-3.5 w-3.5 mr-1.5" />
                <span>Help & Feedback</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#3c3c3c]" />
              <DropdownMenuItem className="hover:bg-[#ff6b6b] hover:text-whitesmoke text-[#ff6b6b] cursor-pointer text-xs py-1.5">
                <LogOut className="h-3.5 w-3.5 mr-1.5" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>        
        </div>
    </div>

      {/* Add flex-1 to ScrollArea to fill remaining space */}
      <ScrollArea className="flex-1 overflow-y-auto">
        {/* Repository Info */}
        <div className="p-4 bg-[#2b3137] border-b border-[#3c3c3c]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-white">Repository</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-[#e0e0e0] rounded-full hover:text-white hover:bg-[#3c3c3c] transition-colors"
            >
              <Github className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-white truncate">{repo.name}</p>
          <div className="flex items-center mt-1 text-xs text-[#e0e0e0]">
            <GitBranch className="h-3 w-3 mr-1" />
            <span className="truncate">{repo.branch}</span>
          </div>
        </div>

        {/* Files with Conflicts */}
        <div className="p-4">
          <h2 className="text-xs font-medium mb-2 text-white">Files with Conflicts</h2>
          <ul className="space-y-1">
            {conflictFiles.map((file) => (
              <li
                key={file.path}
                className="flex items-center p-2 rounded hover:bg-[#2b3137] cursor-pointer group transition-colors"
              >
                {file.resolved ? (
                  <CheckCircle className="h-4 w-4 mr-2 text-[#2dba4e]" />
                ) : (
                  <AlertTriangle className="h-4 w-4 mr-2 text-[#f0ad4e]" />
                )}
                <div className="flex-1 truncate text-sm text-[#f5f5f5]">{file.name}</div>
                <FileCode className="h-4 w-4 text-[#e0e0e0] opacity-0 group-hover:opacity-100 transition-opacity" />
              </li>
            ))}
          </ul>
        </div>

        {/* Conflict Summary */}
        <div className="p-4 bg-[#2b3137] border-y border-[#3c3c3c]">
          <h2 className="text-xs font-medium mb-2 text-white">Conflict Summary</h2>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-[#24292e] p-2 rounded">
              <div className="text-xs text-[#e0e0e0]">Files</div>
              <div className="text-sm font-medium text-white">{conflictFiles.length}</div>
            </div>
            <div className="bg-[#24292e] p-2 rounded">
              <div className="text-xs text-[#e0e0e0]">Conflicts</div>
              <div className="text-sm font-medium text-white">{totalConflicts}</div>
            </div>
          </div>
          {/* The Switch component needs proper styling to match theme */}
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-medium mb-2 text-white">Autopilot Mode</h2>
            <Switch
              checked={autopilotEnabled}
              onCheckedChange={setAutopilotEnabled}
              className="data-[state=checked]:bg-[#2dba4e] 
              bg-[#3c3c3c] h-6 w-9 rounded-full border-2 
              data-[state=unchecked]:border-[#2dba4e] 
              border-transparent transition-colors 
              focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2dba4e] 
              focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:bg-white"
            />
          </div>
        </div>

        {/* Primary Actions */}
        <div className="p-4 space-y-2">
          <Button className="w-full bg-[#2dba4e] hover:bg-[#25a042] text-white font-medium transition-colors">
            <Zap className="h-4 w-4 mr-2" />
            Resolve All with Autopilot
          </Button>
          <Button
            variant="outline"
            className="w-full border-[#3c3c3c] hover:bg-[#2b3137] text-white hover:text-white transition-colors"
          >
            <Maximize2 className="h-4 w-4 mr-2" />
            Open Full View
          </Button>
        </div>

        {/* Change History */}
        <div className="p-4">
          <h2 className="text-xs font-medium mb-2 text-white">Change History</h2>
          <TooltipProvider>
            <ul className="space-y-2">
              {history.map((item, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <li className="bg-[#2b3137] p-2 rounded text-xs hover:bg-[#3c3c3c] transition-colors cursor-default">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white">{item.file}</span>
                        <span className="text-[#e0e0e0]">{item.time}</span>
                      </div>
                      <div className="text-[#e0e0e0] mt-0.5">{item.action}</div>
                    </li>
                  </TooltipTrigger>
                  <TooltipContent side="left" align="center" className="bg-[#2b3137] text-white border-[#3c3c3c]">
                    <p>{item.details}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </ul>
          </TooltipProvider>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="px-2 py-2 border-t border-[#3c3c3c] mt-auto bg-[#2b3137]">
        <Button
          variant="ghost"
          size="sm"
          className="w-full flex items-center justify-center rounded-[6px] text-[#e0e0e0] hover:text-white hover:bg-[#3c3c3c] transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          Open GitHub Repo
        </Button>
      </div>
    </div>
  )
}
