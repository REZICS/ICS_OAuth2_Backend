const express = require("express");
const bodyParser = require("body-parser");
const OAuth2Server = require("oauth2-server");
var Request = OAuth2Server.Request;
var Response = OAuth2Server.Response;

const app = express();

const port = process.env.PORT || 6553;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.oauth = new OAuth2Server({
  model: require("./model.js"),
  accessTokenLifetime: 60 * 60,
  allowBearerTokensInQueryString: true,
});

app.all("/oauth/token", obtainToken);

app.get("/", authenticateRequest, (req, res) => {
  res.send("Congratulations, you are in a secret area!");
});

app.listen(3000);

function obtainToken(req, res) {
  var request = new Request(req);
  var response = new Response(res);

  return app.oauth
    .token(request, response)
    .then(function (token) {
      res.json(token);
    })
    .catch(function (err) {
      res.status(err.code || 500).json(err);
    });
}

function authenticateRequest(req, res, next) {
  var request = new Request(req);
  var response = new Response(res);

  return app.oauth
    .authenticate(request, response)
    .then(function (token) {
      next();
    })
    .catch(function (err) {
      res.status(err.code || 500).json(err);
    });
}

app.listen(port, () => {
  console.log(
    `Express started on http://localhost:${port}` +
      "; press Ctrl-C to terminate."
  );
});

/*

curl http://localhost:3000/oauth/token \\
	-d "grant_type=password" \\
	-d "username=pedroetb" \\
	-d "password=password" \\
	-H "Authorization: Basic YXBwbGljYXRpb246c2VjcmV0" \\
	-H "Content-Type: application/x-www-form-urlencoded"
*/
