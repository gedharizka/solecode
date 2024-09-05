## How To Run

1. Clone repository
```bash
  git clone https://github.com/gedharizka/terraform.git
```

2. Install depedencies
```bash
  cd [FOLDER_NAME]
```
```bash
  npm i
```

3. Migrate database

```bash
  node database/migration.js
```

4. Setup config, fill with your env config

```bash
  cp .env.dev .env
```

5. Install pm2
```bash
  npm i -g pm2
```

6. Run Project
```bash
  pm2 start ./bin/www
```

7. Update Config
```bash
  nano /etc/nginx/sites-available/default
```

```bash
  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

```bash
  nginx -t
```

```bash
  systemctl nginx restart
```
