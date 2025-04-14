import { useState, useEffect } from "react";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

export function LoginSuccess() {
  const [countdown, setCountdown] = useState(59);
  const location = useLocation();
  const vscode = window.acquireVsCodeApi();


  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");

    console.log("Token from URL:", token);

    if (token && window.opener) {
        vscode.postMessage({
            type: 'GITHUB_TOKEN',
            token: token
        });
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          window.close();
          clearInterval(interval);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [location]);

  const handleRedirect = () => {
    window.close();
  };

  return (
    <div className="flex min-h-screen bg-[#24292e] text-[#f5f5f5] rounded-[6px] items-center justify-center">
      <div className="w-full max-w-md p-8 bg-[#2b3137] rounded-lg border border-[#3c3c3c] shadow-xl">
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-13%20190209-0xtuHMlkOcyqEONeiqCc3KQohvTdMz.png"
            alt="GitWiz Logo"
            className="h-24 w-24 mb-4"
          />
          <h1 className="text-2xl font-bold text-white text-center">GitWiz</h1>
          <p className="text-sm text-[#e0e0e0] text-center">Merge Conflict Helper</p>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#2dba4e]/20 p-4 rounded-full mb-4">
            <CheckCircle className="h-16 w-16 text-[#2dba4e]" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Login Successful!</h2>
          <p className="text-center text-[#e0e0e0] mb-4">
            You have successfully connected your GitHub account to GitWiz.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <Button
            onClick={handleRedirect}
            className="w-full bg-[#2dba4e] hover:bg-[#25a042] text-white font-medium transition-colors shadow-md hover:shadow-lg rounded active:shadow-md mb-3"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to VS Code ({countdown}s)
          </Button>
          <p className="text-xs text-[#a0a0a0] text-center">
            You will be automatically redirected back to VS Code in {countdown} seconds.
          </p>
        </div>

        <div className="mt-8 pt-4 border-t border-[#3c3c3c] text-xs text-center text-[#a0a0a0]">
          GitWiz v1.2.0 • © 2025 • Secure Authentication
        </div>
      </div>
    </div>
  );
}

export default LoginSuccess;
