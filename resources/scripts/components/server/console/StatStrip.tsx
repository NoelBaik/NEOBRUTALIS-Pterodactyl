import React, { useEffect, useMemo, useState } from 'react';
import { ServerContext } from '@/state/server';
import { SocketEvent, SocketRequest } from '@/components/server/events';
import useWebsocketEvent from '@/plugins/useWebsocketEvent';
import { bytesToString, mbToBytes } from '@/lib/formatters';

type Stats = Record<'memory' | 'cpu' | 'disk' | 'rx' | 'tx', number>;

const Bars = ({ pct }: { pct: number }) => {
    const on = Math.round(Math.max(0, Math.min(100, pct)) / 10);

    return (
        <div className={'brutal-bars' + (pct > 85 ? ' hot' : '')}>
            {Array.from({ length: 10 }, (_, i) => (
                <i key={i} className={i < on ? 'on' : ''} />
            ))}
        </div>
    );
};

export default () => {
    const [stats, setStats] = useState<Stats>({ memory: 0, cpu: 0, disk: 0, rx: 0, tx: 0 });
    const limits = ServerContext.useStoreState((state) => state.server.data!.limits);
    const connected = ServerContext.useStoreState((state) => state.socket.connected);
    const instance = ServerContext.useStoreState((state) => state.socket.instance);

    useEffect(() => {
        if (connected && instance) {
            instance.send(SocketRequest.SEND_STATS);
        }
    }, [instance, connected]);

    useWebsocketEvent(SocketEvent.STATS, (data: string) => {
        try {
            const s = JSON.parse(data);
            setStats({
                memory: s.memory_bytes,
                cpu: s.cpu_absolute,
                disk: s.disk_bytes,
                rx: s.network.rx_bytes,
                tx: s.network.tx_bytes,
            });
        } catch (e) {
            // ignore malformed frames
        }
    });

    const pct = useMemo(() => {
        const memLimit = mbToBytes(limits?.memory || 0);
        const diskLimit = mbToBytes(limits?.disk || 0);

        return {
            cpu: stats.cpu,
            memory: memLimit ? (stats.memory / memLimit) * 100 : 0,
            disk: diskLimit ? (stats.disk / diskLimit) * 100 : 0,
            network: 0,
        };
    }, [stats, limits]);

    const cards = [
        { title: 'CPU', value: `${stats.cpu.toFixed(1)}%`, pct: pct.cpu, sub: limits?.cpu ? `${limits.cpu}%` : '∞' },
        {
            title: 'RAM',
            value: bytesToString(stats.memory),
            pct: pct.memory,
            sub: limits?.memory ? bytesToString(mbToBytes(limits.memory)) : '∞',
        },
        {
            title: 'Disk',
            value: bytesToString(stats.disk),
            pct: pct.disk,
            sub: limits?.disk ? bytesToString(mbToBytes(limits.disk)) : '∞',
        },
        {
            title: 'Network',
            value: bytesToString(stats.rx + stats.tx),
            pct: pct.network,
            sub: '↑↓',
        },
    ];

    return (
        <div className={'brutal-stats'}>
            {cards.map((c) => (
                <div key={c.title} className={'brutal-card brutal-stat'}>
                    <h3>
                        {c.title} <span>{c.sub}</span>
                    </h3>
                    <div className={'v'}>{c.value}</div>
                    <Bars pct={c.pct} />
                </div>
            ))}
        </div>
    );
};
