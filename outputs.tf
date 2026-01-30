output "frontend_url" {
  value = "http://${aws_instance.web_server.public_ip}:5173"
}

output "backend_url" {
  value = "http://${aws_instance.web_server.public_ip}:5000"
}

output "ssh_command" {
  value = "ssh -i mafia-key.pem ubuntu@${aws_instance.web_server.public_ip}"
}