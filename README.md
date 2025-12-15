# Weapon Paints website

This website is used alongside my **[modified](https://github.com/eehs/cs2-WeaponPaints)** version of the [cs2-WeaponPaints](https://github.com/Nereziel/cs2-WeaponPaints) plugin. It exists to allow users to change weapon skins from the web instead of in-game commands. 

## Features
- Change knives, gloves, weapon skins, agents, and music kits
- Per-team skin loadouts
- Automatic refresh of weapon skins in-game

## Installation
#### Requirements:
- [Node.JS](https://nodejs.org/en) >= 22.20.0
- [NGINX](https://nginx.org/en/download.html)
- My modified version of [WeaponPaints](https://github.com/eehs/cs2-WeaponPaints)

#### 1. [WIP] **[Download latest release]()** and unpack it wherever you want.
#### 2. Rename **`config.example.json`** to **`config.json`** and populate with your credentials as follows:

> [!IMPORTANT]
> Make sure the database specified in the config is the same as the one in the WeaponPaints plugin. Otherwise the required database tables won't be created and the website won't work.
```jsonc
{
    "name": "<Title of your website>",
    "lang": "<Language code>", // You get to choose from "en", "pt-BR", "ru" and "zh-CN" (for now)
    "DB": {
        "host": "<Your database hostname/ip>",
        "user": "<Your database username>",
        "password": "<Your database password>",
        "database": "<Your database name>",
        "port": 3306 // Default port number, change if needed
    },
    "HOST": "<Your website hostname/ip>", // Something like 'example.com' or 'localhost'/'127.0.0.1' (NOT 'https://something.com')
    "PROTOCOL": "https",
    "PORT": 27275, // Change as you see fit
    "INTERNAL_HOST": "0.0.0.0",
    "STEAMAPIKEY": "<Your Steam Web API Key>",
    "SESSION_SECRET": "<Some random and secure string containing letters, numbers and special characters like !@#$%^&*(). Atleast 32 chars long.>",
    "LOG_LEVEL": "INFO" // Check (https://logging.apache.org/log4j/2.x/manual/customloglevels.html) for more logging options
}
```

- If you are running in docker or running some special server setup. You might encounter issues with the internal expressjs server. As its default running on 127.0.0.1. If you need to change this. You can do so via config option **`INTERNAL_HOST`** and set it to whatever interface you need. For most advanced use cases like reverse proxy 0.0.0.0 can be used.

#### 3. Navigate to your Nginx configuration folder at `sites-enabled/` and create a config file (`'ws-site.conf'` or something else), then fill in the following:
```nginx
server {
        listen 80;
        listen 443 ssl; # Include this if you want SSL support!

        # The domain or URL you want this to run SkinChanger off of
        server_name subdomain.example.com;

        # NOTE: You'll want to change these to your own SSL certificate if you have any
        ssl_certificate     /etc/letsencrypt/live/subdomain.example.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/subdomain.example.com/privkey.pem;

        # SkinChanger
        location / {
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header Host $http_host;
                add_header Access-Control-Allow-Origin *;
                proxy_redirect off;
                proxy_pass http://127.0.0.1:27275; # Adjust to website port number in config.json
        }

		location /socket.io/ {
                proxy_http_version 1.1;
                proxy_set_header Host $host;

                # Switch from HTTP to WebSockets
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection $connection_upgrade;

                proxy_pass http://127.0.0.1:27275;
        }
}
```

#### 4. Install NodeJS dependencies and run app.
```bash
  npm i
  npm run dev
```
#### 5. Enjoy!

# Credits
- [L1teD](https://github.com/L1teD): The original author of this forked project.
