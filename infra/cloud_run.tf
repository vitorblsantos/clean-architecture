resource "google_service_account" "cloud_run_runtime" {
  project      = var.project_id
  account_id   = "${var.service_name}-cloud-run"
  display_name = "Cloud Run runtime (${var.service_name})"
  depends_on   = [google_project_service.required]
}

resource "google_project_iam_member" "cloud_run_runtime_logging" {
  project = var.project_id
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${google_service_account.cloud_run_runtime.email}"

  depends_on = [google_service_account.cloud_run_runtime]
}

resource "google_project_iam_member" "cloud_run_runtime_monitoring" {
  project = var.project_id
  role    = "roles/monitoring.metricWriter"
  member  = "serviceAccount:${google_service_account.cloud_run_runtime.email}"

  depends_on = [google_service_account.cloud_run_runtime]
}

resource "google_cloud_run_v2_service" "app" {
  name     = var.service_name
  location = var.region

  depends_on = [
    google_project_service.required,
    google_project_iam_member.cloud_run_runtime_logging,
    google_project_iam_member.cloud_run_runtime_monitoring,
  ]

  ingress = "INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER"

  template {
    service_account = google_service_account.cloud_run_runtime.email

    vpc_access {
      network_interfaces {
        network    = "default"
        subnetwork = "default"
      }
      egress = "PRIVATE_RANGES_ONLY"
    }

    containers {
      image = var.image
      ports {
        container_port = var.container_port
      }

      resources {
        limits = {
          cpu    = var.cloud_run_cpu
          memory = var.cloud_run_memory
        }
      }
    }

    scaling {
      min_instance_count = var.cloud_run_min_instances
      max_instance_count = var.cloud_run_max_instances
    }
  }
}

resource "google_cloud_run_v2_service_iam_member" "load_balancer_invoker" {
  project  = var.project_id
  location = google_cloud_run_v2_service.app.location
  name     = google_cloud_run_v2_service.app.name
  role     = "roles/run.invoker"
  member   = "serviceAccount:service-${var.project_number}@serverless-robot-prod.iam.gserviceaccount.com"
}
