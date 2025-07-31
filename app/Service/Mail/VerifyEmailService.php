<?php

namespace App\Service\Mail;

use App\Mail\Auth\VerifyEmailMail;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

class MailService
{
  public function sendVerifyEmail(User $user)
  {

    return Mail::to($user->email)->send(new VerifyEmailMail($user));
  }

}
