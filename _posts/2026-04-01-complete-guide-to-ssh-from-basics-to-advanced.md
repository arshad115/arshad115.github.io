---
title: "Complete Guide to SSH: From Basics to Advanced"
category: DevOps
tags:
  - ssh
  - security
  - linux
  - terminal
  - remote-access
toc: true  # Table of contents
toc_sticky: true  # Sticky TOC
comments: true
date: 2026-04-01
last_modified_at: 2026-04-01
author_profile: true
read_time: true
share: true
related: true
excerpt: "Master SSH from connection basics to advanced file transfers. Learn authentication methods, key management, remote command execution, and security best practices."
---

SSH (Secure Shell) is the foundation of secure remote access to servers and systems. This guide covers everything from basics to advanced usage, with practical examples you can use immediately.

## Table of Contents

- [SSH Basics](#ssh-basics)
- [Authentication Methods](#authentication-methods)
- [Key Management](#key-management)
- [Remote Command Execution](#remote-command-execution)
- [File Transfers](#file-transfers)
- [Advanced Techniques](#advanced-techniques)
- [Troubleshooting](#troubleshooting)
- [Security Best Practices](#security-best-practices)

## SSH Basics

SSH lets you securely connect to remote servers, execute commands, and transfer files over encrypted connections.

### Basic Connection Syntax

```bash
ssh [options] [user@]hostname
ssh user@192.168.1.100
ssh root@example.com
```

The default SSH port is **22**, but servers often use custom ports for security.

**Full TIL:** [SSH Connection Basics: Password, Keys, and Parameters](/today-i-learned/ssh/ssh-connection-basics/)

## Authentication Methods

SSH supports two primary authentication methods:

### 1. Password Authentication

The simplest method—SSH prompts for password each time:

```bash
ssh user@hostname
# Prompted for password
```

**Drawbacks:**
- Requires typing password repeatedly
- Vulnerable to brute-force attacks
- Poor for automation and scripts

### 2. Key-Based Authentication (Recommended)

Uses cryptographic key pairs instead of passwords. Much more secure and convenient.

```bash
ssh -i ~/.ssh/id_ed25519 user@hostname
```

**Benefits:**
- ✅ No password to remember
- ✅ Can't be brute-forced
- ✅ Perfect for scripts and automation
- ✅ Passphrase-protected keys for extra security

**Full TIL:** [SSH Connection Basics](/today-i-learned/ssh/ssh-connection-basics/)

## Key Management

### Generating SSH Keys

Modern best practice: use Ed25519 keys (faster, smaller, more secure than RSA):

```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
# Or traditional RSA:
ssh-keygen -t rsa -b 4096
```

Creates two files:
- `~/.ssh/id_ed25519` — **Private key** (keep secret, `chmod 600`)
- `~/.ssh/id_ed25519.pub` — **Public key** (share with servers)

### Using Specific Keys

By default SSH uses keys from `~/.ssh/`. To use a specific key:

```bash
ssh -i /path/to/private/key user@hostname
ssh -i ~/.ssh/custom_key -p 2222 user@hostname
```

### SSH Agent: Never Type Your Passphrase Again

SSH agent stores decrypted keys in memory, so you enter your passphrase once per session instead of per connection.

```bash
# Start the agent (usually automatic)
eval "$(ssh-agent -s)"

# Add your key (prompts for passphrase once)
ssh-add ~/.ssh/id_ed25519

# Now use SSH without typing passphrase
ssh user@hostname  # No passphrase needed!
```

**Useful agent commands:**

```bash
ssh-add -l            # List loaded keys
ssh-add -d ~/.ssh/id  # Remove specific key
ssh-add -D            # Remove all keys
```

**Full TIL:** [Using SSH Agent to Manage Keys](/today-i-learned/ssh/using-ssh-agent-to-manage-keys/)

## Remote Command Execution

Run commands on remote servers without opening an interactive shell:

```bash
ssh user@hostname "command"
ssh user@hostname "ls -la /tmp"
ssh user@hostname "whoami"
```

### Multiple Commands

```bash
# Using && (only runs next if previous succeeds)
ssh user@hostname "cd /tmp && ls -la"

# Using ; (runs regardless)
ssh user@hostname "uptime; df -h"

# Multi-line script
ssh user@hostname << 'EOF'
cd /tmp
ls -la
whoami
EOF
```

### Capturing Output

```bash
ssh user@hostname "ls -la /tmp" > local-file.txt
ssh user@hostname "cat /var/log/syslog" | grep "error" | wc -l
```

### Useful Patterns

```bash
# Check if service is running
ssh user@hostname "systemctl is-active nginx"

# Run with sudo (prompts for password)
ssh user@hostname "sudo systemctl restart nginx"

# Execute local script on remote server
ssh user@hostname < local-script.sh

# Background task
ssh user@hostname "nohup long-task > output.log 2>&1 &"
```

**Full TIL:** [Executing Remote Commands with SSH](/today-i-learned/ssh/executing-remote-commands-with-ssh/)

## File Transfers

### SCP: Simple File Copy

SCP is straightforward for one-off transfers:

```bash
# Local to remote
scp ./file.txt user@hostname:/path/to/remote/

# Remote to local
scp user@hostname:/path/to/file.txt ./local-folder/

# With custom port and key
scp -i ~/.ssh/key -P 2222 ./file.txt user@hostname:/path/
```

**Best for:**
- Quick, small file transfers
- Simple one-time operations

**Full TIL:** [Using SCP for File Transfers](/today-i-learned/ssh/using-scp-for-file-transfers/)

### RSYNC: Smart Synchronization

RSYNC transfers only changed parts and can resume interrupted transfers:

```bash
# Local to remote
rsync -avz ./folder/ user@hostname:/path/to/remote/

# Remote to local
rsync -avz user@hostname:/path/to/folder/ ./local-folder/

# Single file
rsync -avz ./file.txt user@hostname:/path/
```

**Common options:**

| Option | Purpose |
|--------|---------|
| `-a` | Archive mode (preserves permissions, times) |
| `-v` | Verbose output |
| `-z` | Compress during transfer |
| `--delete` | Delete files in destination not in source |
| `--dry-run` | Preview without copying |

**Best for:**
- Large backups
- Repeated syncs
- Resumable transfers

**Full TIL:** [Using RSYNC for File Transfers](/today-i-learned/ssh/using-rsync-for-file-transfers/)

### SCP vs RSYNC

| Feature | SCP | RSYNC |
|---------|-----|-------|
| Speed (first transfer) | Same | Same |
| Incremental | ❌ Full copy | ✅ Only changes |
| Resume | ❌ Restarts | ✅ Continues |
| Complexity | Simple | More options |
| Best use | Quick transfers | Backups, automation |

## Advanced Techniques

### Port Forwarding

**Local port forwarding** — Access remote service through local port:

```bash
ssh -L 8080:localhost:3000 user@hostname -N -f
# Now: localhost:8080 → remote:3000
curl localhost:8080  # Accesses remote service
```

**Remote port forwarding** — Expose local service to remote network:

```bash
ssh -R 8080:localhost:3000 user@hostname -N -f
# Remote can access: localhost:8080 → your local:3000
```

### Custom SSH Config

Create `~/.ssh/config` for easier, personalized connections:

```
Host production
    Hostname example.com
    User deploy
    Port 2222
    IdentityFile ~/.ssh/production_key
    ServerAliveInterval 60
    LogLevel QUIET

Host github
    Hostname github.com
    User git
    IdentityFile ~/.ssh/github_key
```

Now use short names:

```bash
ssh production
ssh github  # For git operations
```

### ProxyJump: Jump Through Bastion Host

Connect through a bastion/jump host:

```bash
ssh -J bastion@jump-host internal@internal-server
# Or in ~/.ssh/config
Host internal-server
    Hostname 10.0.1.5
    ProxyJump jump-host
```

### Quiet Mode

Suppress banners and diagnostic messages:

```bash
ssh -q user@hostname
ssh -q user@hostname "command"
```

**Full TIL:** [SSH Connection Without Welcome Message](/today-i-learned/ssh/ssh-connection-without-welcome-message-or-banner/)

## Troubleshooting

### Host Key Changed Warning

If you see this warning:

```
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@ WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED! @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
```

This happens after server rebuilds or IP changes. Remove the old key:

```bash
ssh-keygen -R hostname.com
# Then reconnect
ssh user@hostname.com
```

**Full TIL:** [Fix REMOTE HOST IDENTIFICATION HAS CHANGED](/today-i-learned/ssh/fix-remote-host-identification-has-changed-warning-with-ssh-keygen-r/)

### Debug Connection Issues

```bash
ssh -v user@hostname          # Verbose output
ssh -vv user@hostname         # More verbose
ssh -vvv user@hostname        # Maximum debug info
```

### Common Issues

**Permission Denied:**
- Check key file permissions: `chmod 600 ~/.ssh/id_ed25519`
- Verify server authorized_keys contains your public key

**Connection Timeout:**
- Check if port is correct: `ssh -p port ...`
- Verify firewall allows SSH traffic
- Test connectivity: `nc -zv hostname port`

**Wrong Key Being Used:**
- Explicitly specify: `ssh -i /path/to/key ...`
- List available keys: `ssh-add -l`

## Security Best Practices

### 1. Use Key-Based Authentication

Never rely on passwords for SSH. Keys are exponentially more secure.

### 2. Protect Your Private Keys

```bash
# Ensure proper permissions
chmod 600 ~/.ssh/id_*

# Use passphrase-protected keys
ssh-keygen -p -f ~/.ssh/id_ed25519  # Change passphrase
```

### 3. Use Ed25519 Keys (Not RSA)

- ✅ Ed25519: Faster, smaller, newer, more secure
- ⚠️ RSA: Still secure, but older (use 4096-bit minimum)

```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
```

### 4. Limit SSH Access on Servers

Edit `/etc/ssh/sshd_config` on your servers:

```bash
# Disable password auth
PasswordAuthentication no

# Disable root login
PermitRootLogin no

# Change default port (security through obscurity is weak, but helps)
Port 2222

# Limit login attempts
MaxAuthTries 3
MaxSessions 10
```

Restart SSH: `sudo systemctl restart ssh` or `sudo systemctl restart sshd`

### 5. Use SSH Agent Instead of Unencrypted Keys

Never use SSH keys without passphrases. Let SSH agent handle the passphrase.

### 6. Monitor SSH Activity

```bash
# View recent SSH attempts
grep "sshd" /var/log/auth.log | tail -20

# See who's currently connected
who
w

# Check SSH public keys authorized on this system
cat ~/.ssh/authorized_keys
```

### 7. Rotate SSH Keys Periodically

Even with secure keys, rotate them every 1-2 years as a best practice.

## Summary

SSH is powerful, but only when used correctly. Key takeaways:

1. **Always use key-based auth** never trust passwords for SSH
2. **Use Ed25519 keys** they're faster, smaller, and more secure
3. **Protect your private keys** with passphrases
4. **Use SSH agent** for convenience without sacrificing security
5. **Keep your `~/.ssh` directory private** (`chmod 700 ~/.ssh`)
6. **Monitor SSH access** on your servers regularly

## Learning Resources

All the TILs referenced in this post (concise, focused guides):

- [SSH Connection Basics](/today-i-learned/ssh/ssh-connection-basics/) — password, keys, parameters
- [SSH Agent](/today-i-learned/ssh/using-ssh-agent-to-manage-keys/) — key management
- [Remote Command Execution](/today-i-learned/ssh/executing-remote-commands-with-ssh/) — running commands
- [SCP Transfers](/today-i-learned/ssh/using-scp-for-file-transfers/) — simple file copy
- [RSYNC Transfers](/today-i-learned/ssh/using-rsync-for-file-transfers/) — smart synchronization
- [Fixing Host Key Warnings](/today-i-learned/ssh/fix-remote-host-identification-has-changed-warning-with-ssh-keygen-r/)
- [Quiet Mode](/today-i-learned/ssh/ssh-connection-without-welcome-message-or-banner/)

## Future Topics

Topics I plan to learn and add later:

- Host key verification and strict host checking
- Copying public keys with `ssh-copy-id`
- Advanced SSH config patterns (`IdentitiesOnly`, `Include`, multiple keys)
- Connection multiplexing (`ControlMaster`, `ControlPath`, `ControlPersist`)
- Agent forwarding and security implications
- Keepalive tuning (`ServerAliveInterval`, `ServerAliveCountMax`)
- Automation-focused flags (`BatchMode`, robust timeout handling)
- Server hardening extras (`AllowUsers`, `Fail2ban`, firewall rules)
- Hardware-backed SSH keys (`ed25519-sk`, `ecdsa-sk`)

## Next Steps

- **Review your SSH setup:** Check your keys and permissions
- **Configure SSH config:** Create `~/.ssh/config` for frequently used hosts
- **Audit server access:** Review who has SSH keys on your servers
- **Run SSH agent on startup:** Add to your shell profile for seamless key management

---