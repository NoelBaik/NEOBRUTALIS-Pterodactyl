<?php

namespace Pterodactyl\Http\Controllers\Admin\Theme;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Prologue\Alerts\AlertsMessageBag;
use Pterodactyl\Http\Controllers\Controller;

class ThemeController extends Controller
{
    /**
     * @var \Prologue\Alerts\AlertsMessageBag
     */
    private $alert;

    public function __construct(
        AlertsMessageBag $alert
    ) {
        $this->alert = $alert;
    }

    public function index()
    {
        $theme = DB::table('theme')->first();

        return view('admin.theme.index', ['theme' => $theme,]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'backgroundimage' => 'nullable|string',
            'backgroundimage_dark' => 'nullable|string',
            'background_image' => 'nullable|image|max:10240',
            'background_image_dark' => 'nullable|image|max:10240',
        ]);

        $existing = DB::table('theme')->first();

        $data = [
            'logo' => $request->logo,
            'longlogo' => $request->longlogo,
            'backgroundimage' => $request->filled('backgroundimage')
                ? $request->backgroundimage
                : $existing->backgroundimage,
            'backgroundimage_dark' => $request->filled('backgroundimage_dark')
                ? $request->backgroundimage_dark
                : $existing->backgroundimage_dark,
            'updated_at' => \Carbon::now(),
        ];

        foreach (['background_image' => 'backgroundimage', 'background_image_dark' => 'backgroundimage_dark'] as $input => $column) {
            if ($request->hasFile($input)) {
                $data[$column] = '/storage/' . $request->file($input)->store('theme/backgrounds', 'public');
            }
        }

        DB::table('theme')->where('id', $existing->id)->update($data);

        $this->alert->success('Theme settings have been updated successfully.')->flash();
        return redirect()->back();
    }
}
