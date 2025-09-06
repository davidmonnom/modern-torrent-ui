![Demo](/assets/readme.png)

# 🖥️ Modern torrent UI (Google-Auth)

Lightweight torrent manager that allows you to easily manage your downloads on your home server without any effort. 🚀

> ⚡ Start a torrent, change priority, start/pause, file management, delete torrent


## 🛠️ Installation on a remote server

⚠️ You must have `pm2` installed on the remote server for this installation.

⚠️ TransmissionBT package must be installed on the remote server.

1. Clone this repository on your computer
2. Edit `ecosystem.config.js` file with your remote server credentials, it is advisable to use an SSH key.
3. Setup remote server
```
pm2 deploy production setup
```
4. Setup `.env` file on remote server in `/<remote-path>/current`
```
NEXTAUTH_URL=  # Your domain here
NEXTAUTH_SECRET=  # Randomly generated string
NEXTAUTH_AUTHORIZED_EMAILS=  #Authorized emails with comma separator

GOOGLE_CLIENT_ID=  # Can be created on google console
GOOGLE_CLIENT_SECRET=  # Can be created on google console

TRANSMISSION_HOST=admin
TRANSMISSION_USERNAME=admin
TRANSMISSION_PASSWORD=yourpassword

# Subfolders named "games", "movies", "musics", "others", "shows", "softwares“ must be created
TRANSMISSION_DOWNLOAD_PATH=/src/downloads/

FILES_MANAGER_PATHS=/srv/
```
5. Deploy
```
pm2 deploy production
```
6. Access server according `ecosystem.config.js` settings


## 🎉 Contributing

Got an idea, found a bug, or just want to add something?
Don’t hesitate—open an issue or make a pull request.

Everything helps, whether it’s code, docs, or just suggestions.

