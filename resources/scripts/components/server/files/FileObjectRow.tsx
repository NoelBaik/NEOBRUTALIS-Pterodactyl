import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faFileArchive, faFileImport, faFolder } from '@fortawesome/free-solid-svg-icons';
import { encodePathSegments } from '@/helpers';
import { differenceInHours, format, formatDistanceToNow } from 'date-fns';
import React, { memo } from 'react';
import { FileObject } from '@/api/server/files/loadDirectory';
import FileDropdownMenu from '@/components/server/files/FileDropdownMenu';
import { ServerContext } from '@/state/server';
import { NavLink, useRouteMatch } from 'react-router-dom';
import tw from 'twin.macro';
import isEqual from 'react-fast-compare';
import SelectFileCheckbox from '@/components/server/files/SelectFileCheckbox';
import { usePermissions } from '@/plugins/usePermissions';
import { join } from 'path';
import { bytesToString } from '@/lib/formatters';

const Clickable: React.FC<{ file: FileObject }> = memo(({ file, children }) => {
    const [canRead] = usePermissions(['file.read']);
    const [canReadContents] = usePermissions(['file.read-content']);
    const directory = ServerContext.useStoreState((state) => state.files.directory);
    const match = useRouteMatch();

    return (file.isFile && (!file.isEditable() || !canReadContents)) || (!file.isFile && !canRead) ? (
        <div css={tw`flex flex-1 items-center py-3 px-3 cursor-default`}>{children}</div>
    ) : (
        <NavLink
            to={`${match.url}${file.isFile ? '/edit' : ''}#${encodePathSegments(join(directory, file.name))}`}
            css={tw`flex flex-1 items-center py-3 px-3 no-underline text-current`}
        >
            {children}
        </NavLink>
    );
}, isEqual);

const FileObjectRow = ({ file }: { file: FileObject }) => (
    <div
        key={file.name}
        className="brutal-row-hover"
        css={tw`flex items-center text-sm transition-colors duration-75`}
        style={{
            backgroundColor: 'var(--bg-elevated)',
            borderBottom: '2px solid var(--border-color)',
        }}
        onContextMenu={(e) => {
            e.preventDefault();
            window.dispatchEvent(new CustomEvent(`pterodactyl:files:ctx:${file.key}`, { detail: e.clientX }));
        }}
    >
        <div css={tw`pl-3 pr-2 py-3 flex items-center`}>
            <SelectFileCheckbox name={file.name} />
        </div>
        <Clickable file={file}>
            <div
                css={tw`w-8 h-8 mr-3 flex items-center justify-center flex-none`}
                style={{
                    backgroundColor: file.isFile ? 'var(--bg-secondary)' : 'var(--color-primary)',
                    border: '2px solid var(--border-color)',
                }}
            >
                {file.isFile ? (
                    <FontAwesomeIcon
                        icon={file.isSymlink ? faFileImport : file.isArchiveType() ? faFileArchive : faFileAlt}
                        css={tw`text-black`}
                    />
                ) : (
                    <FontAwesomeIcon icon={faFolder} css={tw`text-black`} />
                )}
            </div>
            <div css={tw`flex-1 truncate font-bold`}>{file.name}</div>
            {file.isFile && <div css={tw`mr-6 hidden sm:block text-xs font-mono font-bold`}>{bytesToString(file.size)}</div>}
            <div css={tw`mr-4 hidden md:block text-xs font-mono opacity-80`} title={file.modifiedAt.toString()}>
                {Math.abs(differenceInHours(file.modifiedAt, new Date())) > 48
                    ? format(file.modifiedAt, 'MMM do, yyyy h:mma')
                    : formatDistanceToNow(file.modifiedAt, { addSuffix: true })}
            </div>
        </Clickable>
        <div css={tw`pr-3`}>
            <FileDropdownMenu file={file} />
        </div>
    </div>
);

export default memo(FileObjectRow, (prevProps, nextProps) => {
    const { isArchiveType, isEditable, ...prevFile } = prevProps.file;
    const { isArchiveType: nextIsArchiveType, isEditable: nextIsEditable, ...nextFile } = nextProps.file;
    return isEqual(prevFile, nextFile);
});
