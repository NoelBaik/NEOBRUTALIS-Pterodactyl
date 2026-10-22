import React, { Suspense } from 'react';
import styled, { css, keyframes } from 'styled-components/macro';
import ErrorBoundary from '@/components/elements/ErrorBoundary';

export type SpinnerSize = 'small' | 'base' | 'large';

interface Props {
    size?: SpinnerSize;
    centered?: boolean;
    isBlue?: boolean;
}

interface Spinner extends React.FC<Props> {
    Size: Record<'SMALL' | 'BASE' | 'LARGE', SpinnerSize>;
    Suspense: React.FC<Props>;
}

// Pulsing square: cannot render oval, tiny on mobile.
const pulse = keyframes`
    0%, 100% { transform: scale(1); }
    50% { transform: scale(0.55); }
`;

const SpinnerComponent = styled.div<Props>`
    display: block;
    flex: 0 0 auto;
    align-self: center;
    box-sizing: border-box;
    width: 1.5rem !important;
    min-width: 1.5rem !important;
    max-width: 1.5rem !important;
    height: 1.5rem !important;
    min-height: 1.5rem !important;
    max-height: 1.5rem !important;
    aspect-ratio: 1 / 1;
    background-color: var(--color-primary, #ff6b00) !important;
    border: 3px solid var(--border-color, #000000) !important;
    border-radius: 0 !important;
    box-shadow: 2px 2px 0px var(--shadow-color, #000000);
    animation: ${pulse} 0.8s ease-in-out infinite;

    ${(props) =>
        props.size === 'small'
            ? css`
                  width: 0.875rem !important;
                  min-width: 0.875rem !important;
                  max-width: 0.875rem !important;
                  height: 0.875rem !important;
                  min-height: 0.875rem !important;
                  max-height: 0.875rem !important;
                  border-width: 2px !important;
                  box-shadow: 1px 1px 0px var(--shadow-color, #000000);
              `
            : props.size === 'large'
            ? css`
                  width: 2.5rem !important;
                  min-width: 2.5rem !important;
                  max-width: 2.5rem !important;
                  height: 2.5rem !important;
                  min-height: 2.5rem !important;
                  max-height: 2.5rem !important;
                  border-width: 4px !important;
                  box-shadow: 4px 4px 0px var(--shadow-color, #000000);
              `
            : null};

    @media (max-width: 640px) {
        ${(props) =>
            props.size === 'large' &&
            css`
                width: 2rem !important;
                min-width: 2rem !important;
                max-width: 2rem !important;
                height: 2rem !important;
                min-height: 2rem !important;
                max-height: 2rem !important;
            `};
    }
`;

const Centered = styled.div<{ large?: boolean }>`
    display: flex;
    width: 100%;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    min-height: ${(props) => (props.large ? '30vh' : '4rem')};
    padding: 1rem;
`;

const Spinner: Spinner = ({ centered, ...props }) =>
    centered ? (
        <Centered large={props.size === 'large'}>
            <SpinnerComponent {...props} />
        </Centered>
    ) : (
        <SpinnerComponent {...props} />
    );
Spinner.displayName = 'Spinner';

Spinner.Size = {
    SMALL: 'small',
    BASE: 'base',
    LARGE: 'large',
};

Spinner.Suspense = ({ children, centered = true, size = Spinner.Size.LARGE, ...props }) => (
    <Suspense fallback={<Spinner centered={centered} size={size} {...props} />}>
        <ErrorBoundary>{children}</ErrorBoundary>
    </Suspense>
);
Spinner.Suspense.displayName = 'Spinner.Suspense';

export default Spinner;
