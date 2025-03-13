Agent configuration API
edit
This documentation refers to the API of the standalone (legacy) APM Server. This method of running APM Server will be deprecated and removed in a future release. Please consider upgrading to Fleet and the APM integration. If you’ve already upgraded, see Agent configuration API.

APM Server exposes an API endpoint that allows agents to query the server for configuration changes. More information on this feature is available in APM Agent configuration in Kibana.

Starting with release 7.14, agent configuration can be declared directly within apm-server.yml. Requests to the endpoint are unchanged; apm-server responds directly without querying kibana for the agent configuration. Refer to the example in apm-server.yml under Agent Configuration.

Agent configuration endpoint
edit
The Agent configuration endpoint accepts both HTTP GET and HTTP POST requests. If an API keys or Secret token has been configured, it will also apply to this endpoint.

HTTP GET
edit
service.name is a required query string parameter.

http(s)://{hostname}:{port}/config/v1/agents?service.name=SERVICE_NAME
HTTP POST
edit
Encode parameters as a JSON object in the body. service.name is a required parameter.

http(s)://{hostname}:{port}/config/v1/agents
{
  "service": {
      "name": "test-service",
      "environment": "all"
  },
  "CAPTURE_BODY": "off"
}
Responses
edit
Successful - 200
Kibana endpoint is disabled - 403
Kibana is unreachable - 503
Example request
edit
Example Agent configuration GET request including the service name "test-service":

curl -i http://127.0.0.1:8200/config/v1/agents?service.name=test-service
Example Agent configuration POST request including the service name "test-service":

curl -X POST http://127.0.0.1:8200/config/v1/agents \
  -H "Authorization: Bearer secret_token" \
  -H 'content-type: application/json' \
  -d '{"service": {"name": "test-service"}}'
Example response
edit
HTTP/1.1 200 OK
Cache-Control: max-age=30, must-revalidate
Content-Type: application/json
Etag: "7b23d63c448a863fa"
Date: Mon, 24 Feb 2020 20:53:07 GMT
Content-Length: 98

{
    "capture_body": "off",
    "transaction_max_spans": "500",
    "transaction_sample_rate": "0.3"
}
