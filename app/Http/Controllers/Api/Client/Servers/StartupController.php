<?php

namespace Pterodactyl\Http\Controllers\Api\Client\Servers;

use Pterodactyl\Models\Egg;
use Pterodactyl\Models\Server;
use Pterodactyl\Models\Permission;
use Pterodactyl\Facades\Activity;
use Pterodactyl\Services\Servers\EggSwitchService;
use Pterodactyl\Services\Servers\StartupCommandService;
use Pterodactyl\Repositories\Eloquent\ServerVariableRepository;
use Pterodactyl\Transformers\Api\Client\EggVariableTransformer;
use Pterodactyl\Http\Controllers\Api\Client\ClientApiController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Pterodactyl\Http\Requests\Api\Client\Servers\Startup\GetStartupRequest;
use Pterodactyl\Http\Requests\Api\Client\Servers\Startup\SwitchServerEggRequest;
use Pterodactyl\Http\Requests\Api\Client\Servers\Startup\UpdateStartupVariableRequest;

class StartupController extends ClientApiController
{
    /**
     * StartupController constructor.
     */
    public function __construct(
        private StartupCommandService $startupCommandService,
        private ServerVariableRepository $repository,
        private EggSwitchService $eggSwitchService,
    ) {
        parent::__construct();
    }

    /**
     * Returns the startup information for the server including all the variables.
     */
    public function index(GetStartupRequest $request, Server $server): array
    {
        $startup = $this->startupCommandService->handle($server);

        return $this->fractal->collection(
            $server->variables()->where('user_viewable', true)->get()
        )
            ->transformWith($this->getTransformer(EggVariableTransformer::class))
            ->addMeta([
                'startup_command' => $startup,
                'docker_images' => $server->egg->docker_images,
                'raw_startup_command' => $server->startup,
                'switchable_eggs' => $request->user()->can(Permission::ACTION_STARTUP_EGG, $server)
                    ? $this->switchableEggs($server)
                    : [],
                'current_egg_id' => $server->egg_id,
            ])
            ->toArray();
    }

    /**
     * Updates a single variable for a server.
     *
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Pterodactyl\Exceptions\Model\DataValidationException
     * @throws \Pterodactyl\Exceptions\Repository\RecordNotFoundException
     */
    public function update(UpdateStartupVariableRequest $request, Server $server): array
    {
        $variable = $server->variables()->where('env_variable', $request->input('key'))->first();

        if (is_null($variable) || !$variable->user_viewable) {
            throw new BadRequestHttpException('The environment variable you are trying to edit does not exist.');
        } elseif (!$variable->user_editable) {
            throw new BadRequestHttpException('The environment variable you are trying to edit is read-only.');
        }

        $original = $variable->server_value;

        // Revalidate the variable value using the egg variable specific validation rules for it.
        $this->validate($request, ['value' => $variable->rules]);

        $this->repository->updateOrCreate([
            'server_id' => $server->id,
            'variable_id' => $variable->id,
        ], [
            'variable_value' => $request->input('value') ?? '',
        ]);

        $variable = $variable->refresh();
        $variable->server_value = $request->input('value');

        $startup = $this->startupCommandService->handle($server);

        if ($original !== $request->input('value')) {
            Activity::event('server:startup.edit')
                ->subject($variable)
                ->property([
                    'variable' => $variable->env_variable,
                    'old' => $original,
                    'new' => $request->input('value') ?? '',
                ])
                ->log();
        }

        return $this->fractal->item($variable)
            ->transformWith($this->getTransformer(EggVariableTransformer::class))
            ->addMeta([
                'startup_command' => $startup,
                'raw_startup_command' => $server->startup,
            ])
            ->toArray();
    }

    /**
     * Switches the server to another egg that the current egg allows.
     *
     * @throws \Throwable
     */
    public function switchEgg(SwitchServerEggRequest $request, Server $server): array
    {
        /** @var Egg $egg */
        $egg = Egg::query()->findOrFail($request->input('egg_id'));
        $from = $server->egg->name;
        $reinstall = $request->boolean('reinstall');

        $server = $this->eggSwitchService->handle($server, $egg, $reinstall);

        Activity::event('server:startup.egg')
            ->property(['old' => $from, 'new' => $egg->name, 'reinstall' => $reinstall])
            ->log();

        return [
            'egg_id' => $server->egg_id,
            'nest_id' => $server->nest_id,
            'startup' => $server->startup,
            'image' => $server->image,
            'reinstalled' => $reinstall,
        ];
    }

    /**
     * Eggs this server's current egg is allowed to switch to.
     */
    private function switchableEggs(Server $server): array
    {
        $ids = $this->eggSwitchService->allowedEggIds($server->egg);
        if (empty($ids)) {
            return [];
        }

        return Egg::query()
            ->whereIn('id', array_unique([...$ids, $server->egg_id]))
            ->orderBy('name')
            ->get(['id', 'name', 'nest_id'])
            ->map(fn (Egg $egg) => ['id' => $egg->id, 'name' => $egg->name, 'nest_id' => $egg->nest_id])
            ->all();
    }
}
