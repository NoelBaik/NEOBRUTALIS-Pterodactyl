import * as React from 'react';
import * as Icon from 'react-feather';
import { Link, NavLink } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import tw from 'twin.macro';
import http from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import DarkModeToggler from '@/components/elements/custom/DarkModeToggler';
import SocialButtons from '@/components/elements/custom/SocialButtons';
import NavigationBar from '@/components/elements/custom/NavigationBar';
import CollapseBtn from '@/components/elements/custom/CollapseBtn';
import UserCard from '@/components/elements/custom/UserCard';
import { ServerContext } from '@/state/server';
import getTheme from '@/api/getThemeData';
import { Nav } from '@/routers/SideBarElements';
import * as Lang from '@/lang';
import { useLocation } from 'react-router';
import BeforeNavigation from '@blueprint/components/Navigation/NavigationBar/BeforeNavigation';
import AdditionalItems from '@blueprint/components/Navigation/NavigationBar/AdditionalItems';
import AfterNavigation from '@blueprint/components/Navigation/NavigationBar/AfterNavigation';

export default () => {
    const name = useStoreState((state: ApplicationStore) => state.settings.data!.name);
    const rootAdmin = useStoreState((state: ApplicationStore) => state.user.data!.rootAdmin);
    const [isLoggingOut, setIsLoggingOut] = React.useState(false);
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [themeData, setThemeData] = React.useState<string>();
    const location = useLocation();

    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            // @ts-ignore
            window.location = '/';
        });
    };

    React.useEffect(() => {
        getTheme().then((data) => setThemeData(data.logo));
    }, []);

    React.useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    React.useEffect(() => {
        if (!menuOpen) return;

        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") setMenuOpen(false);
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKey);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onKey);
        };
    }, [menuOpen]);

    return (
        <NavigationBar className={menuOpen ? 'mobile-open' : ''}>
            <BeforeNavigation />
            <SpinnerOverlay visible={isLoggingOut} />
            <button
                className={"navBackdrop"}
                onClick={() => setMenuOpen(false)}
                aria-label={"Tutup menu navigasi"}
                tabIndex={-1}
            />
            <div id={"logo"}>
                <Link to={"/"}>
                    <img src={themeData} alt={""} />
                    <span>{name}</span>
                </Link>
                <button
                    className={"menuBtn"}
                    onClick={() => setMenuOpen((open) => !open)}
                    aria-label={menuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
                    aria-expanded={menuOpen}
                >
                    <div className={"icon"}>{menuOpen ? <Icon.X size={22} /> : <Icon.Menu size={22} />}</div>
                </button>
                <div className={"collapseBtn"}>
                    <CollapseBtn />
                </div>
            </div>
            <div className={"navBody"} css={tw`w-full`}>
                <button className={"drawerClose"} onClick={() => setMenuOpen(false)} aria-label={"Tutup menu navigasi"}>
                    <div className={"icon"}><Icon.X size={22} /></div>
                </button>
                <NavLink to={'/account'} exact>
                    <div className='icon'>
                        <Icon.User size={20} />
                    </div>
                    <span>{Lang.Account}</span>
                </NavLink>
                <NavLink to={'/'} exact>
                    <div className='icon'>
                        <Icon.Layers size={20} />
                    </div>
                    <span>{Lang.Servers}</span>
                </NavLink>
                <span className='subTitle'>SERVER CONTROLS</span>
                <Nav />
                <AdditionalItems />
                <div className='media'>
                    <SocialButtons />
                </div>
                <UserCard />
                <div className='logOut'>
                    <DarkModeToggler />
                    {rootAdmin && (
                        <a href={'/admin'} rel={'noreferrer'}>
                            <div className='icon'>
                                <Icon.Settings size={20} />
                            </div>
                        </a>
                    )}
                    <button onClick={onTriggerLogout}>
                        <div className='icon'>
                            <Icon.LogOut size={20} />
                        </div>
                    </button>
                </div>
            </div>
            <AfterNavigation />
        </NavigationBar>
    );
};
