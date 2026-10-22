<?php

return [
    /*
     * Optional allowlist of eggs a server may switch to, keyed by the source egg ID.
     *
     * Not listed at all  => every egg may be selected.
     * Listed as []       => switching is disabled for that egg.
     * Listed as [1, 5]   => only those egg IDs may be selected.
     *
     * Egg switching additionally requires the `startup.egg` permission
     * (server owners and root admins bypass permission checks).
     */
    'switchable' => [],
];
