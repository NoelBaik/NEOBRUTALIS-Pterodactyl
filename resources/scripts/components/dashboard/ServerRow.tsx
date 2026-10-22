import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthernet, faHdd, faMemory, faMicrochip, faServer } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Server } from '@/api/server/getServers';
import getServerResourceUsage, { ServerPowerState, ServerStats } from '@/api/server/getServerResourceUsage';
import { bytesToString, ip, mbToBytes } from '@/lib/formatters';
import tw from 'twin.macro';
import BlurredText from '@/components/elements/BlurredText';

const isAlarmState = (current: number, limit: number): boolean => limit > 0 && current / (limit * 1024 * 1024) >= 0.9;

const SolidBar = ({ percent, isAlarm }: { percent: number; isAlarm?: boolean }) => {
    const clamped = Math.min(100, Math.max(0, Math.round(percent)));
    return (
        <div className="brutal-progress-track" css={tw`mt-1.5`}>
            <div
                className={`brutal-progress-fill ${isAlarm ? 'is-danger' : clamped > 75 ? 'is-warning' : ''}`}
                style={{ width: `${clamped}%` }}
            />
        </div>
    );
};

export default ({ server, className }: { server: Server; className?: string }) => {
    const interval = useRef<any>(null);
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

    const status: ServerPowerState = stats?.status || 'offline';
    const cpuLimit = server.limits.cpu;
    const cpuPercent = cpuLimit > 0 && stats ? (stats.cpuUsagePercent / cpuLimit) * 100 : stats?.cpuUsagePercent || 0;
    const memLimitBytes = mbToBytes(server.limits.memory);
    const memPercent = memLimitBytes > 0 && stats ? (stats.memoryUsageInBytes / memLimitBytes) * 100 : 0;
    const diskLimitBytes = mbToBytes(server.limits.disk);
    const diskPercent = diskLimitBytes > 0 && stats ? (stats.diskUsageInBytes / diskLimitBytes) * 100 : 0;

    const getStatusBadge = () => {
        if (isSuspended) return <span className="brutal-badge brutal-badge-danger">SUSPENDED</span>;
        if (server.isTransferring) return <span className="brutal-badge brutal-badge-warning">TRANSFERRING</span>;
        if (server.status === 'installing') return <span className="brutal-badge brutal-badge-warning">INSTALLING</span>;
        if (status === 'running') return <span className="brutal-badge brutal-badge-online">ONLINE</span>;
        if (status === 'starting') return <span className="brutal-badge brutal-badge-starting">STARTING</span>;
        return <span className="brutal-badge brutal-badge-offline">OFFLINE</span>;
    };

    return (
        <Link
            to={`/server/${server.id}`}
            className={`brutal-card brutal-card-interactive block no-underline p-5 ${className || ''}`}
            style={{ width: '100%', maxWidth: 'none' }}
        >
            <div css={tw`flex flex-col lg:flex-row lg:items-center justify-between gap-4`}>
                <div css={tw`flex items-start gap-4 min-w-[260px]`}>
                    <div
                        css={tw`w-12 h-12 flex items-center justify-center flex-none`}
                        style={{
                            backgroundColor: 'var(--color-primary)',
                            border: '3px solid var(--border-color)',
                            boxShadow: '2px 2px 0px var(--shadow-color)',
                        }}
                    >
                        <FontAwesomeIcon icon={faServer} css={tw`text-black text-lg`} />
                    </div>
                    <div>
                        <div css={tw`flex items-center gap-2.5 flex-wrap`}>
                            <h3 className="brutal-heading" css={tw`text-lg font-black m-0`}>
                                {server.name}
                            </h3>
                            {getStatusBadge()}
                        </div>
                        <p css={tw`text-xs font-mono font-bold mt-1 opacity-80`}>
                            <FontAwesomeIcon icon={faEthernet} css={tw`mr-1.5`} />
                            {server.allocations
                                .filter((alloc) => alloc.isDefault)
                                .map((allocation) => (
                                    <React.Fragment key={allocation.ip + allocation.port.toString()}>
                                        <BlurredText>
                                            {ip(allocation.ip)}:{allocation.port}
                                        </BlurredText>
                                    </React.Fragment>
                                ))}
                        </p>
                        {!!server.description && (
                            <p css={tw`text-xs font-semibold mt-1 line-clamp-1 opacity-90`}>{server.description}</p>
                        )}
                    </div>
                </div>

                <div css={tw`grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:max-w-[540px]`}>
                    <div
                        css={tw`p-2.5`}
                        style={{
                            backgroundColor: 'var(--bg-elevated)',
                            border: '2px solid var(--border-color)',
                        }}
                    >
                        <div css={tw`flex justify-between text-xs font-extrabold uppercase`}>
                            <span>
                                <FontAwesomeIcon icon={faMicrochip} css={tw`mr-1`} /> CPU
                            </span>
                            <span css={tw`font-mono`}>{stats ? `${stats.cpuUsagePercent.toFixed(1)}%` : '0.0%'}</span>
                        </div>
                        <SolidBar percent={cpuPercent} isAlarm={cpuPercent >= 90} />
                    </div>

                    <div
                        css={tw`p-2.5`}
                        style={{
                            backgroundColor: 'var(--bg-elevated)',
                            border: '2px solid var(--border-color)',
                        }}
                    >
                        <div css={tw`flex justify-between text-xs font-extrabold uppercase`}>
                            <span>
                                <FontAwesomeIcon icon={faMemory} css={tw`mr-1`} /> RAM
                            </span>
                            <span css={tw`font-mono`}>
                                {stats ? bytesToString(stats.memoryUsageInBytes) : '0 B'}
                            </span>
                        </div>
                        <SolidBar
                            percent={memPercent}
                            isAlarm={stats ? isAlarmState(stats.memoryUsageInBytes, server.limits.memory) : false}
                        />
                    </div>

                    <div
                        css={tw`p-2.5`}
                        style={{
                            backgroundColor: 'var(--bg-elevated)',
                            border: '2px solid var(--border-color)',
                        }}
                    >
                        <div css={tw`flex justify-between text-xs font-extrabold uppercase`}>
                            <span>
                                <FontAwesomeIcon icon={faHdd} css={tw`mr-1`} /> DISK
                            </span>
                            <span css={tw`font-mono`}>
                                {stats ? bytesToString(stats.diskUsageInBytes) : '0 B'}
                            </span>
                        </div>
                        <SolidBar
                            percent={diskPercent}
                            isAlarm={stats ? isAlarmState(stats.diskUsageInBytes, server.limits.disk) : false}
                        />
                    </div>
                </div>
            </div>
        </Link>
    );
};
