module.exports = {
  apps: [{
    name: "mino-bot",
    script: "index.js",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "512M",
    env: { NODE_ENV: "production" },
    error_file: "./logs/err.log",
    out_file: "./logs/out.log",
    log_file: "./logs/combined.log",
    time: true,
    restart_delay: 5000,
    max_restarts: 20,
    min_uptime: "10s",
  }],
};
