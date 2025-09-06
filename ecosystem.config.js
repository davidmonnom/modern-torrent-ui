module.exports = {
  apps: [
    {
      name: "modern-torrent-ui",
      instances: "1",
      script: "./node_modules/next/dist/bin/next",
      args: "start -p 9092",
      exp_backoff_restart_delay: 100,
      watch: true,
      max_memory_restart: "400M",
    },
  ],
  deploy: {
    production: {
      key: "~/.ssh/kadiix_vps",
      user: "kadiix",
      host: ["cedav-plex"],
      ref: "origin/main",
      repo: "git@github.com:davidmonnom/modern-torrent-ui.git",
      path: "/home/kadiix/applications/modern-torrent-ui",
      "post-deploy":
        "npm install && npm run build && pm2 startOrRestart ecosystem.config.js -p 9092",
    },
  },
};
