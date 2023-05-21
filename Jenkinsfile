pipeline {
  agent any

  environment {
    AWS_REGION = 'us-east-1'
    AWS_EB_ENVIRONMENT_NAME = 'Node-streaming-env'
    AWS_EB_APPLICATION_NAME = 'node-streaming'
    ZIP_FILE_NAME = 'app.zip'
    S3_BUCKET = 'elasticbeanstalk-us-east-1-544341614012'
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

    stage('Package docker-compose.yml') {
      steps {
        sh 'zip $ZIP_FILE_NAME docker-compose.yml'
      }
    }

     stage('Deploy to S3') {
        steps {
            withCredentials([
                awsAccessKeyVariable(credentialsId: 'AWS_ACCESS_KEY_ID', variable: 'AWS_ACCESS_KEY_ID'),
                awsSecretKeyVariable(credentialsId: 'AWS_SECRET_ACCESS_KEY', variable: 'AWS_SECRET_ACCESS_KEY')
            ]) {
                sh 'aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID'
                sh 'aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY'
                sh 'aws configure set default.region $AWS_REGION'
                
                sh 'aws s3 cp $ZIP_FILE_NAME s3://$S3_BUCKET/$ZIP_FILE_NAME'
            }
        }
      }

      stage('Deploy to Elastic Beanstalk') {
            steps {
                withCredentials([
                    awsAccessKeyVariable(credentialsId: 'AWS_ACCESS_KEY_ID', variable: 'AWS_ACCESS_KEY_ID'),
                    awsSecretKeyVariable(credentialsId: 'AWS_SECRET_ACCESS_KEY', variable: 'AWS_SECRET_ACCESS_KEY')
                ]) {
                    sh 'aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID'
                    sh 'aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY'
                    sh 'aws configure set default.region $AWS_REGION'
                    
                    sh 'aws elasticbeanstalk create-application-version --application-name $AWS_EB_APPLICATION_NAME --version-label app-${BUILD_NUMBER} --source-bundle S3Bucket=$S3_BUCKET,S3Key=$ZIP_FILE_NAME'
                    
                    sh 'aws elasticbeanstalk update-environment --environment-name $AWS_EB_ENVIRONMENT_NAME --version-label app-${BUILD_NUMBER}'
                }
            }
        }
  }
}
