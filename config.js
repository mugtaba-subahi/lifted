// TODO: save config in AWS SSM
module.exports = env => {
  const host = `--host=${process.env[`${[env]}_DB_HOST`]}`;
  const port = `--port=${process.env[`${[env]}_DB_PORT`]}`;
  const username = `--username=${process.env[`${[env]}_DB_USER`]}`;
  const dbname = `--dbname=${process.env[`${[env]}_DB_NAME`]}`;

  return {
    connection: `${host} ${port} ${username} ${dbname}`
  };
};
