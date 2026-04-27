output "load_balancer_ip" {
  description = "IP global do balanceador. Aponte o DNS A/AAAA do domínio para este IP."
  value       = google_compute_global_address.lb.address
}

output "cloud_run_uri" {
  description = "URI interna do Cloud Run (tráfego público deve vir pelo LB com ingress atual)."
  value       = google_cloud_run_v2_service.app.uri
}

output "cloud_run_name" {
  value = google_cloud_run_v2_service.app.name
}

output "profile_update_queue_name" {
  description = "Nome da fila do Cloud Tasks para enfileirar atualizações de perfil."
  value       = google_cloud_tasks_queue.profile_update.name
}

output "profile_update_queue_id" {
  description = "ID completo da fila (projects/.../locations/.../queues/...)."
  value       = google_cloud_tasks_queue.profile_update.id
}

