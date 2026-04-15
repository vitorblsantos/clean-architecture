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

