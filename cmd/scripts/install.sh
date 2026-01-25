#!/bin/bash

# Installation script for Aether Identity Console
set -e

echo "Installing Aether Identity Console..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root"
    exit 1
fi

# Build the binary
echo "Building identityctl..."
make build

# Install binary
echo "Installing binary to /usr/local/bin..."
cp build/identityctl /usr/local/bin/
chmod +x /usr/local/bin/identityctl

# Install shell wrapper
echo "Installing shell wrapper..."
cp scripts/login-shell.sh /usr/local/bin/identityctl-shell
chmod +x /usr/local/bin/identityctl-shell

# Install systemd service
echo "Installing systemd service..."
cp scripts/identityctl.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable identityctl

# Setup shell as default for root user
echo "Setting up default shell..."
echo "export IDENTITYCTL_SHELL=true" >> /root/.bashrc

# Set motd
echo "Setting up motd..."
cat > /etc/motd << 'EOF'
Welcome to Aether Identity!
Type 'identityctl' to access the console management.
EOF

echo "Installation completed!"
echo "Run 'systemctl start identityctl' to start the service"
echo "Run 'identityctl' to access the console"