import React, { useState } from 'react';
import styled from 'styled-components/macro';

const Wrapper = styled.span<{ $revealed: boolean }>`
    filter: ${({ $revealed }) => ($revealed ? 'none' : 'blur(5px)')};
    cursor: pointer;
    user-select: ${({ $revealed }) => ($revealed ? 'auto' : 'none')};
    transition: filter 0.15s ease;
`;

// First click reveals the text and swallows the event so a surrounding
// CopyOnClick/Link does not fire; later clicks behave normally.
export default ({ children }: { children: React.ReactNode }) => {
    const [revealed, setRevealed] = useState(false);

    return (
        <Wrapper
            $revealed={revealed}
            onClick={(e) => {
                if (revealed) return;
                e.preventDefault();
                e.stopPropagation();
                setRevealed(true);
            }}
        >
            {children}
        </Wrapper>
    );
};
