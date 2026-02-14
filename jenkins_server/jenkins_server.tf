resource "aws_security_group" "jenkins_sg" {
  name        = "jenkins-server-sg-v2" # Unique name to avoid previous errors
  description = "Allow Jenkins, SSH, and App traffic"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "jenkins_master" {
  ami                    = "ami-0ff91eb5c6fe7cc86" # Ubuntu 22.04 LTS ap-south-1
  instance_type          = "t3.small" 
  key_name               = "mafia-key"
  vpc_security_group_ids = [aws_security_group.jenkins_sg.id]

  user_data = <<-EOF
              #!/bin/bash
              # 1. Install Java
              sudo apt update -y
              sudo apt install -y fontconfig openjdk-17-jre

              # 2. Install Jenkins with correct GPG key handling
              sudo wget -O /usr/share/keyrings/jenkins-keyring.asc https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
              echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
              sudo apt update -y
              sudo apt install -y jenkins
              sudo systemctl enable jenkins
              sudo systemctl start jenkins

              # 3. Install Docker
              sudo apt install -y docker.io
              sudo usermod -aG docker jenkins
              sudo usermod -aG docker ubuntu

              # 4. Install Terraform
              sudo apt install -y gnupg software-properties-common
              wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
              echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
              sudo apt update -y
              sudo apt install -y terraform

              # 5. Restart Jenkins to apply group changes
              sudo systemctl restart jenkins
              EOF

  tags = {
    Name = "Jenkins-Master-Fixed"
  }
}

output "jenkins_url" {
  description = "Access Jenkins at this URL"
  value       = "http://${aws_instance.jenkins_master.public_ip}:8080"
}

output "initial_admin_password_cmd" {
  description = "Run this command via SSH to get the unlock password"
  value       = "sudo cat /var/lib/jenkins/secrets/initialAdminPassword"
}