module.exports = {
  apps: [
    {
      name: "sentinel-backend",
      script: "./dist/backend/server.js",
      instances: "max", // Utilize all available CPU cores
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "4G",
      env: {
        NODE_ENV: "production",
        PORT: 5001,
      },
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      error_file: "../logs/backend-error.log",
      out_file: "../logs/backend-out.log",
      merge_logs: true,
      time: true,
    },
    {
      name: "sentinel-worker",
      script: "./dist/workers/scanWorker.js",
      instances: 1, // Workers should typically run as a single instance or explicitly managed to avoid DB/Queue deadlocks
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "2G",
      env: {
        NODE_ENV: "production",
        SCAN_WORKER_CONCURRENCY: "10"
      },
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      error_file: "../logs/worker-error.log",
      out_file: "../logs/worker-out.log",
      merge_logs: true,
      time: true,
    }
  ]
};