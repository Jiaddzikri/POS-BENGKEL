@component('mail::message')

# Hello, {{ $name }}

Thank you for registering with **{{ config('app.name') }}**.

Please verify your email address by clicking the button below:

@component('mail::button', ['url' => $verificationUrl])
Verify Email
@endcomponent

This link will expire in 60 minutes.

If you did not create an account, no further action is required.

Thanks,<br>
{{ config('app.name') }}


@endcomponent