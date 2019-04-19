---
category: HowTo
tags: 
  - Letsencrypt
  - Certbot
  - SSL Certificate
  - Linux
  - Nginx
header:
  image: https://rogertakemiya.com.br/wp-content/uploads/2018/02/certificado-lets-encrypt-gratuito.png
  teaser: https://letsencrypt.org/images/le-logo-twitter.png
comments: true
---

[Let's Encrypt](https://letsencrypt.org/) is awesome! They offer free ssl certificates for three months and also a auto renewal bot which updates the certificates for you when it is about to expire.

### Automated renewal

If you don't have any server application running on port 80, then the following command will renew your certificate:
```
$ sudo certbot renew
```

### Server running on port 80?
If you have a server which is also using the port 80 then [certbot](https://certbot.eff.org/) won't be able to bind to port 80 and throw an error. This makes the auto renewal process pretty much useless, since you have to manually stop the server and renew the certificate.
There's an easy solution for this, you can use [certbot](https://certbot.eff.org/)'s [Pre and Post Validation Hooks](Pre and Post Validation Hooks) to stop the server before renewal and start when you are done.

```
$ sudo certbot renew --pre-hook "service nginx stop" --post-hook "service nginx start"
```
Here, my nginx server uses the port 80, I just stop it using the stop service command and restart it when done. 
You can *dry-run* it using this command:

```
$ sudo certbot renew --dry-run
```

The hooks will be set-up and should work when you run this command. If your certificates are about to expire then they will be renewed also, otherwise it will just *dry-run* the renewal process.