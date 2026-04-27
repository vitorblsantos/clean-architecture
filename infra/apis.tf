locals {
  required_apis = [
    "run.googleapis.com",
    "compute.googleapis.com",
    "iam.googleapis.com",
    "cloudtasks.googleapis.com",
  ]
}

resource "google_project_service" "required" {
  for_each = toset(local.required_apis)

  project            = var.project_id
  service            = each.key
  disable_on_destroy = false
}
