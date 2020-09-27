#!/usr/bin/env bash

set -eo pipefail;

requireEnv() {
  test "${!1}" || (echo "Environment Variable '$1' not found" && exit 1)
}

requireEnv SERVICE_NAME

set -x
gcloud run services \
  describe "${SERVICE_NAME}" \
  --region="${REGION:-us-central1}" \
  --format='value(status.url)' \
  --platform=managed
