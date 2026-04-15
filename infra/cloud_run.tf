data "google_compute_default_service_account" "cloud_run_runtime" {
  project = var.project_id
}

resource "google_service_account_iam_member" "cicd_act_as_cloud_run_runtime" {
  service_account_id = data.google_compute_default_service_account.cloud_run_runtime.id
  role               = "roles/iam.serviceAccountUser"
  member             = "serviceAccount:${var.cicd_terraform_sa_email}"
}

resource "google_cloud_run_v2_service" "app" {
  name     = var.service_name
  location = var.region

  depends_on = [google_project_service.required]

  ingress = "INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER"

  template {
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

      env {
        name  = "PORT"
        value = tostring(var.container_port)
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
