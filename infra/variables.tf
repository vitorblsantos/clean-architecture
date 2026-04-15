variable "project_id" {
  type        = string
  description = "ID do projeto GCP (Configurações do projeto — não use nome de usuário do GitHub)."
}

variable "project_number" {
  type        = string
  description = "Número do projeto (só dígitos; Configurações do projeto). Usado no principal serverless-robot do load balancer."

  validation {
    condition     = can(regex("^[0-9]+$", var.project_number))
    error_message = "project_number deve ser o número do projeto no GCP (apenas dígitos)."
  }
}

variable "region" {
  type        = string
  description = "Região do Cloud Run e do Serverless NEG."
  default     = "southamerica-east1"
}

variable "service_name" {
  type        = string
  description = "Nome do serviço Cloud Run e prefixo dos recursos de rede."
  default     = "app"
}

variable "container_port" {
  type        = number
  description = "Porta exposta pelo container (igual ao APP_PORT da aplicação)."
  default     = 8080
}

variable "image" {
  type        = string
  description = "Imagem no Artifact Registry: LOCATION-docker.pkg.dev/PROJECT/REPO/IMAGE:TAG"
}

variable "domain" {
  type        = string
  description = "FQDN para o certificado gerenciado (ex: api.exemplo.com). DNS deve apontar para o IP do LB após o apply."
}

variable "cloud_run_max_instances" {
  type        = number
  description = "Máximo de instâncias Cloud Run."
  default     = 10
}

variable "cloud_run_min_instances" {
  type        = number
  description = "Mínimo de instâncias (0 permite scale-to-zero)."
  default     = 0
}

variable "cloud_run_cpu" {
  type        = string
  description = "CPU por instância (ex: 1)."
  default     = "1"
}

variable "cloud_run_memory" {
  type        = string
  description = "Memória por instância (ex: 512Mi)."
  default     = "512Mi"
}
