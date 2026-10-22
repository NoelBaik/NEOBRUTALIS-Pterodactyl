<?php

namespace Pterodactyl\Http\Requests\Api\Client\Servers\Startup;

use Pterodactyl\Models\Permission;
use Pterodactyl\Http\Requests\Api\Client\ClientApiRequest;

class SwitchServerEggRequest extends ClientApiRequest
{
    /**
     * Only users with the startup.egg permission may switch eggs, and only users
     * allowed to reinstall the server may request a reinstall as part of the switch.
     */
    public function authorize(): bool
    {
        if (!parent::authorize()) {
            return false;
        }

        return !$this->boolean('reinstall')
            || $this->user()->can(Permission::ACTION_SETTINGS_REINSTALL, $this->route()->parameter('server'));
    }

    public function permission(): string
    {
        return Permission::ACTION_STARTUP_EGG;
    }

    public function rules(): array
    {
        return [
            'egg_id' => 'required|integer|exists:eggs,id',
            'reinstall' => 'sometimes|boolean',
        ];
    }
}
