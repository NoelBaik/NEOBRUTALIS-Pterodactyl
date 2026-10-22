@extends('layouts.admin')
@include('partials/admin.theme.nav', ['activeTab' => 'theme'])

@section('title')
    Theme Settings
@endsection

@section('content-header')
    <h1>Theme Settings<small>Configure Pterodactyl to your liking.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li class="active">Theme</li>
    </ol>
@endsection

@section('content')
    @yield('theme::nav')
    <div class="row">
        <div class="col-xs-12">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">Theme Settings</h3>
                </div>
                <form action="{{ route('admin.theme.update') }}" method="POST" enctype="multipart/form-data">
                    <div class="box-body">
                        <div class="row">
                            <div class="form-group col-md-4">
                                <label class="control-label">Small logo</label>
                                <div>
                                    <input id="logo" type="text" class="form-control" name="logo" @if(!empty($theme)) value="{{ $theme->logo }}" @endif required />
                                    <p class="text-muted"><small>The logo of the company for the theme.</small></p>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-md-6">
                                <label class="control-label">Background Image (Light Mode)</label>
                                <div>
                                    <input type="text" class="form-control" name="backgroundimage" placeholder="https://... or /storage/..." @if(!empty($theme)) value="{{ $theme->backgroundimage }}" @endif />
                                    <p class="text-muted"><small>URL of the background image shown in light mode.</small></p>
                                    <input type="file" name="background_image" accept="image/*" style="margin-top:8px;" />
                                    <p class="text-muted"><small>Or upload a file (max 10 MB). Upload overrides the URL above.</small></p>
                                    @if(!empty($theme) && !empty($theme->backgroundimage))
                                        <img src="{{ $theme->backgroundimage }}" alt="Light background preview" style="max-width:100%;max-height:180px;border:1px solid #ddd;border-radius:4px;margin-top:8px;" />
                                    @endif
                                </div>
                            </div>
                            <div class="form-group col-md-6">
                                <label class="control-label">Background Image (Dark Mode)</label>
                                <div>
                                    <input type="text" class="form-control" name="backgroundimage_dark" placeholder="https://... or /storage/..." @if(!empty($theme)) value="{{ $theme->backgroundimage_dark }}" @endif />
                                    <p class="text-muted"><small>URL of the background image shown in dark mode.</small></p>
                                    <input type="file" name="background_image_dark" accept="image/*" style="margin-top:8px;" />
                                    <p class="text-muted"><small>Or upload a file (max 10 MB). Upload overrides the URL above.</small></p>
                                    @if(!empty($theme) && !empty($theme->backgroundimage_dark))
                                        <img src="{{ $theme->backgroundimage_dark }}" alt="Dark background preview" style="max-width:100%;max-height:180px;border:1px solid #ddd;border-radius:4px;margin-top:8px;" />
                                    @endif
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="box-footer">
                        {!! csrf_field() !!}
                        <button type="submit" class="btn btn-sm btn-primary pull-right">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection
