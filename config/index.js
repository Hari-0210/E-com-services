const dbConfig = require("./general");
const env = () => {
  return {
    saltRounds: 10,
    jwtPrivateKey: "gibigo",
    endpoint: "/api",
    port: 8500,
    mySQLconfig: {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      user: dbConfig.user,
      password: dbConfig.password,
      multipleStatements: true,
    },
  };
};
module.exports = {
  ...env(),
  noAuthRequired: ["/api/auth", "/api/store", "/images"],
  aws_access_key_id: "AKIAQPHMHKKQGLJ47LED",
  aws_secret_access_key: "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",
  spacesEndpoint: "gobiggguru-uqmr16rdz9ynhe3gcugzmr5j6fhegaps3a-s3alias",
  filePath: `https://rgca.fra1.digitaloceanspaces.com/`,
  public_read: "public-read",
  bucket: dbConfig.s3Bucket,
};
