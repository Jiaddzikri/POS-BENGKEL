@component('mail::message')

# Hello, {{ $name }}

**{{ $subtitle }}**

{{ $body }}

@if ($buttonText && $buttonUrl)
@component('mail::button', ['url' => $buttonUrl])
{{ $buttonText }}
@endcomponent
@endif

{{ $note }}

Thanks,<br>
{{ config('app.name') }}

@endcomponent
