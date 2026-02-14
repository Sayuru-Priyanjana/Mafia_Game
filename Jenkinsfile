pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = 'dockerhub'                 
        DOCKERHUB_USERNAME    = 'sayurupriyanjana'             
        // REMOVED IMAGE_TAG from here because code isn't checked out yet!
        
        AWS_CREDS = credentials('aws-credentials') 
        AWS_ACCESS_KEY_ID     = "${AWS_CREDS_USR}"
        AWS_SECRET_ACCESS_KEY = "${AWS_CREDS_PSW}"
        AWS_REGION            = "ap-south-1"
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
                script {
                    // CALCULATE TAG HERE (After checkout)
                    env.IMAGE_TAG = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    echo "Image Tag Generated: ${env.IMAGE_TAG}"
                }
            }
        }

        stage('Build and Tag Images') {
            steps {
                script {
                    echo "Building Backend..."
                    sh "docker build -t ${DOCKERHUB_USERNAME}/mafia-backend:${env.IMAGE_TAG} -t ${DOCKERHUB_USERNAME}/mafia-backend:latest ./backend"
                    
                    echo "Building Frontend..."
                    sh "docker build -t ${DOCKERHUB_USERNAME}/mafia-frontend:${env.IMAGE_TAG} -t ${DOCKERHUB_USERNAME}/mafia-frontend:latest ./frontend"
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKERHUB_CREDENTIALS) {
                        sh """
                        docker push ${DOCKERHUB_USERNAME}/mafia-backend:${env.IMAGE_TAG}
                        docker push ${DOCKERHUB_USERNAME}/mafia-backend:latest
                        docker push ${DOCKERHUB_USERNAME}/mafia-frontend:${env.IMAGE_TAG}
                        docker push ${DOCKERHUB_USERNAME}/mafia-frontend:latest
                        """
                    }
                }
            }
        }

        stage('Provision Infrastructure') {
            steps {
                script {
                    sh "terraform init"
                    sh "terraform apply -auto-approve"
                    
                    env.EC2_IP = sh(script: "terraform output -raw ec2_public_ip", returnStdout: true).trim()
                    
                    echo "Instance created at: ${env.EC2_IP}"
                    echo "Waiting 60 seconds for EC2 instance to initialize SSH..."
                    sleep 60
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                script {
                    sh "chmod 400 mafia-key.pem"
                    
                    // Copy docker-compose
                    sh "scp -i mafia-key.pem -o StrictHostKeyChecking=no docker-compose.deploy.yml ubuntu@${env.EC2_IP}:/home/ubuntu/docker-compose.yml"
                    
                    // Deploy
                    sh """
                        ssh -i mafia-key.pem -o StrictHostKeyChecking=no ubuntu@${env.EC2_IP} '
                            cd /home/ubuntu
                            echo "IMAGE_TAG=${env.IMAGE_TAG}" > .env
                            sudo docker compose pull
                            sudo docker compose up -d --remove-orphans
                        '
                    """
                }
            }
        }
    }

    post {
        success {
            echo "Deployment Successful! App is running at http://${env.EC2_IP}:5173"
        }
        failure {
            echo "Pipeline failed."
        }
    }
}