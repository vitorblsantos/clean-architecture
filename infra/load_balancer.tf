resource "google_compute_region_network_endpoint_group" "serverless" {
  name                  = "${var.service_name}-neg"
  region                = var.region
  network_endpoint_type = "SERVERLESS"

  cloud_run {
    service = google_cloud_run_v2_service.app.name
  }
}

resource "google_compute_backend_service" "app" {
  name                  = "${var.service_name}-backend"
  protocol              = "HTTP"
  port_name             = "http"
  load_balancing_scheme = "EXTERNAL"
  timeout_sec           = 30

  backend {
    group = google_compute_region_network_endpoint_group.serverless.id
  }
}

resource "google_compute_managed_ssl_certificate" "app" {
  name = "${var.service_name}-cert"

  managed {
    domains = [var.domain]
  }
}

resource "google_compute_url_map" "https" {
  name            = "${var.service_name}-https-urlmap"
  default_service = google_compute_backend_service.app.id
}

resource "google_compute_target_https_proxy" "app" {
  name             = "${var.service_name}-https-proxy"
  url_map          = google_compute_url_map.https.id
  ssl_certificates = [google_compute_managed_ssl_certificate.app.id]
}

resource "google_compute_global_address" "lb" {
  name = "${var.service_name}-lb-ip"
}

resource "google_compute_global_forwarding_rule" "https" {
  name                  = "${var.service_name}-https"
  load_balancing_scheme = "EXTERNAL"
  target                = google_compute_target_https_proxy.app.id
  port_range            = "443"
  ip_address            = google_compute_global_address.lb.address
}

resource "google_compute_url_map" "http_redirect" {
  name = "${var.service_name}-http-redirect"

  default_url_redirect {
    https_redirect         = true
    strip_query            = false
    redirect_response_code = "MOVED_PERMANENTLY_DEFAULT"
  }
}

resource "google_compute_target_http_proxy" "http_redirect" {
  name    = "${var.service_name}-http-redirect-proxy"
  url_map = google_compute_url_map.http_redirect.id
}

resource "google_compute_global_forwarding_rule" "http" {
  name                  = "${var.service_name}-http"
  load_balancing_scheme = "EXTERNAL"
  target                = google_compute_target_http_proxy.http_redirect.id
  port_range            = "80"
  ip_address            = google_compute_global_address.lb.address
}
