pipeline {
  agent any

  environment {
    DOCKER_COMPOSE_FILE = 'streaming-server/docker-compose.yml'
    AWS_REGION = 'your-aws-region'
    AWS_EB_ENVIRONMENT_NAME = 'your-eb-environment-name'
  }

  stages {
    stage('Build and Push Docker Images') {
      steps {
        script {
          docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
            sh 'docker-compose -f ${DOCKER_COMPOSE_FILE} build'
            sh 'docker push gabrielmorettii/streaming-server_api'
            sh 'docker push gabrielmorettii/streaming-server_client'
          }
        }
      }
    }
  }
}
