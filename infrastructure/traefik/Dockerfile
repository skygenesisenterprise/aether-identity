FROM traefik:v3.2

# Créer un entrypoint personnalisé qui force la version API
RUN echo '#!/bin/sh' > /custom-entrypoint.sh && \
    echo 'export DOCKER_API_VERSION=1.44' >> /custom-entrypoint.sh && \
    echo 'exec /entrypoint.sh "$@"' >> /custom-entrypoint.sh && \
    chmod +x /custom-entrypoint.sh

ENTRYPOINT ["/custom-entrypoint.sh"]