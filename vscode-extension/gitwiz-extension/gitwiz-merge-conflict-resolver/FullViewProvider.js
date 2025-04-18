const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

class FullViewProvider {
  static get viewType() {
    return 'mergeConflictResolver.fullView';
  }

  constructor(context) {
    this.context = context;
    this.panel = null;
  }

  async showFullView() {
    if (this.panel) {
      this.panel.reveal();
      return;
    }

    this.panel = vscode.window.createWebviewPanel(
      FullViewProvider.viewType,
      'Merge Conflict Resolver',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(this.context.extensionPath, '../../', 'frontend', 'dist'))
        ],
        retainContextWhenHidden: true
      }
    );

    this.panel.onDidDispose(() => {
      this.panel = null;
    });

    try {
      const frontendDistPath = path.join(this.context.extensionPath, '../../', 'frontend', 'dist');
      
      if (!fs.existsSync(frontendDistPath)) {
        console.error(`Frontend dist path does not exist: ${frontendDistPath}`);
        this.panel.webview.html = this.getErrorHtml('Frontend build not found. Did you build the frontend?');
        return;
      }

      const htmlPath = path.join(frontendDistPath, 'index.html');
      
      if (!fs.existsSync(htmlPath)) {
        console.error(`index.html not found at: ${htmlPath}`);
        this.panel.webview.html = this.getErrorHtml('index.html not found in frontend build');
        return;
      }

      let html = fs.readFileSync(htmlPath, 'utf8');

      html = this.rewriteHtml(html, this.panel.webview, frontendDistPath);
      
      this.panel.webview.html = html;
      
      this.panel.webview.onDidReceiveMessage(
        async message => {
          console.log('Received message from webview:', message);
          
          if (message.type === 'OPEN_EXTERNAL') {
            try {
              const requestId = Math.random().toString(36).substring(2, 15);
              const port = this.context.globalState.get('auth_callback_port', 54321);
              
              const authUrl = new URL(message.url);
              authUrl.searchParams.append('callback_port', port);
              authUrl.searchParams.append('request_id', requestId);
              
              console.log(`Opening external URL with callback: ${authUrl.toString()}`);
              await vscode.env.openExternal(vscode.Uri.parse(authUrl.toString()));
              vscode.window.showInformationMessage(`Opening GitHub login page`);
            } catch (error) {
              console.error('Error opening external URL:', error);
              vscode.window.showErrorMessage('Failed to open external URL');
            }
          }
          
          if (message.type === 'GITHUB_TOKEN') {
            try {
              console.log('Received GitHub token directly from webview:', message.token);
              this.context.globalState.update('github_token', message.token);
              vscode.window.showInformationMessage('GitHub login successful!');
              
              this.panel.webview.postMessage({ 
                type: 'EXTENSION_NAVIGATE', 
                path: '/home' 
              });
            } catch (error) {
              console.error('Error processing GitHub token:', error);
              vscode.window.showErrorMessage('Failed to process GitHub token');
            }
          }
          
          if (message.type === 'NAVIGATE') {
            try {
              console.log('Navigation request received:', message.path);
              this.panel.webview.postMessage({ 
                type: 'EXTENSION_NAVIGATE', 
                path: message.path 
              });
            } catch (error) {
              console.error('Error handling navigation:', error);
              vscode.window.showErrorMessage('Failed to navigate');
            }
          }
        },
        undefined,
        this.context.subscriptions
      );
      
    } catch (error) {
      console.error('Error loading full view webview:', error);
      this.panel.webview.html = this.getErrorHtml('Error loading webview: ' + error.message);
    }
  }

  notifyTokenReceived(token) {
    if (this.panel) {
      this.panel.webview.postMessage({
        type: 'AUTH_TOKEN_RECEIVED',
        token: token
      });
      
      this.panel.webview.postMessage({ 
        type: 'EXTENSION_NAVIGATE', 
        path: '/home' 
      });
    }
  }

  rewriteHtml(html, webview, frontendDistPath) {
    return html.replace(
      /(src|href)="(.*?)"/g,
      (match, attribute, value) => {
        if (value.startsWith('http') || value.startsWith('data:') || value.startsWith('vscode-resource:')) {
          return match;
        }

        const resourcePath = path.join(frontendDistPath, value);
        const uri = webview.asWebviewUri(vscode.Uri.file(resourcePath));
        
        console.log(`Rewriting ${value} to ${uri}`);
        return `${attribute}="${uri}"`;
      }
    );
  }

  getErrorHtml(errorMessage) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #e74c3c;
          }
          .error-container {
            border: 1px solid #e74c3c;
            border-radius: 5px;
            padding: 20px;
            background-color: #fadbd8;
          }
        </style>
      </head>
      <body>
        <div class="error-container">
          <h2>Error Loading Webview</h2>
          <p>${errorMessage}</p>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = { FullViewProvider };