import { useState, useEffect } from "react"
import { CheckCircle } from "lucide-react"
import { useLocation } from "react-router-dom"
import Logo from "../../../public/assets/logo_with_bg.png"

export function LoginSuccess() {
  const [countdown, setCountdown] = useState(59)
  const [status, setStatus] = useState("Processing")
  const location = useLocation()

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const hashParams = new URLSearchParams(location.hash.slice(1))

    const token = searchParams.get("token") || hashParams.get("token")
    const callbackPort = searchParams.get("callback_port") || hashParams.get("callback_port")
    const requestId = searchParams.get("request_id") || hashParams.get("request_id")

    console.log("Token from URL:", token)
    console.log("Callback port:", callbackPort)
    console.log("Request ID:", requestId)

    const storedToken = localStorage.getItem("github_token")
    const actualToken = token || storedToken

    if (actualToken) {
      localStorage.setItem("github_token", actualToken)

      if (callbackPort && requestId) {
        setStatus("Sending to VS Code...")
        const callbackUrl = `http://localhost:${callbackPort}/auth-callback?token=${encodeURIComponent(actualToken)}&request_id=${encodeURIComponent(requestId)}`

        fetch(callbackUrl)
          .then((response) => {
            if (response.ok) {
              setStatus("Successfully connected to VS Code")
              console.log("Token sent to VS Code extension server")
            } else {
              throw new Error(`Server returned ${response.status}`)
            }
          })
          .catch((error) => {
            setStatus("Error connecting to VS Code")
            console.error("Failed to send token to VS Code extension server:", error)
            tryAlternativeMethods(actualToken)
          })
      } else {
        tryAlternativeMethods(actualToken)
      }
    }

    function tryAlternativeMethods(token) {
      try {
        if (typeof window.acquireVsCodeApi === "function") {
          const vscode = window.acquireVsCodeApi()
          vscode.postMessage({
            type: "GITHUB_TOKEN",
            token: token,
          })
          setStatus("Connected via VS Code API")
          console.log("Message sent via VS Code API")
        } else if (window.parent !== window) {
          window.parent.postMessage(
            {
              type: "GITHUB_TOKEN",
              token: token,
            },
            "*",
          )
          setStatus("Message sent to parent")
          console.log("Message sent to parent window")
        } else if (window.opener) {
          window.opener.postMessage(
            {
              type: "GITHUB_TOKEN",
              token: token,
            },
            "*",
          )
          setStatus("Message sent to opener")
          console.log("Message sent to opener window")
          setStatus("Authentication Complete")
        } else {
          setStatus("Authentication complete")
          console.log("No suitable message target found, but token stored locally")
        }
      } catch (error) {
        console.error("Failed to send message:", error)
        setStatus("Authentication complete")
      }
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (window.opener) {
            window.close()
          }
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [location])


  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100 items-center justify-center">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-[6px] mt-10 mb-10 border border-gray-700 shadow-xl">
        <div className="flex flex-col items-center mb-6">
          <img src={Logo || "/placeholder.svg"} alt="GitWiz Logo" className="h-24 w-24 mb-4 rounded-[6px]" />
          <h1 className="text-2xl font-bold text-white text-center">GitWiz</h1>
          <p className="text-sm text-gray-300 text-center">Merge Conflict Helper</p>
        </div>

        <div className="flex flex-col items-center mb-2">
          <div className="bg-green-500/20 p-4 rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Login Successful!</h2>
          <p className="text-center text-gray-300 mb-4">
            You have successfully connected your GitHub account to GitWiz.
          </p>
          <div className="text-center text-green-400 text-sm font-medium mb-2">Status: {status}</div>
          <p className="text-center text-gray-300 text-sm">Please return to VS Code to continue using GitWiz.</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center">
            <div className="bg-gray-700 px-4 py-2 rounded-full">
              <span className="text-sm font-mono text-gray-200">This window will close in {formatTime(countdown)}</span>
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            {countdown > 0
              ? "You can safely return to VS Code now. Your GitHub account has been connected successfully."
              : "You can now close this window manually if it doesn't close automatically."}
          </p>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-700 text-xs text-center text-gray-400">
          GitWiz v1.2.0 • © 2025 • Secure Authentication
        </div>
      </div>
    </div>
  )
}

export default LoginSuccess