pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = 'dockerhub'                 
        DOCKERHUB_USERNAME = 'sayurupriyanjana'             
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
                    sh "docker compose build"
                }
            }
        }

        stage('Tag Images for Docker Hub') {
            steps {
                script {
                    
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


            stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    script {
                        def EC2_IP = "52.66.24.111" // <--- PUT YOUR EC2 IP HERE
                        
                        // 1. Copy the deployment compose file to the server
                        sh "scp -o StrictHostKeyChecking=no docker-compose.deploy.yml ubuntu@${EC2_IP}:/home/ubuntu/docker-compose.yml"
                        
                        // 2. SSH in and restart containers
                        def remoteCommand = """
                            cd /home/ubuntu
                            
                            # Create an .env file so Docker knows what 'IMAGE_TAG' is
                            echo "IMAGE_TAG=${IMAGE_TAG}" > .env
                            
                            # Pull new images and restart
                            sudo docker compose pull
                            sudo docker compose up -d
                        """
                        
                        sh "ssh -o StrictHostKeyChecking=no ubuntu@${EC2_IP} '${remoteCommand}'"
                    }
                }
            }
        }

    }

    post {
        success {
            echo "Successfully built and pushed both backend and frontend images!"
        }
        failure {
            echo "Build or push failed. Check Jenkins logs for details."
        }
    }
}
