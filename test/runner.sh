#!/usr/bin/env bash

set -eo pipefail;

requireEnv() {
  test "${!1}" || (echo "Environment Variable '$1' not found" && exit 1)
}
requireEnv SERVICE_NAME

echo '---'
FLAGS="--set-env-vars NAME=$NAME" test/deploy.sh

echo
echo '---'
echo

# Register post-test cleanup.
# Only needed if deploy completed.
function cleanup {
  set -x
  gcloud run services delete ${SERVICE_NAME} \
    --platform=managed \
    --region="${REGION:-us-central1}" \
    --quiet
}
trap cleanup EXIT

# TODO: Perform authentication inside the test.
export ID_TOKEN=$(gcloud auth print-identity-token)
export BASE_URL=$(test/url.sh)

test -z "$BASE_URL" && echo "BASE_URL value is empty" && exit 1

# Do not use exec to preserve trap behavior.
"$@"
