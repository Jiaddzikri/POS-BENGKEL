<?php

namespace App\Mail\Auth;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\URL;

class VerifyEmailMail extends Mailable
{
    use Queueable, SerializesModels;

    protected $user_data;
    protected $sender_data;

    /**
     * Create a new message instance.
     */
    public function __construct(
        User $user,
        // User $sender
    ) {
        $this->user_data = $user;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Verify Your Email Address!',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        if ($this->user_data->hasVerifiedEmail()) {
            // Sudah verifikasi, kirim email versi "sudah diverifikasi"
            return new Content(
                markdown: 'mail.verify-email',
                with: [
                    'name' => $this->user_data->name,
                    'subtitle' => '✅ You’re already verified',
                    'body' => 'Thanks for verifying your email address.',
                    'buttonText' => null,
                    'buttonUrl' => null,
                    'note' => 'If you didn’t request this email, no further action is required.',
                ]
            );
        }

        // Belum verifikasi, kirim email biasa
        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            Carbon::now()->addMinutes(60),
            [
                'id' => $this->user_data->id,
                'hash' => sha1($this->user_data->getEmailForVerification())
            ]
        );

        return new Content(
            markdown: 'mail.verify-email',
            with: [
                'name' => $this->user_data->name,
                'subtitle' => 'Your registration was successful 🎉',
                'body' => 'Thank you for signing up. Please verify your email to continue.',
                'buttonText' => 'Verify Email',
                'buttonUrl' => $verificationUrl,
                'note' => 'This link will expire in 60 minutes. If you did not request this, no further action is required.',
            ]
        );
    }


    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
