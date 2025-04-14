const vscode = require('vscode');
const { SidebarProvider } = require('./SidebarProvider');
const { FullViewProvider } = require('./FullViewProvider');
const axios = require('axios');
const path = require('path');

function activate(context) {
    console.log('Merge Conflict Resolver is now active!');

    const sidebarProvider = new SidebarProvider(context);
    const fullViewProvider = new FullViewProvider(context);

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

    let showWebviewCommand = vscode.commands.registerCommand('mergeconflictresolver.showWebview', () => {
        const panel = vscode.window.createWebviewPanel(
            'mergeConflictResolverWebview',
            'Merge Conflict Resolver',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))], // Point to where your React app is built
            }
        );

        panel.webview.html = getWebviewContent(context, panel.webview);

        panel.webview.onDidReceiveMessage((message) => {
            switch (message.type) {
                case 'GITHUB_TOKEN':
                    const token = message.token;
                    console.log('Received GitHub Token:', token);
                    handleGitHubToken(token);
                    return;
            }
        });
    });

    context.subscriptions.push(showSidebarCommand);
    context.subscriptions.push(showFullViewCommand);
    context.subscriptions.push(showWebviewCommand);
}

async function handleGitHubToken(token) {
    if (!token) {
        vscode.window.showErrorMessage('No GitHub Token received');
        return;
    }

    try {
        const response = await axios.post('http://localhost:5000/api/token', { token });
        console.log('Backend Response:', response.data);
        vscode.window.showInformationMessage('GitHub Token successfully processed');
    } catch (error) {
        console.error('Error sending token to backend:', error);
        vscode.window.showErrorMessage('Failed to process GitHub Token');
    }
}

function getWebviewContent(context, webview) {
    const reactAppPathOnDisk = vscode.Uri.file(path.join(context.extensionPath, '../../dist/index.html')); 
    const reactAppUri = webview.asWebviewUri(reactAppPathOnDisk);
    return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Merge Conflict Resolver</title>
        </head>
        <body>
            <iframe src="${reactAppUri}" width="100%" height="100%"></iframe>
        </body>
        </html>`;
}

function deactivate() {
    console.log('Merge Conflict Resolver is now deactivated');
}

module.exports = {
    activate,
    deactivate
};
