require('dotenv').config();

const config = require('../config');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const S3 = require('aws-sdk/clients/s3');

const s3 = new S3();

process.env.PGPASSWORD = process.env.UAT_DB_PASSWORD; // NOT RECOMMENNDED - look into .pgpass?

// SCALING CONCERN: will lambda fail if restore is too big?
const restore = async (event, context) => {
  const s3Params = { Bucket: 'lifted-dumps', Key: 'prod_dump.dump' };

  try {
    const response = await s3.getObject(s3Params).promise();
    const command = `psql ${config('UAT').connection} < ${response.Body}`;
    await exec(command);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports.restore = restore;
