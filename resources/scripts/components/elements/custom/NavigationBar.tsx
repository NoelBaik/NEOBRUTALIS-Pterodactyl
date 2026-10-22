import styled from 'styled-components/macro';
import tw from 'twin.macro';

const NavigationBar = styled.div`
    width: clamp(240px, 22vw, 323px);
    flex: 0 0 auto;
    background-color: var(--secondary);
    border-right: 3px solid var(--border-color);
    height: 100vh;
    position: sticky;
    top: 0;
    transition: width 0.3s;
    z-index: 40;
    display: flex;
    flex-direction: column;

    .navBackdrop {
        display: none;
    }

    #logo {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 14px 0;
    }
    #logo > a {
        padding: 0 !important;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 10px;
        flex: 1 1 auto;
        min-width: 0;
    }
    #logo .collapseBtn,
    #logo .menuBtn {
        display: none;
    }
    #logo span {
        padding-left: 0;
        font-size: 1.15rem;
        font-weight: 500;
        line-height: 1.2;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    #logo img {
        width: 40px;
        height: 40px;
        max-width: 40px !important;
        object-fit: contain;
        border-radius: 5px !important;
        flex: 0 0 auto;
    }

    & > .navBody {
        margin-left: 0;
        padding: 0 10px 10px;
        overflow-y: auto;
        overflow-x: hidden;
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        min-height: 0;
    }

    & a, & button, & .navigation-link {
        ${tw`no-underline text-neutral-300 cursor-pointer transition-all duration-150`};
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 40px;
        padding: 8px 10px;
        border: 0;
        background: none;
        font: inherit;
        text-align: left;
        border-radius: var(--borderradius);

        &:hover {
            background-color: var(--bg-row-hover);
        }

        &:active, &.active {
            background-color: var(--color-primary);
            color: #000000;
            border: 2px solid var(--border-color);
            box-shadow: 2px 2px 0px var(--shadow-color);

            .icon {
                color: #000000;
            }
        }
    }

    & a > span, & button > span {
        line-height: 1.2;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .icon {
        width: 32px;
        height: 32px;
        flex: 0 0 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 0;
        border-radius: 100%;
    }

    .logOut {
        ${tw`text-neutral-500`};
        padding-top: 10px;
        padding-bottom: 0.5em;
        border-top: 3px solid var(--border-color);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;

        .icon {
            margin-right: 0;
        }
    }
    .media {
        margin-top: auto;
        padding-top: 25px;
        padding-bottom: 4px;
    }
    .subTitle {
        ${tw`text-neutral-500`};
        margin-top: 30px;
        padding: 0 10px;
        font-size: 0.7rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
    }
    .last {
        margin-bottom: 5px;
    }

    @media only screen and (min-width: 980px) {
        .collapse & {
            width: 60px;

            #logo {
                justify-content: center;
            }
            #logo > a {
                justify-content: center;
            }
            #logo span {
                display: none;
            }

            & a, & button, & .navigation-link {
                justify-content: center;
                gap: 0;
                padding: 6px;
            }
            & a > span, & button > span {
                display: none;
            }
            .subTitle {
                display: none;
            }
            .logOut {
                flex-direction: column;
                justify-content: center;
                gap: 6px;
            }
        }
    }

    /* ---------- <= 979px: static top bar (logo left, burger right) + drawer ---------- */
    @media only screen and (max-width: 979px) {
        & {
            position: fixed;
            inset: 0 0 auto 0;
            width: 100%;
            height: auto;
            border-right: none;
            border-bottom: 3px solid var(--border-color);
            /* Own stacking context: keeps top bar, backdrop and drawer ordered. */
            z-index: 100;
        }

        #logo {
            position: relative;
            z-index: 3;
            padding: calc(env(safe-area-inset-top, 0px) + 10px) 12px 10px;
            margin: 0;
        }
        #logo span {
            font-size: 1.05rem;
        }
        #logo img {
            width: 36px;
            height: 36px;
        }
        #logo .menuBtn {
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 0 0 auto;
            width: 44px;
            height: 44px;
            padding: 0;
            background-color: var(--color-primary);
            color: #000000;
            border: 3px solid var(--border-color);
            border-radius: 4px;
            box-shadow: 3px 3px 0px var(--shadow-color);

            .icon {
                width: 24px;
                height: 24px;
                border-radius: 0;
            }
        }

        .navBackdrop {
            display: block;
            position: fixed;
            inset: 0;
            /* Covers the top bar so only the drawer close button stays visible. */
            z-index: 5;
            padding: 0;
            border: 0;
            /* !important beats the generic button:hover rule in this component. */
            background: rgba(0, 0, 0, 0.55) !important;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.25s ease, visibility 0.25s ease;
            pointer-events: none;
        }
        &.mobile-open .navBackdrop {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
        }

        & > .navBody {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            /* Above the backdrop and the top bar. */
            z-index: 6;
            width: min(320px, 86vw);
            height: 100vh;
            height: 100dvh;
            padding: calc(env(safe-area-inset-top, 0px) + 10px) 10px
                calc(env(safe-area-inset-bottom, 0px) + 10px);
            flex: none;
            overflow-y: auto;
            overflow-x: hidden;
            overscroll-behavior: contain;
            -webkit-overflow-scrolling: touch;
            background-color: var(--secondary);
            border-right: 3px solid var(--border-color);
            transform: translateX(-105%);
            transition: transform 0.25s ease;
        }
        &.mobile-open > .navBody {
            transform: translateX(0);
            box-shadow: 8px 8px 0px var(--shadow-color);
        }

        .drawerClose {
            display: flex;
            align-self: flex-end;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            margin-bottom: 6px;
            padding: 0;
            background-color: var(--bg-elevated);
            color: var(--text-main);
            border: 3px solid var(--border-color);
            border-radius: 4px;
            box-shadow: 2px 2px 0px var(--shadow-color);

            .icon {
                width: 24px;
                height: 24px;
                border-radius: 0;
            }
        }

        & .subTitle {
            margin-top: 14px;
        }
        & .logOut {
            margin-top: 8px;
        }
    }

    @media only screen and (min-width: 980px) {
        .drawerClose {
            display: none !important;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        &,
        & > .navBody,
        .navBackdrop {
            transition: none;
        }
    }
`;

export default NavigationBar;
