<?php

namespace Pterodactyl\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Notification;
use Pterodactyl\Rules\Username;
use Pterodactyl\Exceptions\DisplayException;
use Pterodactyl\Notifications\RegistrationOtp;
use Pterodactyl\Services\Users\UserCreationService;

class RegisterController extends AbstractLoginController
{
    private const OTP_TTL = 600;

    private const MAX_ATTEMPTS = 5;

    /**
     * Render the SPA shell so React can take over the registration screen.
     */
    public function index(): View
    {
        return view('templates/auth.core');
    }

    /**
     * Send a verification code to the e-mail address being registered.
     */
    public function requestOtp(Request $request): JsonResponse
    {
        $data = $this->validated($request);
        $key = $this->cacheKey($data['email']);

        if (Cache::has("{$key}:cooldown")) {
            throw new DisplayException('Tunggu sebentar sebelum meminta kode baru.');
        }

        $code = (string) random_int(100000, 999999);

        Cache::put($key, ['code' => $code, 'username' => $data['username']], self::OTP_TTL);
        Cache::put("{$key}:attempts", 0, self::OTP_TTL);
        Cache::put("{$key}:cooldown", true, 60);

        try {
            Notification::route('mail', $data['email'])->notify(new RegistrationOtp($code));
        } catch (\Throwable $e) {
            Cache::forget($key);
            Cache::forget("{$key}:cooldown");

            report($e);

            throw new DisplayException('Gagal mengirim kode verifikasi. Coba lagi nanti.');
        }

        return new JsonResponse([
            'data' => ['sent' => true, 'expires_in' => self::OTP_TTL],
        ]);
    }

    /**
     * Verify the code, create the account and log the user straight in.
     */
    public function register(Request $request, UserCreationService $service): JsonResponse
    {
        $data = $this->validated($request);
        $code = $request->validate(['code' => ['required', 'digits:6']])['code'];

        $key = $this->cacheKey($data['email']);
        $entry = Cache::get($key);
        $attempts = (int) Cache::get("{$key}:attempts", 0);

        if (!$entry) {
            throw new DisplayException('Kode verifikasi sudah kedaluwarsa. Silakan kirim ulang.');
        }

        if ($attempts >= self::MAX_ATTEMPTS) {
            Cache::forget($key);

            throw new DisplayException('Terlalu banyak percobaan. Silakan kirim ulang kode.');
        }

        if (!hash_equals($entry['code'], $code) || !hash_equals($entry['username'], $data['username'])) {
            Cache::put("{$key}:attempts", $attempts + 1, self::OTP_TTL);

            throw new DisplayException('Kode verifikasi tidak valid.');
        }

        Cache::forget($key);
        Cache::forget("{$key}:attempts");
        Cache::forget("{$key}:cooldown");

        $name = trim($data['name'] ?? '') ?: $data['username'];
        $parts = preg_split('/\s+/', $name, 2);

        $user = $service->handle([
            'username' => $data['username'],
            'email' => $data['email'],
            'password' => $data['password'],
            'name_first' => $parts[0],
            'name_last' => $parts[1] ?? $parts[0],
        ]);

        return $this->sendLoginResponse($user, $request);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'username' => ['required', 'string', 'between:3,191', 'unique:users,username', new Username()],
            'email' => ['required', 'email:strict', 'max:191', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'name' => ['nullable', 'string', 'max:191'],
        ]);
    }

    private function cacheKey(string $email): string
    {
        return 'register-otp:' . hash('sha256', mb_strtolower($email));
    }
}
