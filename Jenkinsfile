pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = 'dockerhub'      // Jenkins credentials ID
        DOCKERHUB_USERNAME = 'sayurupriyanjana'            // your Docker Hub username
        IMAGE_TAG = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Images with Compose') {
            steps {
                script {
                    // Build all services defined in docker-compose.yml
                    sh "docker-compose build"
                }
            }
        }

        stage('Tag Images for Docker Hub') {
            steps {
                script {
                    // Tag backend and frontend images
                    sh """
                    docker tag mafia_backend ${DOCKERHUB_USERNAME}/mafia-backend:${IMAGE_TAG}
                    docker tag mafia_backend ${DOCKERHUB_USERNAME}/mafia-backend:latest
                    docker tag mafia_frontend ${DOCKERHUB_USERNAME}/mafia-frontend:${IMAGE_TAG}
                    docker tag mafia_frontend ${DOCKERHUB_USERNAME}/mafia-frontend:latest
                    """
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKERHUB_CREDENTIALS) {
                        sh """
                        docker push ${DOCKERHUB_USERNAME}/mafia-backend:${IMAGE_TAG}
                        docker push ${DOCKERHUB_USERNAME}/mafia-backend:latest
                        docker push ${DOCKERHUB_USERNAME}/mafia-frontend:${IMAGE_TAG}
                        docker push ${DOCKERHUB_USERNAME}/mafia-frontend:latest
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Successfully built and pushed both backend and frontend images!"
        }
        failure {
            echo "❌ Build or push failed. Check Jenkins logs for details."
        }
    }
}
