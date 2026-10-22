import React, { forwardRef } from 'react';
import { Form } from 'formik';
import styled from 'styled-components/macro';
import FlashMessageRender from '@/components/FlashMessageRender';
import tw from 'twin.macro';

type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    title?: string;
};

const Container = styled.div`
    ${tw`w-full max-w-md mx-auto`};
`;

const Card = styled.div`
    background-color: var(--bg-secondary);
    border: 3px solid var(--border-color);
    box-shadow: 12px 12px 0px var(--shadow-color);
`;

const Header = styled.div`
    background-color: var(--color-primary);
    border-bottom: 3px solid var(--border-color);
    padding: 1.25rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
`;

const Stamp = styled.span`
    ${tw`text-xs font-black uppercase`};
    border: 2px solid var(--border-color);
    background-color: var(--bg-main);
    color: var(--text-main);
    padding: 0.15rem 0.5rem;
    box-shadow: 2px 2px 0px var(--shadow-color);
`;

const logoUrl = () =>
    (document.querySelector('link[rel="icon"]') as HTMLLinkElement | null)?.href ||
    (document.querySelector('link[rel="shortcut icon"]') as HTMLLinkElement | null)?.href ||
    '';

export default forwardRef<HTMLFormElement, Props>(({ title, ...props }, ref) => (
    <Container>
        <FlashMessageRender css={tw`mb-4`} />
        <Card>
            <Header>
                {logoUrl() && (
                    <img
                        src={logoUrl()}
                        alt={'logo'}
                        css={tw`w-10 h-10 object-contain`}
                        style={{ border: '2px solid var(--border-color)' }}
                    />
                )}
                <div css={tw`flex flex-col leading-none`}>
                    <h2 className="brutal-heading" css={tw`text-xl text-black font-black uppercase m-0`}>
                        {title || 'Login'}
                    </h2>
                    <Stamp css={tw`mt-2 self-start`}>Secure Area</Stamp>
                </div>
            </Header>
            <Form {...props} ref={ref}>
                <div css={tw`p-6 md:p-8`}>{props.children}</div>
            </Form>
        </Card>
        <p css={tw`text-center text-xs font-black uppercase mt-6 tracking-widest`} style={{ color: 'var(--text-muted)' }}>
            Pterodactyl &bull; Neobrutalism Edition
        </p>
    </Container>
));
