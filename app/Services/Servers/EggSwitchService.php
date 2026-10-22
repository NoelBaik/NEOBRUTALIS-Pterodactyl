<?php

namespace Pterodactyl\Services\Servers;

use Pterodactyl\Models\Egg;
use Pterodactyl\Models\Server;
use Pterodactyl\Models\ServerVariable;
use Illuminate\Database\ConnectionInterface;
use Pterodactyl\Exceptions\DisplayException;
use Pterodactyl\Repositories\Wings\DaemonServerRepository;

class EggSwitchService
{
    public function __construct(
        private ConnectionInterface $connection,
        private DaemonServerRepository $daemonServerRepository,
        private ReinstallServerService $reinstallServerService,
    ) {
    }

    /**
     * Egg IDs the given egg is allowed to switch to. No configured entry means
     * every egg is allowed; an explicit empty array disables switching.
     */
    public function allowedEggIds(Egg $egg): array
    {
        $ids = config("eggswitch.switchable.{$egg->id}");

        if (!is_array($ids)) {
            return Egg::query()->pluck('id')->map(fn ($id) => (int) $id)->all();
        }

        return array_map('intval', $ids);
    }

    /**
     * Switch a server to another egg, resetting its variables to the new egg's defaults.
     *
     * @throws \Throwable
     * @throws DisplayException
     */
    public function handle(Server $server, Egg $egg, bool $reinstall = false): Server
    {
        if (!in_array($egg->id, $this->allowedEggIds($server->egg), true)) {
            throw new DisplayException('This egg cannot be selected for this server.');
        }

        $server = $this->connection->transaction(function () use ($server, $egg) {
            $server->forceFill([
                'egg_id' => $egg->id,
                'nest_id' => $egg->nest_id,
                'startup' => $egg->startup ?? $server->startup,
                'image' => array_values($egg->docker_images ?: [])[0] ?? $server->image,
            ])->save();

            ServerVariable::query()->where('server_id', $server->id)->delete();

            foreach ($egg->variables as $variable) {
                ServerVariable::query()->create([
                    'server_id' => $server->id,
                    'variable_id' => $variable->id,
                    'variable_value' => $variable->default_value,
                ]);
            }

            return $server->refresh();
        });

        // Make Wings pick up the new egg configuration before (optionally) reinstalling.
        $this->daemonServerRepository->setServer($server)->sync();

        if ($reinstall) {
            $this->reinstallServerService->handle($server);
        }

        return $server;
    }
}
