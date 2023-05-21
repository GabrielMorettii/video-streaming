pipeline {
  agent any

  environment {
    DOCKER_COMPOSE_FILE = 'streaming-server/docker-compose-dev.yml'
    AWS_REGION = 'us-east-1'
    AWS_EB_ENVIRONMENT_NAME = 'Node-streaming-env'
  }

  stages {
    stage('Build and Push Docker Images') {
      steps {
        script {
          docker.withRegistry('', 'docker-hub-credentials') {
            sh 'docker build -t gabrielmorettii/streaming-server_api -f streaming-server/server/Dockerfile streaming-server/server'
            sh 'docker build -t gabrielmorettii/streaming-server_client -f streaming-server/client/Dockerfile streaming-server/client'
            sh 'docker push gabrielmorettii/streaming-server_api'
            sh 'docker push gabrielmorettii/streaming-server_client'
          }
        }
      }
    }

    //  stage('Deploy to Elastic Beanstalk') {
    //   steps {
    //     script {
    //       withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', accessKeyVariable: 'AWS_ACCESS_KEY_ID', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
    //         sh 'aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID'
    //         sh 'aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY'
    //         sh 'aws configure set default.region $AWS_REGION'

    //         sh "aws elasticbeanstalk update-environment --region $AWS_REGION --environment-name $AWS_EB_ENVIRONMENT_NAME --version-label app-${BUILD_NUMBER}"
    //       }
    //     }
    //   }
    // }
  }
}
