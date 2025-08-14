<?php


namespace App\Logging;

use Illuminate\Log\Logger;

use Monolog\Formatter\LineFormatter;
use Monolog\Processor\IntrospectionProcessor;
use Monolog\Logger as MonologLogger;

class CostumizeFormatter
{
  public function __invoke(Logger $logger): void
  {

    foreach ($logger->getHandlers() as $handler) {

      $formatter = new LineFormatter(
        "[%datetime%][%channel%][%level_name%][%extra.class%@%extra.function%] %message% %context%\n",
        "Y-m-d H:i:s",
        true,
        true
      );

      $handler->setFormatter($formatter);

      $skipPartials = [
        'Illuminate\\Log\\Logger', 
        'Illuminate\\Log\LogManager',
        'App\\Helpers\\AppLog'
      ];

      $handler->pushProcessor(new IntrospectionProcessor(
        'debug',
        $skipPartials
      ));
    }
  }
}
