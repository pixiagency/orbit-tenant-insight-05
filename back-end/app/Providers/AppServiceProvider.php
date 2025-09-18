<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // if ($this->app->runningInConsole()) {
        //     $this->commands([
        //         \App\Console\Commands\ProcessTaskEscalations::class,
        //         \App\Console\Commands\ProcessTaskReminders::class,
        //         \App\Console\Commands\ManageTranslations::class,
        //     ]);
        // }
    }
}
