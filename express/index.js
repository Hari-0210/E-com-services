const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const utilities = require("../utilities");
const { endpoint, port = 5500 } = require("../config");

const path = require("path");
const { isAuthenticated } = require("../helper/tokenVerify");

const routes = require("../app/mainRouter");

module.exports = () => {
  for (const utility in utilities) {
    global[utility] = utilities[utility];
  }
  global["commonErrorMessage"] = "Something went wrong please try again";
  global.__basedir = __dirname + "/..";
  const app = express();
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.get("/", (req, res) => {
    res.send(`<!DOCTYPE html>
        <html>
        <head>
        </head>
        <body>
        
        <table >
          <tr>
            <th>Name</th>
            <th>Url</th>
          </tr>
          <tr>
            <td>Host</td>
            <td><a href="http://localhost:${port}" target="_blank">http://localhost:${port}</a></td>
          </tr>    
        </table>        
        </body>
        </html>
        `);
  });
  app.use(express.static(path.join(__dirname, "../docs")));
  app.use(
    "/images",
    express.static(path.join(__dirname, "../resources", "assets"))
  );
  app.use((error, request, response, next) => {
    if (error !== null) {
      logger.error(`express/index.js:line27 :: ${error.message}`);
      return response.json({ status: 403, message: "Invalid json" });
    }
    next();
  });

  app.use(isAuthenticated);
  app.use(endpoint, routes);

  return app;
};
