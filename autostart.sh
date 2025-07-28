#!/bin/bash
#source /home/test/.bashrc

# Add node and pnpm to the PATH
export PATH="$HOME/.local/share/pnpm:$HOME/.nvm/versions/node/v22.14.0/bin:$PATH"
cd /home/test/gascon-ihm || exit 1
pnpm dev:full >> /home/test/pnpm.log 2>&1 &
sleep 10
chromium-browser --kiosk http://localhost:3000 >> /home/test/chromium.log 2>&1 &