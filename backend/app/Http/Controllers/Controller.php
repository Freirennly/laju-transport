<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

/**
 * Class Controller
 * * Base controller utama yang mewarisi fungsi dasar Laravel.
 */
abstract class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
}