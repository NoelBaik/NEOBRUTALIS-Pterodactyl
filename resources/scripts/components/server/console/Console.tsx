import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ITerminalOptions, Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { SearchAddon } from 'xterm-addon-search';
import { SearchBarAddon } from 'xterm-addon-search-bar';
import { WebLinksAddon } from 'xterm-addon-web-links';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import { ServerContext } from '@/state/server';
import { usePermissions } from '@/plugins/usePermissions';
import useEventListener from '@/plugins/useEventListener';
import { debounce } from 'debounce';
import { usePersistedState } from '@/plugins/usePersistedState';
import { SocketEvent, SocketRequest } from '@/components/server/events';
import tw from 'twin.macro';
import 'xterm/css/xterm.css';

const theme = {
    background: '#0A0A0A',
    cursor: '#FF6B00',
    black: '#0A0A0A',
    red: '#EF4444',
    green: '#22C55E',
    yellow: '#FACC15',
    blue: '#3B82F6',
    magenta: '#EC4899',
    cyan: '#06B6D4',
    white: '#FFFFFF',
    brightBlack: '#525252',
    brightRed: '#F87171',
    brightGreen: '#4ADE80',
    brightYellow: '#FDE047',
    brightBlue: '#60A5FA',
    brightMagenta: '#F472B6',
    brightCyan: '#22D3EE',
    brightWhite: '#FFFFFF',
    selection: 'rgba(255, 107, 0, 0.35)',
};

const terminalProps: ITerminalOptions = {
    disableStdin: true,
    cursorStyle: 'block',
    allowTransparency: false,
    fontSize: 13,
    fontFamily: "'JetBrains Mono', monospace",
    rows: 30,
    theme: theme,
};

export default () => {
    const TERMINAL_PRELUDE = '\u001b[1m\u001b[33m[PTERODACTYL BRUTAL]$ \u001b[0m';
    const ref = useRef<HTMLDivElement>(null);
    const terminal = useMemo(() => new Terminal({ ...terminalProps }), []);
    const fitAddon = new FitAddon();
    const searchAddon = new SearchAddon();
    const searchBar = new SearchBarAddon({ searchAddon });
    const webLinksAddon = new WebLinksAddon();
    const { connected, instance } = ServerContext.useStoreState((state) => state.socket);
    const [canSendCommands] = usePermissions(['control.console']);
    const serverId = ServerContext.useStoreState((state) => state.server.data!.id);
    const isTransferring = ServerContext.useStoreState((state) => state.server.data!.isTransferring);
    const [history, setHistory] = usePersistedState<string[]>(`${serverId}:command_history`, []);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [command, setCommand] = useState('');
    const commandHistory = history ?? [];

    const handleConsoleOutput = (line: string, prelude = false) =>
        terminal.writeln((prelude ? TERMINAL_PRELUDE : '') + line.replace(/(?:\r\n|\r|\n)$/im, '') + '\u001b[0m');

    const executeCommand = (raw: string) => {
        const value = raw.trim();
        if (!value || !instance || !connected) {
            return;
        }

        setHistory((prevHistory) => [value, ...(prevHistory ?? [])].slice(0, 32));
        setHistoryIndex(-1);
        instance.send(SocketRequest.SEND_COMMAND, value);
        setCommand('');
    };

    const handleCommandKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp') {
            const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
            setHistoryIndex(newIndex);
            setCommand(commandHistory[newIndex] || '');
            e.preventDefault();
        }
        if (e.key === 'ArrowDown') {
            const newIndex = Math.max(historyIndex - 1, -1);
            setHistoryIndex(newIndex);
            setCommand(newIndex === -1 ? '' : commandHistory[newIndex] || '');
            e.preventDefault();
        }
        if (e.key === 'Enter') {
            e.preventDefault();
            executeCommand(command);
        }
    };

    useEffect(() => {
        if (connected && ref.current && !terminal.element) {
            terminal.loadAddon(fitAddon);
            terminal.loadAddon(searchAddon);
            terminal.loadAddon(searchBar);
            terminal.loadAddon(webLinksAddon);
            terminal.open(ref.current);
            fitAddon.fit();
        }
    }, [terminal, connected]);

    const fit = debounce(() => {
        fitAddon.fit();
    }, 100);

    useEventListener('resize', () => fit());

    useEffect(() => {
        const listeners: Record<string, (s: string) => void> = {
            [SocketEvent.STATUS]: (status) => handleConsoleOutput(`Server marked as ${status}...`, true),
            [SocketEvent.CONSOLE_OUTPUT]: (line) => handleConsoleOutput(line),
            [SocketEvent.INSTALL_OUTPUT]: (line) => handleConsoleOutput(line, true),
            [SocketEvent.TRANSFER_LOGS]: (line) => handleConsoleOutput(line),
        };
        if (connected && instance) {
            if (!isTransferring) terminal.clear();
            Object.keys(listeners).forEach((key: string) => {
                instance.addListener(key, listeners[key]);
            });
            instance.send(SocketRequest.SEND_LOGS);
        }
        return () => {
            if (instance) {
                Object.keys(listeners).forEach((key: string) => {
                    instance.removeListener(key, listeners[key]);
                });
            }
        };
    }, [connected, instance]);

    return (
        <div className="brutal-card" css={tw`flex flex-col overflow-hidden`}>
            <div
                css={tw`flex items-center justify-between px-4 py-2.5 border-b-3 border-black`}
                style={{ backgroundColor: 'var(--color-primary)' }}
            >
                <span className="brutal-heading" css={tw`text-sm text-black font-black uppercase`}>
                    SERVER TERMINAL // LIVE STREAM
                </span>
                <div css={tw`flex items-center gap-1.5`}>
                    <span css={tw`w-3.5 h-3.5 bg-white border-2 border-black inline-block`} />
                    <span css={tw`w-3.5 h-3.5 bg-black border-2 border-black inline-block`} />
                </div>
            </div>

            <div css={tw`relative bg-[#0A0A0A] p-3 min-h-[380px]`}>
                <SpinnerOverlay visible={!connected} />
                <div ref={ref} css={tw`h-full w-full font-mono`} />
            </div>

            {canSendCommands && (
                <div
                    css={tw`flex items-stretch border-t-3 border-black`}
                    style={{ backgroundColor: 'var(--bg-elevated)' }}
                >
                    <div
                        css={tw`px-4 flex items-center justify-center font-mono font-black text-black border-r-3 border-black`}
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        CMD &gt;
                    </div>
                    <input
                        type={'text'}
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        placeholder={'KETIK COMMAND SERVER LALU TEKAN ENTER...'}
                        aria-label={'Console command input.'}
                        disabled={!instance || !connected}
                        onKeyDown={handleCommandKeyDown}
                        autoCorrect={'off'}
                        autoCapitalize={'none'}
                        css={tw`w-full px-4 py-3 font-mono text-sm font-bold outline-none border-0 shadow-none`}
                        style={{
                            backgroundColor: 'var(--bg-elevated)',
                            color: 'var(--text-main)',
                            border: 'none',
                            boxShadow: 'none',
                        }}
                    />
                    <button
                        type={'button'}
                        onClick={() => executeCommand(command)}
                        disabled={!instance || !connected || !command.trim()}
                        aria-label={'Kirim command'}
                        css={tw`px-5 font-mono font-black text-black border-l-3 border-black uppercase`}
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        Kirim
                    </button>
                </div>
            )}
        </div>
    );
};
