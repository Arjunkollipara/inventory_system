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

    stage("Build Images") {
      steps {
        echo "Build skipped (using local images)."
      }
    }

    stage("Start Full Stack") {
      steps {
        bat "docker compose up -d --no-build"
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
