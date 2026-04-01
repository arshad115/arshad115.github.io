---
title: "How Fail2ban Locked Me Out of My Own Server (Traefik + Authentik)"
category: DevOps
tags:
  - fail2ban
  - security
  - ssh
  - traefik
  - authentik
  - linux
toc: true  # Table of contents
toc_sticky: true  # Sticky TOC
comments: true
date: 2026-04-01
last_modified_at: 2026-04-01
author_profile: true
read_time: true
share: true
related: true
excerpt: "A real incident report: I got my own IP banned after enabling Fail2ban with Traefik and Authentik, lost SSH access, recovered via provider console, and fixed my configuration."
---

I use Fail2ban to protect my server, but after wiring things around Traefik + Authentik and tightening rules too aggressively, I ended up banning my own public IP and lost SSH access.

This post documents what happened, how I recovered, and what I changed so it does not happen again.

## What happened

- I enabled Fail2ban protection not only for SSH, but also for Traefik access logs.
- During testing, I hit multiple blocked/scanner-like URLs and authentication flows while Traefik + Authentik were in front.
- My custom Traefik jail treated those requests as malicious behavior and banned my current public IP.
- Because that was my admin IP at the time, I effectively locked myself out.
- SSH stopped working from my machine, so I could not log in normally.

At that point, I only had one way in: provider-side remote console shell.

## Symptoms I saw

- SSH connection attempts timed out or failed immediately.
- Repeated prompts with no successful login.
- Fail2ban service was running, but I was effectively blocked.

Commands that helped verify from console:

```bash
sudo fail2ban-client status
sudo fail2ban-client status sshd
# Check your custom proxy/auth jails by name
sudo fail2ban-client status <proxy_or_auth_jail>
sudo iptables -S | grep f2b
```

If your distro uses nftables, inspect rules there instead:

```bash
sudo nft list ruleset | grep -i f2b
```

## How I recovered access

I logged in via my cloud provider's emergency/serial console, then:

```bash
# Check active jails and banned IPs
sudo fail2ban-client status
sudo fail2ban-client status sshd
sudo fail2ban-client status <proxy_or_auth_jail>

# Fastest recovery: unban from all jails at once
sudo fail2ban-client unban <MY_PUBLIC_IP>

# If needed, unban per jail
sudo fail2ban-client set sshd unbanip <MY_PUBLIC_IP>
sudo fail2ban-client set <proxy_or_auth_jail> unbanip <MY_PUBLIC_IP>
```

After unbanning, SSH access worked again from my machine.

## The configuration mistakes

The root issue was not Fail2ban itself. It was my configuration:

- Aggressive or test-phase ban settings while still validating proxy/auth behavior.
- No safe allowlist for trusted admin IP(s).
- Not validating each jail's filter behavior against real traffic before hardening.

With reverse proxy/auth setups (Traefik + Authentik), you can generate noisy 401/403/404 patterns while testing. If your scanner/auth jails are strict, self-ban becomes very easy.

## Safer configuration I use now

I moved to explicit, safer defaults and made non-SSH jail thresholds less trigger-happy while testing.

`/etc/fail2ban/jail.local`:

```ini
[DEFAULT]
# Always keep your trusted admin/VPN IPs here.
ignoreip = 127.0.0.1/8 ::1 <MY_PUBLIC_IP> <VPN_IP>
bantime = 1h
findtime = 10m
maxretry = 5

[sshd]
enabled = true
port = ssh
backend = systemd
logpath = /var/log/auth.log
```

`/etc/fail2ban/jail.d/custom-proxy.conf` (example):

```ini
[custom-proxy-jail]
enabled = true
port = http,https
filter = <custom_filter_name>
logpath = <proxy_access_log_path>
maxretry = <tuned_value>
findtime = <tuned_window>
bantime = <tuned_duration>
action = iptables-multiport[name=custom-proxy-jail, port="80,443"]
```

For RHEL-like systems, use `/var/log/secure` for `logpath`.

Then apply and re-check:

```bash
sudo systemctl restart fail2ban
sudo fail2ban-client status
sudo fail2ban-client status sshd
```

## Extra safety practices

Before changing ban rules now, I do this checklist:

1. Keep provider console access ready (do not skip this).
2. Confirm `ignoreip` contains at least one trusted path back in.
3. Test from a different IP/session before closing active shell.
4. Tighten settings gradually, not all at once.
5. Monitor jails after each config change.

## Practical rollback if locked out again

From provider console:

```bash
# Temporary emergency disable
sudo systemctl stop fail2ban

# Or unban from all jails in one command
sudo fail2ban-client unban <MY_PUBLIC_IP>

# Or only unban specific jails
sudo fail2ban-client set sshd unbanip <MY_PUBLIC_IP>
sudo fail2ban-client set <proxy_or_auth_jail> unbanip <MY_PUBLIC_IP>

# Fix config
sudo editor /etc/fail2ban/jail.local

# Start again and verify
sudo systemctl start fail2ban
sudo fail2ban-client status sshd
sudo fail2ban-client status <proxy_or_auth_jail>
```

## Lessons learned

- Fail2ban is effective, but easy to misconfigure when hardening quickly.
- Reverse proxy + SSO testing can look like scanner behavior to Fail2ban filters.
- Always keep an out-of-band recovery path (provider console).
- Add trusted IPs before tightening bans.
- Keep an unban workflow/script ready before enabling stricter jails.

## Related TIL

- [Fail2ban for SSH](/today-i-learned/security/fail2ban-for-ssh/)

## Final takeaway

Security controls should protect you from attackers, not block you from your own server.

Fail2ban is still worth using, but deploy it like a production change: safe defaults, staged tuning, and a guaranteed recovery path.
