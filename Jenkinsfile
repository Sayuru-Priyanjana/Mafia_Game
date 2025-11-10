// pipeline {
//     agent any

//     environment {
//         DOCKERHUB_CREDENTIALS = 'dockerhub'
//         DOCKERHUB_USERNAME = 'sayurupriyanjana'  // <-- replace with your Docker Hub username
//         IMAGE_TAG = "build-${env.BUILD_NUMBER}"
//     }

//     stages {
//         stage('Checkout Code') {
//             steps {
//                 git branch: 'main', url: 'https://github.com/Sayuru-Priyanjana/Mafia_Game.git'
//             }
//         }

//         stage('Build and Push with Docker Compose') {
//             steps {
//                 script {
//                     docker.withRegistry('https://index.docker.io/v1/', DOCKERHUB_CREDENTIALS) {

//                         // Build images defined in docker-compose.yml
//                         sh 'docker-compose build'

//                         // Tag and push both frontend and backend
//                         sh """
//                         docker tag mafia_game-frontend ${DOCKERHUB_USERNAME}/mafia-frontend:${IMAGE_TAG}
//                         docker tag mafia_game-backend ${DOCKERHUB_USERNAME}/mafia-backend:${IMAGE_TAG}

//                         docker push ${DOCKERHUB_USERNAME}/mafia-frontend:${IMAGE_TAG}
//                         docker push ${DOCKERHUB_USERNAME}/mafia-backend:${IMAGE_TAG}

//                         # Optional: push 'latest' tag too
//                         docker tag mafia_game-frontend ${DOCKERHUB_USERNAME}/mafia-frontend:latest
//                         docker tag mafia_game-backend ${DOCKERHUB_USERNAME}/mafia-backend:latest
//                         docker push ${DOCKERHUB_USERNAME}/mafia-frontend:latest
//                         docker push ${DOCKERHUB_USERNAME}/mafia-backend:latest
//                         """
//                     }
//                 }
//             }
//         }
//     }

//     post {
//         success {
//             echo "✅ Successfully built and pushed both images to Docker Hub."
//         }
//         failure {
//             echo "❌ Build failed! Check logs."
//         }
//     }
// }


pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                echo '✅ Jenkinsfile is detected and running correctly!'
            }
        }
    }
}
