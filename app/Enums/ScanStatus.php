<?php

namespace App\Enums;

enum ScanStatus: string
{
    case Processing = 'processing';
    case Done = 'done';
    case Failed = 'failed';
}
