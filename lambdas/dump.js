require('dotenv').config();

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const S3 = require('aws-sdk/clients/s3');
const config = require('../config');

const s3 = new S3();

process.env.PGPASSWORD = process.env.PROD_DB_PASSWORD; // NOT RECOMMENNDED - look into .pgpass?

const command = `pg_dump ${config('PROD').connection}`;

// SCALING CONCERN: will lambda fail if dump is too big?
const dump = async (event, context) => {
  try {
    const { stdout } = await exec(command);

    // objects have 7 day lifecyle
    const s3Params = { Bucket: 'lifted-dumps', Key: 'prod_dump.dump', Body: stdout };

    // using 'upload' over 'putObject' to automatically use multipart upload if dump is large
    await s3.upload(s3Params).promise();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports.dump = dump;
