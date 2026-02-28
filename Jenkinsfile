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
        sh "docker compose down --remove-orphans || true"
      }
    }

    stage("Build Images") {
      steps {
        sh "docker compose build"
      }
    }

    stage("Start Databases") {
      steps {
        sh "docker compose up -d mysql mongo"
        sh """
          echo "Waiting for MySQL..."
          until docker compose exec -T mysql mysqladmin ping -h 127.0.0.1 -proot >/dev/null 2>&1; do
            sleep 2
          done
          echo "Waiting for Mongo..."
          until docker compose exec -T mongo mongosh --eval 'db.runCommand({ ping: 1 })' >/dev/null 2>&1; do
            sleep 2
          done
        """
      }
    }

    stage("Run Tests") {
      steps {
        sh "docker compose run --rm backend pytest -q"
      }
    }

    stage("Start Full Stack") {
      steps {
        sh "docker compose up -d"
      }
    }
  }

  post {
    always {
      sh "docker compose ps"
    }
    success {
      echo "Frontend: http://<JENKINS_AGENT_HOST>:3000"
      echo "Backend API: http://<JENKINS_AGENT_HOST>:8000"
    }
  }
}
