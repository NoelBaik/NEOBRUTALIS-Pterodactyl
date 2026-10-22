import React, { memo, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Server } from '@/api/server/getServer';
import getServerResourceUsage, { ServerPowerState, ServerStats } from '@/api/server/getServerResourceUsage';
import { bytesToString, ip, mbToBytes } from '@/lib/formatters';
import CopyOnClick from '@/components/elements/CopyOnClick';
import BlurredText from '@/components/elements/BlurredText';
import Spinner from '@/components/elements/Spinner';
import styled, { css } from 'styled-components/macro';
import { Installing, Suspended } from '@/lang';

const isAlarmState = (current: number, limit: number): boolean => limit > 0 && current / (limit * 1024 * 1024) >= 0.9;

const statusColor = (status?: ServerPowerState) =>
    !status || status === 'offline' ? '#AC2427' : status === 'running' ? '#14914E' : '#E0A100';

const Card = styled.div<{ $status: ServerPowerState | undefined }>`
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: var(--bg-secondary);
    border: 3px solid var(--border-color);
    border-radius: 4px;
    box-shadow: 4px 4px 0px var(--shadow-color);
    color: var(--text-main);
    transition: transform 0.12s ease, box-shadow 0.12s ease;

    &::before {
        content: '';
        position: absolute;
        inset: 0 auto 0 0;
        width: 8px;
        background: ${({ $status }) => statusColor($status)};
        border-right: 3px solid var(--border-color);
    }

    &:hover {
        transform: translate(-2px, -2px);
        box-shadow: 6px 6px 0px var(--shadow-color);
    }

    .head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        padding: 16px 18px 0 22px;
    }
    .name {
        font-family: var(--font-heading);
        font-size: 0.95rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.02em;
        line-height: 1.25;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: var(--text-main);
    }
    .node {
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--text-muted);
        margin-top: 3px;
    }
    .badge {
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 0.68rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        padding: 4px 9px;
        border: 2px solid var(--border-color);
        border-radius: 2px;
        box-shadow: 2px 2px 0px var(--shadow-color);
        background: ${({ $status }) => statusColor($status)};
        color: #000000;
    }
    .dot {
        width: 6px;
        height: 6px;
        border-radius: 0;
        background: #000000;
    }
    .ip {
        padding: 10px 18px 0 22px;
        font-size: 0.78rem;
        font-weight: 600;
        color: var(--text-muted);
        font-family: var(--font-mono);
        display: flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
    }
    .ip b {
        color: var(--text-main);
    }
    .ip > * {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .stats {
        display: grid;
        gap: 10px;
        padding: 14px 18px 0 22px;
    }
    .stat-label {
        display: flex;
        justify-content: space-between;
        font-size: 0.68rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        color: var(--text-muted);
        margin-bottom: 5px;
    }
    .stat-label b {
        color: var(--text-main);
    }
    .bar {
        height: 12px;
        border: 2px solid var(--border-color);
        background: var(--bg-elevated);
        overflow: hidden;
    }
    .bar > div {
        height: 100%;
        background: var(--color-primary);
        transition: width 0.4s ease;
    }
    .bar.alarm > div {
        background: var(--color-danger);
    }
    .action {
        margin: 16px 18px 18px 22px;
        margin-top: auto;
        display: block;
        text-align: center;
        padding: 10px 12px;
        border: 3px solid var(--border-color);
        border-radius: 4px;
        background: var(--color-primary);
        color: #000000;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        font-size: 0.78rem;
        text-decoration: none;
        box-shadow: 3px 3px 0px var(--shadow-color);
        transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.15s ease;

        &:hover {
            background: var(--color-primary-hover);
            transform: translate(-2px, -2px);
            box-shadow: 5px 5px 0px var(--shadow-color);
        }

        &:active {
            transform: translate(2px, 2px);
            box-shadow: none;
        }
    }
    .state {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 0.72rem;
        font-weight: 800;
        text-transform: uppercase;
        padding: 4px 10px;
        border: 2px solid var(--border-color);
        border-radius: 2px;
        background: var(--color-danger);
        color: #000000;
    }

    @media only screen and (max-width: 767px) {
        box-shadow: 3px 3px 0px var(--shadow-color);

        &::before {
            width: 6px;
        }

        .head {
            padding: 12px 14px 0 18px;
        }
        .name {
            font-size: 0.9rem;
        }
        .ip {
            padding: 6px 14px 0 18px;
            font-size: 0.7rem;
        }
        .stats {
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            padding: 10px 14px 0 18px;
        }
        .stat-label {
            flex-direction: column;
            gap: 1px;
            font-size: 0.58rem;
        }
        .bar {
            height: 10px;
        }
        .action {
            margin: 12px 14px 14px 18px;
            padding: 8px 10px;
            font-size: 0.74rem;
        }
    }
`;

type Timer = ReturnType<typeof setInterval>;

const pct = (used: number, limitMb: number) =>
    limitMb > 0 ? Math.min(100, (used / (limitMb * 1024 * 1024)) * 100) : 0;

