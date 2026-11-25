<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /**
     * Always run tests against in-memory SQLite.
     *
     * The development shell exports DB_* environment variables (DB_CONNECTION=mysql,
     * DB_DATABASE=sawsa), which neither phpdotenv nor PHPUnit's <env> entries can
     * override. Forcing the config here guarantees RefreshDatabase can never drop
     * the MySQL development database.
     */
    public function createApplication()
    {
        $app = parent::createApplication();

        $app['config']->set('database.default', 'sqlite');
        $app['config']->set('database.connections.sqlite.database', ':memory:');

        // The dev shell exports APP_ENV=local, which PHPUnit's <env> entries
        // cannot override here; force the testing env so CSRF is skipped and
        // app('env') matches expectations during tests.
        $app['env'] = 'testing';
        $app['config']->set('app.env', 'testing');

        // The webpush config defaults to env('DB_CONNECTION') which the dev shell
        // exports as 'mysql'. Without this override the push_subscriptions
        // migration would run against the real MySQL dev database during tests.
        $app['config']->set('webpush.database_connection', null);

        return $app;
    }
}
