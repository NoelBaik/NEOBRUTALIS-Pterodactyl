import React from 'react';
import { useStoreState } from 'easy-peasy';
import tw from 'twin.macro';

type Props = Readonly<{
    byKey?: string;
    className?: string;
}>;

const FlashMessageRender = ({ byKey, className }: Props) => {
    const flashes = useStoreState((state) =>
        state.flashes.items.filter((flash) => (byKey ? flash.key === byKey : true))
    );

    return flashes.length ? (
        <div className={className}>
            {flashes.map((flash, index) => (
                <React.Fragment key={flash.id || flash.type + flash.message}>
                    {index > 0 && <div css={tw`mt-2`} />}
                    <div
                        css={tw`p-4 font-bold flex items-center gap-3`}
                        style={{
                            backgroundColor:
                                flash.type === 'error'
                                    ? 'var(--color-danger)'
                                    : flash.type === 'success'
                                    ? 'var(--color-success)'
                                    : flash.type === 'warning'
                                    ? 'var(--color-warning)'
                                    : 'var(--color-primary)',
                            color: '#000000',
                            border: '3px solid var(--border-color)',
                            borderRadius: '4px',
                            boxShadow: 'var(--shadow-brutal)',
                        }}
                    >
                        <span className="brutal-heading" css={tw`px-2 py-0.5 bg-white border-2 border-black text-xs`}>
                            {flash.title || flash.type.toUpperCase()}
                        </span>
                        <span>{flash.message}</span>
                    </div>
                </React.Fragment>
            ))}
        </div>
    ) : null;
};

export default FlashMessageRender;
