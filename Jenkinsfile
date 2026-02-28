pipeline {
  agent any

  options {
    timestamps()
  }

  environment {
    COMPOSE_PROJECT_NAME = "inventory"
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

    stage("Build Images") {
      steps {
        bat "docker compose build"
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
