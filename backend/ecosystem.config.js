module.exports = {
  apps: [
    {
      name: 'APP_NAME',
      script: './server.js',
      error_file: './tmp/err.log',
      out_file: './tmp/out.log',
      log_file: './tmp/combined.log',
      log_date_format: 'YYYY-MM-DD_HH-mm-ss',
      ignore_watch: [
        'node_modules',
        'persist',
        'public',
        'tmp',
        'storage',
        '.git',
        '.history',
        '.idea',
        '.vscode',
        '.cache',
        'modules/Adm/.git',
        'modules/Adm/.idea',
        'modules/Adm/.vscode',
        'modules/Adm/.cache',
        'modules/Adm/generator/files/file.tmp',
      ],
    },
  ],
};
