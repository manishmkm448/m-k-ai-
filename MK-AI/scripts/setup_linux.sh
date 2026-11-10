#!/usr/bin/env bash
# ==============================================================================
# M.K AI — Kali Linux & Debian Sovereign Setup Script
# Creator: Manish Meena
# Tagline: Your Intelligence. Your Control.
# ==============================================================================

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}==========================================================${NC}"
echo -e "${CYAN}  M.K AI — KALI LINUX & DEBIAN SOVEREIGN INSTALLER        ${NC}"
echo -e "${CYAN}  Creator: Manish Meena                                   ${NC}"
echo -e "${CYAN}  Tagline: Your Intelligence. Your Control.               ${NC}"
echo -e "${CYAN}==========================================================${NC}"

# Check root or sudo
if [ "$EUID" -ne 0 ]; then
    echo -e "${YELLOW}Notice: Running as non-root user. Sudo will be used for package installations.${NC}"
fi

echo -e "\n${YELLOW}[1/5] Updating package lists & installing system dependencies...${NC}"
sudo apt update -y
sudo apt install -y python3 python3-pip python3-venv git curl build-essential libssl-dev libffi-dev

echo -e "\n${YELLOW}[2/5] Setting up Python virtual environment...${NC}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="${SCRIPT_DIR}/../backend"

cd "${BACKEND_DIR}"
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo -e "${GREEN}Created virtual environment in ${BACKEND_DIR}/venv${NC}"
fi

source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
echo -e "${GREEN}Python requirements installed successfully.${NC}"

echo -e "\n${YELLOW}[3/5] Verifying Kali Linux Cyber Tools integration...${NC}"
for tool in nmap wireshark nikto sqlmap netcat; do
    if command -v $tool &> /dev/null; then
        echo -e "${GREEN}✓ Detected cyber tool: $tool${NC}"
    else
        echo -e "${YELLOW}○ Optional tool $tool not found in PATH (Install via: sudo apt install $tool)${NC}"
    fi
done

echo -e "\n${YELLOW}[4/5] Checking Ollama Offline Local AI Engine...${NC}"
if command -v ollama &> /dev/null; then
    echo -e "${GREEN}✓ Ollama is installed. Local models ready for offline intelligence.${NC}"
else
    echo -e "${YELLOW}Ollama not detected. Installing via official curl script...${NC}"
    curl -fsSL https://ollama.com/install.sh | sh || true
fi

echo -e "\n${YELLOW}[5/5] Creating systemd service or desktop launcher...${NC}"
DESKTOP_FILE="$HOME/.local/share/applications/mk-ai.desktop"
mkdir -p "$HOME/.local/share/applications"

cat <<EOF > "$DESKTOP_FILE"
[Desktop Entry]
Name=M.K AI
Comment=Sovereign Advanced Personal AI Ecosystem by Manish Meena
Exec=bash -c "cd ${BACKEND_DIR} && source venv/bin/activate && python3 main.py"
Terminal=true
Type=Application
Icon=utilities-terminal
Categories=Utility;Development;Security;
EOF

chmod +x "$DESKTOP_FILE"
echo -e "${GREEN}Desktop launcher created at ${DESKTOP_FILE}${NC}"

echo -e "\n${CYAN}==========================================================${NC}"
echo -e "${GREEN}M.K AI setup completed successfully on Kali Linux!${NC}"
echo -e "To start the system:"
echo -e "  cd ${BACKEND_DIR}"
echo -e "  source venv/bin/activate"
echo -e "  python3 main.py"
echo -e "${CYAN}==========================================================${NC}"
