const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

class SidebarProvider {
  static get viewType() {
    return 'mergeConflictResolver.sidebar';
  }

  constructor(context) {
    this.context = context;
  }

  showSidebar() {
    const panel = vscode.window.createWebviewPanel(
      SidebarProvider.viewType,
      'Merge Conflict Resolver Sidebar',
      vscode.ViewColumn.Two,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(this.context.extensionPath, '../../', 'frontend', 'dist'))
        ]
      }
    );

    try {
      const frontendDistPath = path.join(this.context.extensionPath, '../../', 'frontend', 'dist');
      
      // Check if frontend build exists
      if (!fs.existsSync(frontendDistPath)) {
        console.error(`Frontend dist path does not exist: ${frontendDistPath}`);
        panel.webview.html = this.getErrorHtml('Frontend build not found. Did you build the frontend?');
        return;
      }

      const htmlPath = path.join(frontendDistPath, 'index.html');
      
      // Check if index.html exists
      if (!fs.existsSync(htmlPath)) {
        console.error(`index.html not found at: ${htmlPath}`);
        panel.webview.html = this.getErrorHtml('index.html not found in frontend build');
        return;
      }

      let html = fs.readFileSync(htmlPath, 'utf8');

      // Fix paths for scripts/styles for VS Code webview
      html = this.rewriteHtml(html, panel.webview, frontendDistPath);
      
      panel.webview.html = html;
      
      // Handle messages from the webview
      panel.webview.onDidReceiveMessage(
        message => {
          console.log('Received message from webview:', message);
          // Handle messages from the webview here
        },
        undefined,
        this.context.subscriptions
      );
      
    } catch (error) {
      console.error('Error loading sidebar webview:', error);
      panel.webview.html = this.getErrorHtml('Error loading webview: ' + error.message);
    }
  }

  rewriteHtml(html, webview, frontendDistPath) {
    // Use regex to find all script and link tags with src/href attributes
    return html.replace(
      /(src|href)="(.*?)"/g,
      (match, attribute, value) => {
        // Skip absolute URLs or data URIs
        if (value.startsWith('http') || value.startsWith('data:') || value.startsWith('vscode-resource:')) {
          return match;
        }

        // Create a URI for the resource
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

module.exports = { SidebarProvider };