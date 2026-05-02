#!/bin/bash
cd /Users/ivan/edu/ai-for-developers/hands-on/ai-for-developers-project-386/backend
php bin/console doctrine:database:create --if-not-exists 2>&1 | tail -5
php bin/console make:migration --no-interaction 2>&1 | tail -5
php bin/console doctrine:migrations:migrate --no-interaction 2>&1 | tail -10
