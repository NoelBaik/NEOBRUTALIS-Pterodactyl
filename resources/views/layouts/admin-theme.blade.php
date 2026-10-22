@php($ts = \Illuminate\Support\Facades\DB::table('theme')->first())
<style>
    :root {
        --a-bg: {{ $ts->background ?? '#1b1c30' }};
        --a-panel: {{ $ts->secondary ?? '#222339' }};
        --a-panel-2: {{ $ts->secondaryhover ?? '#1b1c2e' }};
        --a-accent: {{ $ts->primary ?? '#ff7800' }};
        --a-accent-h: {{ $ts->primaryhover ?? '#e66100' }};
        --a-text: {{ $ts->color ?? '#d9d9d9' }};
        --a-muted: {{ $ts->subcolor ?? '#c0bfc0' }};
        --a-input: {{ $ts->input ?? '#2A2F41' }};
        --a-radius: {{ $ts->borderradius ?? 7 }}px;
        --a-border: rgba(255, 255, 255, .07);
        --a-border-strong: rgba(255, 255, 255, .12);
        --a-font: 'Rubik', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }

    html, body { background-color: var(--a-bg) !important; color: var(--a-text); }

    body, .content-wrapper, .main-footer, h1, h2, h3, h4, h5, h6, .box-title,
    .btn, .form-control, .table, .nav-tabs-custom > .nav-tabs > li > a,
    .modal-content, .select2-container, .dropdown-menu {
        font-family: var(--a-font);
    }

    a { color: var(--a-accent); }
    a:hover, a:focus { color: var(--a-accent-h); }
    hr { border-top-color: var(--a-border); }
    .text-muted { color: var(--a-muted) !important; }
    .bg-gray, .bg-white { background-color: var(--a-panel) !important; color: var(--a-text) !important; }
    code { background: var(--a-input); color: #e6edf7; border-radius: 4px; }
    pre { background: var(--a-input); color: #e6edf7; border: 0; border-radius: var(--a-radius); }

    /* Header */
    .skin-blue .main-header .logo,
    .skin-blue .main-header .logo:hover {
        background-color: var(--a-bg);
        color: #fff;
        font-weight: 600;
        border-bottom: 1px solid var(--a-border);
    }
    .skin-blue .main-header .navbar { background-color: var(--a-panel); }
    .skin-blue .main-header .navbar .nav > li > a { color: var(--a-text); }
    .skin-blue .main-header .navbar .nav > li > a:hover,
    .skin-blue .main-header .navbar .nav > li > a:focus,
    .skin-blue .main-header .navbar .sidebar-toggle:hover {
        background-color: var(--a-panel-2);
        color: #fff;
    }
    .skin-blue .main-header .navbar .sidebar-toggle { color: var(--a-text); }
    .skin-blue .main-header .navbar .nav .open > a,
    .skin-blue .main-header .navbar .nav > .active > a {
        background-color: var(--a-panel-2);
        color: #fff;
    }
    .navbar-custom-menu > .navbar-nav > li > .dropdown-menu {
        background-color: var(--a-panel);
        border: 1px solid var(--a-border);
    }

    /* Sidebar */
    .skin-blue .wrapper,
    .skin-blue .main-sidebar,
    .skin-blue .left-side { background-color: var(--a-bg); }
    .skin-blue .sidebar-menu > li.header {
        background: transparent;
        color: var(--a-muted);
        font-size: 10px;
        letter-spacing: .08em;
    }
    .skin-blue .sidebar-menu > li > a {
        color: var(--a-text);
        border-left: 3px solid transparent;
    }
    .skin-blue .sidebar-menu > li > a:hover {
        background-color: var(--a-panel);
        color: #fff;
        border-left-color: var(--a-accent);
    }
    .skin-blue .sidebar-menu > li.active > a,
    .skin-blue .sidebar-menu > li.menu-open > a {
        background-color: var(--a-panel);
        color: #fff;
        border-left-color: var(--a-accent);
    }
    .skin-blue .sidebar-menu > li > .treeview-menu { background-color: var(--a-panel-2); }
    .skin-blue .sidebar-menu .treeview-menu > li > a { color: var(--a-muted); }
    .skin-blue .sidebar-menu .treeview-menu > li > a:hover,
    .skin-blue .sidebar-menu .treeview-menu > li.active > a { color: #fff; }
    .sidebar a { color: var(--a-text); }

    /* Content */
    .content-wrapper { background-color: var(--a-bg) !important; color: var(--a-text); }
    .content-header { background: transparent; }
    .content-header > h1 { color: var(--a-text); font-weight: 600; font-size: 24px; }
    .content-header > h1 > small { color: var(--a-muted); }
    .breadcrumb { background: transparent; padding-left: 0; }
    .breadcrumb > li > a { color: var(--a-muted); }
    .breadcrumb > .active { color: var(--a-text); }

    /* Boxes */
    .box, .box.box-default, .nav-tabs-custom, .info-box, .small-box {
        background-color: var(--a-panel) !important;
        color: var(--a-text);
        border-radius: var(--a-radius);
        border: 1px solid var(--a-border);
        box-shadow: 0 10px 30px rgba(0, 0, 0, .25);
        overflow: hidden;
    }
    .box.box-primary { border-top: 3px solid var(--a-accent); }
    .box.box-success { border-top: 3px solid #14914E; }
    .box.box-danger { border-top: 3px solid #AC2427; }
    .box.box-warning { border-top: 3px solid #E0A100; }
    .box-header { background: transparent; color: var(--a-text); border-bottom: 1px solid var(--a-border); }
    .box-header.with-border { border-bottom: 1px solid var(--a-border); }
    .box-header .box-title { color: var(--a-text); font-size: 15px; font-weight: 500; }
    .box-header > .box-tools .btn { box-shadow: none; }
    .box-body { background: transparent; color: var(--a-text); }
    .box-footer { background: transparent; border-top: 1px solid var(--a-border); color: var(--a-text); }
    .box .box-group > .box { border: 1px solid var(--a-border); }
    .small-box h3, .small-box p { color: inherit; }

    /* Buttons */
    .btn { border-radius: var(--a-radius); font-weight: 500; }
    .btn-default {
        background-color: var(--a-panel-2);
        border-color: var(--a-border-strong);
        color: var(--a-text);
    }
    .btn-default:hover, .btn-default:focus, .btn-default:active,
    .btn-default.active, .open > .dropdown-toggle.btn-default {
        background-color: var(--a-input);
        border-color: var(--a-border-strong);
        color: #fff;
    }
    .btn-primary { background-color: var(--a-accent); border-color: var(--a-accent); color: #fff; }
    .btn-primary:hover, .btn-primary:focus, .btn-primary:active, .btn-primary.active,
    .open > .dropdown-toggle.btn-primary {
        background-color: var(--a-accent-h);
        border-color: var(--a-accent-h);
        color: #fff;
    }
    .btn-success { background-color: #14914E; border-color: #14914E; }
    .btn-danger { background-color: #AC2427; border-color: #AC2427; }
    .btn-link { color: var(--a-accent); }

    /* Forms */
    .form-control, .select2-container .select2-selection--single,
    .select2-container--default .select2-selection--multiple {
        background-color: var(--a-input) !important;
        border: 1px solid var(--a-border-strong);
        color: var(--a-text) !important;
        border-radius: var(--a-radius);
        box-shadow: none;
    }
    .form-control:focus {
        border-color: var(--a-accent);
        box-shadow: 0 0 0 3px rgba(255, 120, 0, .18);
    }
    .form-control::placeholder { color: var(--a-muted); opacity: .7; }
    select.form-control option { background-color: var(--a-panel); color: var(--a-text); }
    .input-group-addon {
        background-color: var(--a-panel-2);
        border-color: var(--a-border-strong);
        color: var(--a-muted);
    }
    label { color: var(--a-text); font-weight: 500; }
    .help-block { color: var(--a-muted); }
    .select2-dropdown, .select2-container--default .select2-results__option {
        background-color: var(--a-panel);
        color: var(--a-text);
        border-color: var(--a-border-strong);
    }
    .select2-container--default .select2-results__option--highlighted[aria-selected] {
        background-color: var(--a-accent);
        color: #fff;
    }
    .select2-search__field { background-color: var(--a-input) !important; color: var(--a-text) !important; }
    .swal-modal { background-color: var(--a-panel); }
    .swal-title, .swal-text { color: var(--a-text); }

    /* Tables */
    .table { color: var(--a-text); }
    .table > thead > tr > th {
        background-color: var(--a-panel-2);
        border-bottom: 2px solid var(--a-border-strong);
        text-transform: uppercase;
        font-size: 11px;
        letter-spacing: .06em;
        color: var(--a-muted);
    }
    .table > tbody > tr > td,
    .table > tbody > tr > th,
    .table > tfoot > tr > td,
    .table > tfoot > tr > th,
    .table > thead > tr > td {
        border-top: 1px solid var(--a-border);
        vertical-align: middle;
    }
    .table-striped > tbody > tr:nth-of-type(odd) { background-color: rgba(255, 255, 255, .02); }
    .table-hover > tbody > tr:hover { background-color: rgba(255, 255, 255, .05); }
    .table-bordered, .table-bordered > tbody > tr > td,
    .table-bordered > tbody > tr > th, .table-bordered > thead > tr > th,
    .table-bordered > tfoot > tr > th { border-color: var(--a-border); }
    .table > tbody > tr > td > code { background: var(--a-input); color: #e6edf7; }

    /* Tabs / pills / lists */
    .nav-tabs-custom > .nav-tabs { background-color: var(--a-panel-2); border-bottom-color: var(--a-border); }
    .nav-tabs-custom > .nav-tabs > li > a { color: var(--a-muted); }
    .nav-tabs-custom > .nav-tabs > li > a:hover { background: var(--a-input); color: var(--a-text); }
    .nav-tabs-custom > .nav-tabs > li.active { border-top-color: var(--a-accent); }
    .nav-tabs-custom > .nav-tabs > li.active > a,
    .nav-tabs-custom > .nav-tabs > li.active > a:hover {
        background-color: var(--a-panel);
        color: var(--a-text);
    }
    .nav-tabs-custom > .tab-content { background-color: var(--a-panel); }
    .nav-pills > li.active > a,
    .nav-pills > li.active > a:hover { background-color: var(--a-accent); }
    .list-group-item { background-color: var(--a-panel); border-color: var(--a-border); color: var(--a-text); }
    .list-group-item:hover { background-color: var(--a-panel-2); }

    /* Modals / dropdowns */
    .modal-content { background-color: var(--a-panel); color: var(--a-text); border: 1px solid var(--a-border-strong); }
    .modal-header, .modal-footer { border-color: var(--a-border); }
    .modal-header .close { color: var(--a-text); }
    .dropdown-menu {
        background-color: var(--a-panel);
        border: 1px solid var(--a-border-strong);
        box-shadow: 0 10px 30px rgba(0, 0, 0, .35);
    }
    .dropdown-menu > li > a { color: var(--a-text); }
    .dropdown-menu > li > a:hover,
    .dropdown-menu > li > a:focus { background-color: var(--a-panel-2); color: #fff; }
    .dropdown-menu > .divider { background-color: var(--a-border); }

    /* Pagination */
    .pagination > li > a,
    .pagination > li > span {
        background-color: var(--a-panel);
        border-color: var(--a-border-strong);
        color: var(--a-text);
    }
    .pagination > li > a:hover { background-color: var(--a-panel-2); color: #fff; }
    .pagination > .active > a,
    .pagination > .active > a:hover,
    .pagination > .active > span {
        background-color: var(--a-accent);
        border-color: var(--a-accent);
        color: #fff;
    }

    /* Misc */
    .main-footer { background-color: var(--a-panel); border-top: 1px solid var(--a-border); color: var(--a-muted); }
    .alert { border-radius: var(--a-radius); border: 0; }
    .alert-danger { background-color: rgba(172, 36, 39, .18); color: #ffb4b6; }
    .alert-success { background-color: rgba(20, 145, 78, .18); color: #7ee2ad; }
    .alert-warning { background-color: rgba(224, 161, 0, .18); color: #ffd47a; }
    .alert-info { background-color: rgba(59, 108, 222, .18); color: #a9c4ff; }
    .callout { border-radius: var(--a-radius); }
    .well { background-color: var(--a-panel-2); border-color: var(--a-border); color: var(--a-text); }
    .label-default { background-color: var(--a-panel-2); color: var(--a-text); }
    .img-thumbnail { background-color: var(--a-panel); border-color: var(--a-border); }
    .content-wrapper .dataTables_wrapper .dataTables_filter input,
    .content-wrapper .dataTables_wrapper select {
        background-color: var(--a-input);
        color: var(--a-text);
        border: 1px solid var(--a-border-strong);
    }
    .content-wrapper .dataTables_wrapper .dataTables_length,
    .content-wrapper .dataTables_wrapper .dataTables_filter,
    .content-wrapper .dataTables_wrapper .dataTables_info,
    .content-wrapper .dataTables_wrapper .dataTables_processing { color: var(--a-muted); }
    .-dark-light, .text-gray { color: var(--a-muted); }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 10px; height: 10px; }
    ::-webkit-scrollbar-track { background: var(--a-bg); }
    ::-webkit-scrollbar-thumb { background: var(--a-input); border-radius: 6px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--a-panel-2); }

    @media (max-width: 767px) {
        .skin-blue .main-header .logo,
        .skin-blue .main-header .navbar { background-color: var(--a-bg); }
        .content-wrapper { background-color: var(--a-bg) !important; }
    }
</style>
