import * as React from 'react';
import * as Icon from 'react-feather';

const KEY = 'ptero_brutal_theme';

const apply = (dark: boolean) => {
    document.documentElement.classList.toggle('dark', dark);
    document.body.classList.toggle('darkmode', dark);
    localStorage.setItem(KEY, dark ? 'dark' : 'light');
};

export default () => {
    const [dark, setDark] = React.useState(() => localStorage.getItem(KEY) === 'dark');

    React.useEffect(() => {
        apply(dark);
    }, [dark]);

    return (
        <button type={'button'} onClick={() => setDark((d) => !d)} aria-label={'Toggle dark mode'}>
            <div className={'icon'}>{dark ? <Icon.Sun size={20} /> : <Icon.Moon size={20} />}</div>
        </button>
    );
};
