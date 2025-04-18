const vscode = require('vscode');
const { SidebarProvider } = require('./SidebarProvider');
const { FullViewProvider } = require('./FullViewProvider');
const http = require('http');
const url = require('url');

function activate(context) {
    console.log('Merge Conflict Resolver is now active!');

    const sidebarProvider = new SidebarProvider(context);
    const fullViewProvider = new FullViewProvider(context);
    
    let tokenServer = null;
    let pendingAuthRequests = new Map();
    
    function startTokenServer() {
        if (tokenServer) {
            return;
        }

        const server = http.createServer((req, res) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            
            if (req.method === 'OPTIONS') {
                res.writeHead(204);
                res.end();
                return;
            }

            const parsedUrl = url.parse(req.url, true);
            
            if (parsedUrl.pathname === '/auth-callback') {
                const token = parsedUrl.query.token;
                const requestId = parsedUrl.query.request_id;
                
                console.log(`Auth callback received. Request ID: ${requestId}, Token exists: ${!!token}`);
                
                if (!requestId || !pendingAuthRequests.has(requestId)) {
                    res.writeHead(400);
                    res.end('Invalid or expired request ID');
                    return;
                }
                
                pendingAuthRequests.delete(requestId);
                
                if (token) {
                    console.log('Received GitHub token via callback server:', token);
                    context.globalState.update('github_token', token);
                    
                    vscode.window.showInformationMessage('GitHub login successful!');
                    
                    fullViewProvider.notifyTokenReceived(token);
                    sidebarProvider.notifyTokenReceived(token);
                    
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>Authentication Successful</title>
                            <style>
                                body {
                                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;
                                    justify-content: center;
                                    height: 100vh;
                                    margin: 0;
                                    background-color: #f9f9f9;
                                    color: #333;
                                }
                                .success-container {
                                    text-align: center;
                                    padding: 2rem;
                                    background-color: white;
                                    border-radius: 8px;
                                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                                    max-width: 500px;
                                    width: 100%;
                                }
                                .success-icon {
                                    color: #28a745;
                                    font-size: 48px;
                                    margin-bottom: 1rem;
                                }
                                h1 {
                                    margin-top: 0;
                                }
                                .countdown {
                                    font-weight: bold;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="success-container">
                                <div class="success-icon">✓</div>
                                <h1>Authentication Successful!</h1>
                                <p>Your GitHub account has been connected to the VS Code extension.</p>
                                <p>This window will close automatically in <span id="countdown" class="countdown">3</span> seconds.</p>
                            </div>
                            <script>
                                let countdown = 3;
                                const countdownElement = document.getElementById('countdown');
                                
                                const interval = setInterval(() => {
                                    countdown--;
                                    countdownElement.textContent = countdown;
                                    if (countdown <= 0) {
                                        clearInterval(interval);
                                        window.close();
                                    }
                                }, 1000);
                            </script>
                        </body>
                        </html>
                    `);
                } else {
                    res.writeHead(400);
                    res.end('No token provided');
                }
            } else {
                res.writeHead(404);
                res.end('Not found');
            }
        });

        server.on('error', (e) => {
            if (e.code === 'EADDRINUSE') {
                console.log('Port 54321 in use, trying another port');
                server.listen(0);
            }
        });

        server.on('listening', () => {
            const address = server.address();
            const port = address.port;
            console.log(`Token server started on port ${port}`);
            context.globalState.update('auth_callback_port', port);
        });

        server.listen(54321);
        tokenServer = server;

        setInterval(() => {
            const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
            for (const [requestId, timestamp] of pendingAuthRequests.entries()) {
                if (timestamp < tenMinutesAgo) {
                    pendingAuthRequests.delete(requestId);
                }
            }
        }, 60 * 1000);
    }

    startTokenServer();

    let showSidebarCommand = vscode.commands.registerCommand('mergeconflictresolver.showSidebar', async () => {
        try {
            console.log('Showing sidebar command executed');
            vscode.window.showInformationMessage('Opening Merge Conflict Resolver Sidebar');
            await sidebarProvider.showSidebar();
        } catch (error) {
            console.error('Error showing sidebar:', error);
            vscode.window.showErrorMessage('Failed to open sidebar');
        }
    });

    let showFullViewCommand = vscode.commands.registerCommand('mergeconflictresolver.showFullView', async () => {
        try {
            console.log('Showing full view command executed');
            vscode.window.showInformationMessage('Opening Merge Conflict Resolver Full View');
            await fullViewProvider.showFullView();
        } catch (error) {
            console.error('Error showing full view:', error);
            vscode.window.showErrorMessage('Failed to open full view');
        }
    });

    let openExternalURLCommand = vscode.commands.registerCommand('mergeconflictresolver.openExternalURL', async (url) => {
        try {
            console.log(`Opening external URL: ${url}`);
            await vscode.env.openExternal(vscode.Uri.parse(url));
            vscode.window.showInformationMessage(`Opened URL: ${url}`);
        } catch (error) {
            console.error('Error opening external URL:', error);
            vscode.window.showErrorMessage('Failed to open external URL');
        }
    });

    let testCommand = vscode.commands.registerCommand('mergeconflictresolver.test', () => {
        console.log('Test command executed');
        vscode.window.showInformationMessage('Test command executed!');
    });
    
    let loginCommand = vscode.commands.registerCommand('mergeconflictresolver.login', async () => {
        const requestId = Math.random().toString(36).substring(2, 15);
        pendingAuthRequests.set(requestId, Date.now());
        
        const port = context.globalState.get('auth_callback_port', 54321);
        const authUrl = `http://localhost:5400/auth/login?callback_port=${port}&request_id=${requestId}`;
        
        console.log(`Opening GitHub auth URL: ${authUrl}`);
        await vscode.env.openExternal(vscode.Uri.parse(authUrl));
        vscode.window.showInformationMessage('GitHub login page opened in your browser');
    });

    context.subscriptions.push(showSidebarCommand);
    context.subscriptions.push(showFullViewCommand);
    context.subscriptions.push(openExternalURLCommand);
    context.subscriptions.push(testCommand);
    context.subscriptions.push(loginCommand);
}

function deactivate() {
    console.log('Merge Conflict Resolver is now deactivated');
}

module.exports = {
    activate,
    deactivate
};