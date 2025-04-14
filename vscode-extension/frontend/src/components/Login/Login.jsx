"use client"
import {
  Github,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export function Login() {
    const navigate = useNavigate();
  return (
    <div className="flex flex-col h-[100vh] p-3 bg-[#24292e] text-[#f5f5f5] w-full overflow-hidden">
        <div className="flex flex-col items-center justify-center h-full">
            <div className="flex flex-col items-center mb-4">
            <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-13%20190209-0xtuHMlkOcyqEONeiqCc3KQohvTdMz.png"
                alt="GitWiz Logo"
                className="h-24 w-24 mb-2 rounded"
            />
            <h1 className="text-[2rem] font-bold text-white text-center">GitWiz</h1>
            <p className="text-sm text-[#e0e0e0] text-center">Merge Conflict Helper</p>
            <p className="text-xs text-[#a0a0a0] text-center mt-1">Your AI-powered conflict resolver</p>
            </div>

            <div className="mt-4">
                <div className="space-y-3 flex flex-col items-center justify-center">
                {/* Fixed typo in onClick prop - was 'onlcick' */}
                <Button 
                    className="w-[80%] bg-[#2dba4e] rounded hover:bg-[#25a042] text-white font-medium transition-colors shadow-md active:shadow-md flex items-center justify-center"
                    onClick={() => {navigate("/oauth-success")}}    
                >
                    <Github className="h-4 w-4 mr-2" />
                    Login with GitHub
                </Button>
                <p className="text-xs text-[#a0a0a0] text-center">Connect your GitHub account to resolve conflicts</p>
                </div>
            </div>
        </div>
    </div>
  )
}
