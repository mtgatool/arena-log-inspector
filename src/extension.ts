// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import database from "./database.json";
import loc from "./loc.json";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const EnglishLoc = (loc as any[]).filter(l => l.isoCode === "en-US")[0];
	vscode.window.showInformationMessage('MTG Arena Tool Log inspector is now running');

	let disposable = vscode.commands.registerCommand('arena-log-inspector.load', () => {
		//
	});

	let anotherDisposable = vscode.commands.registerCommand('arena-log-inspector.unload', () => {
		deactivate();
		console.log('Bye bye!');
	});


	context.subscriptions.push(disposable);
	context.subscriptions.push(anotherDisposable);

	vscode.languages.registerHoverProvider('arena-log', {
		provideHover(document, position, token) {
			const range = document.getWordRangeAtPosition(position);
			const word = document.getText(range);

			const filteredAbs = Object.keys(database.abilities).filter(abId => word === abId);
			if (filteredAbs.length > 0) {
				const abid = filteredAbs[0];
				const abs = database.abilities as Record<string, string>;
				const ability = abs[abid].replace(" o", "");

				const md = new vscode.MarkdownString(`ability: **${ability}**`);
				md.isTrusted = true;
				return new vscode.Hover(md);
			}

			const filteredCards = Object.keys(database.cards).filter(grpId => word === grpId);
			if (filteredCards.length > 0) {
				const grpId = filteredCards[0];
				const allCards = database.cards as Record<string, any>;
				const card = allCards[grpId];

				const md = new vscode.MarkdownString(
					`**${card.name}** \r\n\r\n cost: ${card.cost.join("").toUpperCase()}\r\n\r\ntype: ${card.type}\r\n\r\n![${card.name}](https://img.scryfall.com/cards${card.images.small})`
				);
				md.isTrusted = true;
				return new vscode.Hover(md);
			}

			const filteredLoc = EnglishLoc.keys.filter((l: any) => word === l.id + "");
			if (filteredLoc.length > 0) {
				const loc = filteredLoc[0];

				const md = new vscode.MarkdownString(`text: **${loc.text}**`);
				md.isTrusted = true;
				return new vscode.Hover(md);
			}
		}
	});

}

// this method is called when your extension is deactivated
export function deactivate() {}
