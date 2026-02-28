pipeline {
  agent any

  options {
    timestamps()
  }

  environment {
    COMPOSE_PROJECT_NAME = "inventory"
    DOCKER_CLIENT_TIMEOUT = "180"
    COMPOSE_HTTP_TIMEOUT = "180"
  }

  stages {
    stage("Checkout") {
      steps {
        checkout scm
      }
    }

    stage("Clean Up") {
      steps {
        bat "docker compose down --remove-orphans || exit /b 0"
      }
    }

    stage("Pre-pull Base Images") {
      steps {
        powershell '''
          $ErrorActionPreference = "Stop"
          $images = @(
            "python:3.10-slim",
            "node:20-alpine",
            "nginx:1.27-alpine",
            "mysql:8",
            "mongo:6"
          )
          foreach ($image in $images) {
            Write-Host "Pulling $image..."
            $pulled = $false
            for ($i = 0; $i -lt 5; $i++) {
              docker pull $image | Out-Host
              if ($LASTEXITCODE -eq 0) { $pulled = $true; break }
              Start-Sleep -Seconds 5
            }
            if (-not $pulled) { throw "Failed to pull $image" }
          }
        '''
      }
    }

    stage("Build Images") {
      steps {
        retry(3) {
          bat "docker compose build"
        }
      }
    }

    stage("Start Databases") {
      steps {
        bat "docker compose up -d mysql mongo"
        powershell '''
          $ErrorActionPreference = "Stop"
          Write-Host "Waiting for MySQL..."
          $ready = $false
          for ($i = 0; $i -lt 60; $i++) {
            docker compose exec -T mysql mysqladmin ping -h 127.0.0.1 -proot | Out-Null
            if ($LASTEXITCODE -eq 0) { $ready = $true; break }
            Start-Sleep -Seconds 2
          }
          if (-not $ready) { throw "MySQL not ready" }

          Write-Host "Waiting for Mongo..."
          $ready = $false
          for ($i = 0; $i -lt 60; $i++) {
            docker compose exec -T mongo mongosh --eval "db.runCommand({ ping: 1 })" | Out-Null
            if ($LASTEXITCODE -eq 0) { $ready = $true; break }
            Start-Sleep -Seconds 2
          }
          if (-not $ready) { throw "Mongo not ready" }
        '''
      }
    }

    stage("Run Tests") {
      steps {
        bat "docker compose run --rm backend pytest -q"
      }
    }

    stage("Start Full Stack") {
      steps {
        bat "docker compose up -d"
      }
    }
  }

  post {
    always {
      bat "docker compose ps"
    }
    success {
      echo "Frontend: http://<JENKINS_AGENT_HOST>:3000"
      echo "Backend API: http://<JENKINS_AGENT_HOST>:8000"
    }
  }
}
