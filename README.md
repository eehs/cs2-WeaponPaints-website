# Weapon Paints website

This website is used alongside my **[modified](https://github.com/eehs/cs2-WeaponPaints)** version of the [cs2-WeaponPaints](https://github.com/Nereziel/cs2-WeaponPaints) plugin. It exists to allow users to change weapon skins from the web instead of in-game commands. 

<div>
    <img src="https://github.com/eehs/cs2-WeaponPaints-website/blob/main/previews/knives.png?raw=true" width="400">
    <img src="https://github.com/eehs/cs2-WeaponPaints-website/blob/main/previews/flip_knife_menu.png?raw=true" width="400">
    <img src="https://github.com/eehs/cs2-WeaponPaints-website/blob/main/previews/gloves.png?raw=true" width="400">
    <img src="https://github.com/eehs/cs2-WeaponPaints-website/blob/main/previews/pistols.png?raw=true" width="400">
    <img src="https://github.com/eehs/cs2-WeaponPaints-website/blob/main/previews/deagle_menu.png?raw=true" width="400">
    <img src="https://github.com/eehs/cs2-WeaponPaints-website/blob/main/previews/deagle_skin_params.png?raw=true" width="400">
</div>

<br>

## Features
- Change knives, gloves, weapon skins, agents, and music kits
- Per-team skin loadouts
- Automatic refresh of weapon skins in-game

<br>

## Installation
#### Requirements:
- [Node.JS](https://nodejs.org/en) >= 22.20.0
- [NGINX](https://nginx.org/en/download.html)
- My modified version of [WeaponPaints](https://github.com/eehs/cs2-WeaponPaints)
- [rcon-cli](https://github.com/gorcon/rcon-cli/releases/latest) (for refreshing weapon skins automatically) ([fake-rcon](https://github.com/Salvatore-Als/cs2-fake-rcon) or a similar rcon workaround **MUST** be available on your CS2 server for this to work)

#### 1. Clone the repo.
#### 2. Rename **`config.example.json`** to **`config.json`** and populate with your credentials as follows:

> [!IMPORTANT]
> Make sure the database specified in the config is the same as the one in the WeaponPaints plugin. Otherwise the required database tables won't be created and the website won't work.
```jsonc
{
    "name": "<Title of your website>",
    "lang": "<Menu language>", // You get to choose from "en", "pt-BR", "ru" and "zh-CN" for now (skin names are still in English though)

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
    "LOG_LEVEL": "INFO", // Check (https://logging.apache.org/log4j/2.x/manual/customloglevels.html) for more logging options

    // Server connection details below are made available to your website users
    "connect": {
        "show": false,
        "serverIp": "<Server IP>",
        "serverPort": "<Server port>",
        "serverPassword": "<Server password>"
    }
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

#### 4. Extract the `rcon` executable and `rcon.yaml` from [rcon-cli](https://github.com/gorcon/rcon-cli/releases/latest), then place them in the project's root directory.

#### 5. Fill in your server rcon credentials in `rcon.yaml`.

#### 6. Install NodeJS dependencies and run the web app.
```bash
  npm i
  npm run dev
```

#### 7. Enjoy!

<br>

# TODO
- Add option for users to reset their inventories (with confirmation).
- Combine selection of T and CT agents in the weapons menu.
- Customize weapons with StatTrak counter, nametag, stickers, charms, etc.
- Support more languages for the website alongside their skin names (latter only available in English right now).
- Add loadout presets/collections.

<br>

# Credits
- [L1teD](https://github.com/L1teD): The original author of this forked project.
