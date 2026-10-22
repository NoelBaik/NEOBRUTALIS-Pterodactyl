<?php

namespace Pterodactyl\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class RegistrationOtp extends Notification
{
    use Queueable;

    public function __construct(private string $code)
    {
    }

    public function via(): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage())
            ->subject('Kode Verifikasi Pendaftaran - ' . config('app.name'))
            ->greeting('Halo!')
            ->line('Gunakan kode berikut untuk menyelesaikan pendaftaran akun Anda:')
            ->line('**' . $this->code . '**')
            ->line('Kode berlaku selama 10 menit.')
            ->line('Abaikan email ini jika Anda tidak merasa mendaftar.');
    }
}
