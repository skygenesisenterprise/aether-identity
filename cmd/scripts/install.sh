#!/bin/bash

# Installation script for Aether Vault Console
set -e

echo "Installing Aether Vault Console..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root"
    exit 1
fi

# Build the binary
echo "Building vaultctl..."
make build

# Install binary
echo "Installing binary to /usr/local/bin..."
cp build/vaultctl /usr/local/bin/
chmod +x /usr/local/bin/vaultctl

# Install shell wrapper
echo "Installing shell wrapper..."
cp scripts/login-shell.sh /usr/local/bin/vaultctl-shell
chmod +x /usr/local/bin/vaultctl-shell

# Install systemd service
echo "Installing systemd service..."
cp scripts/vaultctl.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable vaultctl

# Setup shell as default for root user
echo "Setting up default shell..."
echo "export VAULTCTL_SHELL=true" >> /root/.bashrc

# Set motd
echo "Setting up motd..."
cat > /etc/motd << 'EOF'
Welcome to Aether Vault!
Type 'vaultctl' to access the console management.
EOF

echo "Installation completed!"
echo "Run 'systemctl start vaultctl' to start the service"
echo "Run 'vaultctl' to access the console"