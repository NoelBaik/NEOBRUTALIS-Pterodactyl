import React, { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import tw from 'twin.macro';
import isEqual from 'react-fast-compare';

interface Props {
    icon?: IconProp;
    title: string | React.ReactNode;
    className?: string;
    children: React.ReactNode;
}

const TitledGreyBox = ({ icon, title, children, className }: Props) => (
    <div className={`brutal-card ${className || ''}`} css={tw`overflow-hidden`}>
        <div
            css={tw`px-4 py-3 flex items-center border-b-3 border-black`}
            style={{ backgroundColor: 'var(--color-primary)', color: '#000000' }}
        >
            {icon && <FontAwesomeIcon icon={icon} css={tw`mr-2.5 text-black text-sm`} />}
            {typeof title === 'string' ? (
                <p className="brutal-heading" css={tw`text-sm tracking-wider uppercase font-black text-black`}>
                    {title}
                </p>
            ) : (
                title
            )}
        </div>
        <div css={tw`p-4`}>{children}</div>
    </div>
);

export default memo(TitledGreyBox, isEqual);