export default ({ server }: { server: Server; className?: string }) => {
    const interval = useRef<Timer>(null) as React.MutableRefObject<Timer>;
    const [isSuspended, setIsSuspended] = useState(server.status === 'suspended');
    const [stats, setStats] = useState<ServerStats | null>(null);

    const getStats = () =>
        getServerResourceUsage(server.uuid)
            .then((data) => setStats(data))
            .catch((error) => console.error(error));

    useEffect(() => {
        setIsSuspended(stats?.isSuspended || server.status === 'suspended');
    }, [stats?.isSuspended, server.status]);

    useEffect(() => {
        if (isSuspended) return;

        getStats().then(() => {
            interval.current = setInterval(() => getStats(), 30000);
        });

        return () => {
            interval.current && clearInterval(interval.current);
        };
    }, [isSuspended]);

    const alarms = { cpu: false, memory: false, disk: false };
    if (stats) {
        alarms.cpu = server.limits.cpu === 0 ? false : stats.cpuUsagePercent >= server.limits.cpu * 0.9;
        alarms.memory = isAlarmState(stats.memoryUsageInBytes, server.limits.memory);
        alarms.disk = server.limits.disk === 0 ? false : isAlarmState(stats.diskUsageInBytes, server.limits.disk);
    }

    const diskLimit = server.limits.disk !== 0 ? bytesToString(mbToBytes(server.limits.disk)) : 'Unlimited';
    const memoryLimit = server.limits.memory !== 0 ? bytesToString(mbToBytes(server.limits.memory)) : 'Unlimited';
    const cpuLimit = server.limits.cpu !== 0 ? server.limits.cpu + ' %' : 'Unlimited';

    const cpuPercent = stats ? Math.min(100, (stats.cpuUsagePercent / (server.limits.cpu || 100)) * 100) : 0;
    const memPercent = stats ? pct(stats.memoryUsageInBytes, server.limits.memory) : 0;
    const diskPercent = stats ? pct(stats.diskUsageInBytes, server.limits.disk) : 0;

    const statusLabel = !stats || isSuspended ? '' : stats.status === 'running' ? 'Online' : stats.status === 'offline' ? 'Offline' : 'Starting';

    return (
        <Card $status={stats?.status}>
            <div className={'head'}>
                <div css={'min-width:0;'}>
                    <div className={'name'}>{server.name}</div>
                    <div className={'node'}>{server.node}</div>
                </div>
                {isSuspended ? (
                    <span className={'badge'}>{server.status === 'suspended' ? Suspended : 'Error'}</span>
                ) : statusLabel ? (
                    <span className={'badge'}>
                        <span className={'dot'} />
                        {statusLabel}
                    </span>
                ) : null}
            </div>

            <div className={'ip'}>
                <span>IP:</span>
                {server.allocations
                    .filter((alloc) => alloc.isDefault)
                    .map((allocation) => (
                        <CopyOnClick key={allocation.ip + allocation.port.toString()} text={`${allocation.alias || ip(allocation.ip)}:${allocation.port}`}>
                            <b>
                                <BlurredText>
                                    {allocation.alias || ip(allocation.ip)}:{allocation.port}
                                </BlurredText>
                            </b>
                        </CopyOnClick>
                    ))}
            </div>

            {!stats || isSuspended ? (
                <div className={'stats'}>
                    {isSuspended ? (
                        <span className={'state'}>{server.status === 'suspended' ? Suspended : 'Connection Error'}</span>
                    ) : server.isTransferring || server.status ? (
                        <span className={'state'}>
                            {server.isTransferring
                                ? 'Transferring'
                                : server.status === 'installing'
                                ? Installing
                                : server.status === 'restoring_backup'
                                ? 'Restoring Backup'
                                : 'Unavailable'}
                        </span>
                    ) : (
                        <Spinner size={'small'} />
                    )}
                </div>
            ) : (
                <div className={'stats'}>
                    <div>
                        <div className={'stat-label'}>
                            <span>CPU</span>
                            <b>{stats.cpuUsagePercent.toFixed(1)}%</b>
                        </div>
                        <div className={`bar${alarms.cpu ? ' alarm' : ''}`}>
                            <div style={{ width: `${cpuPercent}%` }} />
                        </div>
                    </div>
                    <div>
                        <div className={'stat-label'}>
                            <span>RAM</span>
                            <b>
                                {bytesToString(stats.memoryUsageInBytes)} / {memoryLimit}
                            </b>
                        </div>
                        <div className={`bar${alarms.memory ? ' alarm' : ''}`}>
                            <div style={{ width: `${memPercent}%` }} />
                        </div>
                    </div>
                    <div>
                        <div className={'stat-label'}>
                            <span>Disk</span>
                            <b>
                                {bytesToString(stats.diskUsageInBytes)} / {diskLimit}
                            </b>
                        </div>
                        <div className={`bar${alarms.disk ? ' alarm' : ''}`}>
                            <div style={{ width: `${diskPercent}%` }} />
                        </div>
                    </div>
                </div>
            )}

            <Link to={`/server/${server.id}`} className={'action'}>
                Manage Server
            </Link>
        </Card>
    );
};
