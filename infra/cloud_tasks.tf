resource "google_cloud_tasks_queue" "profile_update" {
  project  = var.project_id
  location = var.region
  name     = "${var.service_name}-update-profiles"

  rate_limits {
    max_dispatches_per_second = 5
    max_concurrent_dispatches = 100
  }

  retry_config {
    max_attempts       = 3
    max_retry_duration = "0s"
    min_backoff        = "0.1s"
    max_backoff        = "60s"
    max_doublings      = 16
  }

  depends_on = [google_project_service.required]
}

resource "google_cloud_tasks_queue_iam_member" "cloud_run_enqueuer" {
  project  = google_cloud_tasks_queue.profile_update.project
  location = google_cloud_tasks_queue.profile_update.location
  name     = google_cloud_tasks_queue.profile_update.name
  role     = "roles/cloudtasks.enqueuer"
  member   = "serviceAccount:${google_service_account.cloud_run_runtime.email}"
}
