import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const getVSCodeAPI = () =>
  typeof window !== "undefined" && typeof window.acquireVsCodeApi === "function"
    ? window.acquireVsCodeApi()
    : null;

export function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    const vscode = getVSCodeAPI();

    const loginUrl = "http://localhost:5400/auth/login";

    if (vscode) {
      vscode.postMessage({ type: "OPEN_EXTERNAL", url: loginUrl });
    } else {
      window.open(loginUrl, "_blank");
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.slice(1));

    const token = searchParams.get("token") || hashParams.get("token");

    if (token) {
      localStorage.setItem("github_token", token);
      const vscode = getVSCodeAPI();

      if (vscode) {
        vscode.postMessage({ type: "GITHUB_TOKEN", token });
        console.log("Token sent to VS Code extension");
      }

      navigate("/oauth-success");
    }

    const handleMessage = (event) => {
      const { data } = event;

      if (data?.type === "AUTH_TOKEN_RECEIVED") {
        localStorage.setItem("github_token", data.token);
        navigate("/home");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [navigate]);

  return (
    <div className="flex flex-col h-screen p-3 bg-[#24292e] text-[#f5f5f5] w-full overflow-hidden">
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
            <Button
              className="w-[80%] bg-[#2dba4e] rounded hover:bg-[#25a042] text-white font-medium transition-colors shadow-md active:shadow-md flex items-center justify-center"
              onClick={handleLogin}
            >
              <Github className="h-4 w-4 mr-2" />
              Login with GitHub
            </Button>
            <p className="text-xs text-[#a0a0a0] text-center">
              Connect your GitHub account to resolve conflicts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
