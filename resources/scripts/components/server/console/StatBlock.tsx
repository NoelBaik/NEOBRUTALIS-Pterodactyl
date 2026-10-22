import React from 'react';
import Icon from '@/components/elements/Icon';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import tw from 'twin.macro';
import CopyOnClick from '@/components/elements/CopyOnClick';

interface StatBlockProps {
    title: string;
    copyOnClick?: string;
    color?: string | undefined;
    icon: IconDefinition;
    children: React.ReactNode;
    className?: string;
}

export default ({ title, copyOnClick, icon, color, className, children }: StatBlockProps) => (
    <CopyOnClick text={copyOnClick}>
        <div
            className={classNames('brutal-card', className)}
            css={tw`p-4 flex items-center gap-4`}
        >
            <div
                css={tw`w-12 h-12 flex items-center justify-center flex-none`}
                style={{
                    backgroundColor: color || 'var(--color-primary)',
                    border: '3px solid var(--border-color)',
                    boxShadow: '2px 2px 0px var(--shadow-color)',
                }}
            >
                <Icon icon={icon} css={tw`w-6 h-6 text-black`} />
            </div>
            <div css={tw`flex flex-col justify-center overflow-hidden w-full`}>
                <p className="brutal-heading" css={tw`text-xs uppercase font-black opacity-80`}>
                    {title}
                </p>
                <div css={tw`text-base font-mono font-extrabold truncate mt-0.5`}>{children}</div>
            </div>
        </div>
    </CopyOnClick>
);
