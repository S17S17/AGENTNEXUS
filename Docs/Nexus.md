Getting Started
The following sections introduce you to the standard Nexus Dashboard and services REST API operations, provide information on how to access the in-product API reference, and describe how to compose and test simple API calls to get you started.

Standard REST methods are supported on the API, which include POST, GET, and DELETE operations through HTTP. The POST and DELETE methods are idempotent, meaning that there is no additional effect if they are called more than once with the same input parameters. The GET method is nullipotent, meaning that it can be called zero or more times without making any changes (or that it is a read-only operation). All payloads to and from the REST interface must be in JSON format.

A typical REST API operation consists of three elements:

Request URL — The address of the resource to which you make the API call.

Request message — The JSON-formatted payload that contains the new data you want to add or update. For read-only operation (GET) the request message is empty.

Request response — The JSON-formatted response that contains the requested information.

Accessing API Reference
The complete API reference is available directly in the product at the following URL:

Code Snippet
Copyhttps://<node-management-ip>/apidocs/
This release provides API references for the Nexus Dashboard platform as well as the Nexus Dashboard Insights service if the service is deployed.

You can select which API you want to view using the drop-down menu at the top of the apidocs page:

Nexus Dashboard API

The same API reference is also available online at the Cisco DevNet portal: https://developer.cisco.com/docs/nexus-dashboard

Base URI
Every API request begins with the following base URI:

Code Snippet
Copyhttps://<node-management-ip>
Note however, depending on the specific service, the full URI may contain an additional prefix relative to the base URI and the endpoint listed in the API reference:

API	Full endpoint URI	Example
Nexus Dashboard	<base-uri>/ + <api-endpoint>	https://<node-management-ip>/login
Insights	<base-uri>/ + <api-endpoint>	https://<node-management-ip>/sedgeapi/v1/cisco-nir/api/api/telemetry/v2/config/alertRules
Fabric Controller	<base-uri>/ + <api-endpoint>	https://<node-management-ip>/appcenter/cisco/ndfc/api/v1/lan-fabric/rest/control/fabrics
Orchestrator	<base-uri>/ + mso/+ <api-endpoint>	https://<node-management-ip>/mso/api/v1/sites/
Authorization Using User Credentials and API Token
Before you can send any requests to perform specific operations on the Nexus Dashboard cluster or services, you must login by POSTing a JSON payload containing a username, password, and login domain for a user already configured in your Nexus Dashboard to obtain an autherization token that you can use in subsequent API calls.

Alternatively, you can obtain an API key and use it instead of the user name and password, as described in Authorization Using API Key. An API key may be a more suitable approach for automation scripts.

The following examples use the admin user account.

Post URL

Code Snippet
CopyPOST https://<nd-node-ip>/login
Payload

Code Snippet
Copy{
  "userName": "admin",
  "userPasswd": "Cisco123!",
  "domain": "DefaultAuth"
}
Response

The response to the POST operation contains an authentication token and the information about the user’s privileges as configured in the Nexus Dashboard.

Code Snippet
Copy{
  "jwttoken": "eyJhbGciOi ... OegNbM8CEuW0mpTfDOw",
  "username": "admin",
  "usertype": "local",
  "rbac": "[{\"domain\":\"all\",\"rolesR\":16777216,\"rolesW\":1,\"roles\":[[\"admin\",\"WritePriv\"],[\"app-user\",\"ReadPriv\"]]}]",
  "statusCode": 200,
  "token": "eyJhbGciOi ... OegNbM8CEuW0mpTfDOw"
}
Example: Login Using cURL
Code Snippet
Copycurl -k --request POST 'https://<nd-node-ip>/login' \
  --data-raw '{"userName": "admin","userPasswd":"Cisco123!","domain":"DefaultAuth"}'
Example: Login Using Python
Code Snippet
Copyimport requests
from requests.packages.urllib3.exceptions import InsecureRequestWarning
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

url = 'https://<nd-node-ip>/login'
payload = {
  "userName": "admin",
  "userPasswd": "Cisco123!",
  "domain": "DefaultAuth"
}

# Use verify=False if you are sure the target system is the system you expect and it has a self-signed certificate.
response = requests.post(url=url, json=payload, verify=False)

print(response.json())
Refreshing Authentication Token
All authentication tokens expire after a certain period of time. Since all subsequent API calls rely on the authentication token you receive when you first log in, you may want to refresh the existing token instead of obtaining a new one by logging in again.

The default token duration is 20 minutes, but can be changed in the Nexus Dashboard GUI by navigating to Admin Console > Administrative > Security and updating the Session Timeout field:

Session Timeout

Post URL

Code Snippet
CopyPOST https://<nd-node-ip>/refresh
Payload

In the payload JSON, provide the token you want to refresh.

Code Snippet
Copy{
  "AuthCookie": "eyJhbGciOi ... OegNbM8CEuW0mpTfDOw"
}
Response

The response to the POST operation contains an authentication token and the information about the user’s privileges as configured in the Nexus Dashboard.

Code Snippet
Copy{
  "jwttoken": "eyJhbGciOi ... OegNbM8CEuW0mpTfDOw",
  "username": "admin",
  "usertype": "local",
  "rbac": "[{\"domain\":\"all\",\"rolesR\":16777216,\"rolesW\":1,\"roles\":[[\"admin\",\"WritePriv\"],[\"app-user\",\"ReadPriv\"]]}]",
  "statusCode": 200,
  "token": "<token>"
}
Authorization Using API Key
In some cases, such as for automation scripts, it may be more suitable to use an API key to access Nexus Dashboard and services resources instead of user credentials and authentication token.

Guidelines and Limitations
Currently, API key creation and maintenance must be done using API.

Future releases will allow key management using the Nexus Dashboard GUI.

API keys are available only for local users and are limited to local Nexus Dashboard cluster and the services running on it.

API keys are assigned to a user and can be managed by that user only.

API keys are deleted if the user with which they are associated is deleted.

A maximum of 10 API keys can be created per user.

Creating API Keys
Log in via API using a username and password combination to obtain an authentication token similar to what's described in the previous sections.

Code Snippet
Copycurl -k --request POST 'https://<nd-node-ip>/login' \
  --data-raw '{"userName": "admin","userPasswd":"Cisco123!","domain":"DefaultAuth"}'

{"jwttoken":"eyJhbGciOiJSUzI1NiIsImtpZCI6InliZTVvZjMzODFqcXphczZsZnZ5Y3c0MmlsOXZ3Ym9hIiwidHlwIjoiSldUIn0.eyJhdnBhaXIiOiJzaGVsbDpkb21haW5zPWFsbC9hZG1pbi8iLCJjbHVzdGVyIjoiNjQ2NTc2NjMtNmM3NS03Mzc0LTY1NzItMzEyZDMzMzIyZDMzIiwiZXhwIjoxNjQ0MzQzMjkzLCJpYXQiOjE2NDQzNDIwOTMsImlkIjoiNDhkMTA1YmRmYmM0OWE1ZmNmMzlhMTBiOTYxMzg2ZTYxZGZlNDAwODVjYjAzMTVkODE4Yjc2MWM1NzM1ZGFmYSIsImlzcyI6Im5kIiwiaXNzLWhvc3QiOiIxMC4zMC4xMS4zMiIsInJiYWMiOlt7ImRvbWFpbiI6ImFsbCIsInJvbGVzUiI6MTY3NzcyMTYsInJvbGVzVyI6MSwicm9sZXMiOltbImFkbWluIiwiV3JpdGVQcml2Il0sWyJhcHAtdXNlciIsIlJlYWRQcml2Il1dfV0sInNlc3Npb25pZCI6IkxIbUVVWW0zUjI3ZFNtVGRKOTdIN0lZQiIsInVzZXJmbGFncyI6MCwidXNlcmlkIjoyNTAwMiwidXNlcm5hbWUiOiJhZG1pbiIsInVzZXJ0eXBlIjoibG9jYWwifQ.JBC2b_tbE-ULqv7oQBY9I7tMI47IYDHr0loVtCD3Kd3V2TX6TGSI0W7UHtB27NxuKgVuUDa3s9CHpBlMuLe9u-RU8z6mmJAPofGmRcy33-kDq7DnFEQjcq2m41V3CPmYSYP7BrcGWi2evImGrSErkZAFWsIIcfqLJ20x8emczFFRr_Pvep0jkLtQCE6nrX1954EUvZl4Mu0WD_uQ25OdgdpRzsc1jnf2E4oWcrqoKiIah4Ai4wuVPi-NXhU5Fj8WpeX4MTjlXnQB3WKE5-3e-MyVQU_TgIAzqMs6h_dlJ9jyrhBDunXgigG1ztUY98dM39qQ6CImZVel9M3-sUrzSg,...
(Optional) Export the token into a shell variable.

To avoid providing the full token every time, you can export it into a shell variable and use that in the subsequent calls.

Code Snippet
Copyexport AUTH_TOKEN=eyJhbGciOiJSUzI1NiIsImtpZCI6InliZTVvZjMzODFqcXphczZsZnZ5Y3c0MmlsOXZ3Ym9hIiwidHlwIjoiSldUIn0.eyJhdnBhaXIiOiJzaGVsbDpkb21haW5zPWFsbC9hZG1pbi8iLCJjbHVzdGVyIjoiNjQ2NTc2NjMtNmM3NS03Mzc0LTY1NzItMzEyZDMzMzIyZDMzIiwiZXhwIjoxNjQ0MzQzMjkzLCJpYXQiOjE2NDQzNDIwOTMsImlkIjoiNDhkMTA1YmRmYmM0OWE1ZmNmMzlhMTBiOTYxMzg2ZTYxZGZlNDAwODVjYjAzMTVkODE4Yjc2MWM1NzM1ZGFmYSIsImlzcyI6Im5kIiwiaXNzLWhvc3QiOiIxMC4zMC4xMS4zMiIsInJiYWMiOlt7ImRvbWFpbiI6ImFsbCIsInJvbGVzUiI6MTY3NzcyMTYsInJvbGVzVyI6MSwicm9sZXMiOltbImFkbWluIiwiV3JpdGVQcml2Il0sWyJhcHAtdXNlciIsIlJlYWRQcml2Il1dfV0sInNlc3Npb25pZCI6IkxIbUVVWW0zUjI3ZFNtVGRKOTdIN0lZQiIsInVzZXJmbGFncyI6MCwidXNlcmlkIjoyNTAwMiwidXNlcm5hbWUiOiJhZG1pbiIsInVzZXJ0eXBlIjoibG9jYWwifQ.JBC2b_tbE-ULqv7oQBY9I7tMI47IYDHr0loVtCD3Kd3V2TX6TGSI0W7UHtB27NxuKgVuUDa3s9CHpBlMuLe9u-RU8z6mmJAPofGmRcy33-kDq7DnFEQjcq2m41V3CPmYSYP7BrcGWi2evImGrSErkZAFWsIIcfqLJ20x8emczFFRr_Pvep0jkLtQCE6nrX1954EUvZl4Mu0WD_uQ25OdgdpRzsc1jnf2E4oWcrqoKiIah4Ai4wuVPi-NXhU5Fj8WpeX4MTjlXnQB3WKE5-3e-MyVQU_TgIAzqMs6h_dlJ9jyrhBDunXgigG1ztUY98dM39qQ6CImZVel9M3-sUrzSg
Use the token to call /api/config/addapikey to create an API key.

NOTE: You must pass an empty payload ({}) in the following API call to add an API key.

Code Snippet
Copycurl -k --request POST 'https://<nd-node-ip>/api/config/addapikey' \
  --header 'Cookie: AuthCookie='"$AUTH_TOKEN"''
  --data-raw '{}'

{
    "response": [{
            "actionID": "2022-03-07T21:23:21.505832584-0800",
            "meta": {
                "modts": "2022-03-07T21:23:21.508697807Z",
                "createts": "2022-03-07T21:23:21.508697807Z",
                "dn": "addapikey/2022-03-07T21:23:21.505832584-0800",
                "type": "addapikey",
                "version": 1
            },
            "name": "",
            "schemaversion": "",
            "securityDomains": []
        }
    ]
}
Get the list of API keys assigned to the user.

The following command still uses the authentication token from the first step.

Code Snippet
Copycurl -k --request GET 'https://<nd-node-ip>/api/config/dn/userapikey/local-admin?showPassword=yes' \
  --header 'Cookie: AuthCookie='"$AUTH_TOKEN"''
  --data-raw '{}'

{
    "meta": {
        "modts": "2022-03-07T21:39:51.536268113Z",
        "createts": "2022-01-10T21:03:52.762132614Z",
        "dn": "userapikey/local-admin",
        "type": "userapikey",
        "version": 0
    },
    "schemaversion": "1",
    "apiKeyUser": "local-admin",
    "apiKeys": [{
            "name": "",
            "key": "0bf6ac8f384047f1b1461a3ca9c9191ef712fb5b3072468c87a770d50b923e09"
        }
    ],
    "securityDomains": []
}
(Optional) Export the API key into a shell variable.

To avoid providing the full key every time, you can export it into a shell variable and use that in the subsequent calls.

Code Snippet
Copyexport API_KEY=0bf6ac8f384047f1b1461a3ca9c9191ef712fb5b3072468c87a770d50b923e09
Use the API key from the previous step for subsequent calls.

The following example returns all the API keys assigned to the user like in the previous step, but using the API key instead of the authentication token.

NOTE: You must also pass the username with which the API key is associated with the call.

If you are using variables in the command line, you must use double quotes around the parameter instead of single quotes.

Code Snippet
Copycurl -k --request GET 'https://<nd-node-ip>/api/config/dn/userapikey/local-admin?showPassword=yes' \
  --header "X-Nd-Apikey: $API_KEY" \
  --header 'X-Nd-Username: admin' \
  --data-raw '{}'

{
    "meta": {
        "modts": "2022-03-07T21:39:51.536268113Z",
        "createts": "2022-01-10T21:03:52.762132614Z",
        "dn": "userapikey/local-admin",
        "type": "userapikey",
        "version": 0
    },
    "schemaversion": "1",
    "apiKeyUser": "local-admin",
    "apiKeys": [{
            "name": "",
            "key": "0bf6ac8f384047f1b1461a3ca9c9191ef712fb5b3072468c87a770d50b923e09"
        }
    ],
    "securityDomains": []
}
Managing API Keys
Getting the list of existing keys assigned to a user using an authentication token.

Code Snippet
Copycurl -k --request GET 'https://<nd-node-ip>/api/config/dn/userapikey/local-admin?showPassword=yes' \
  --header 'Cookie: AuthCookie='"$AUTH_TOKEN"''
  --data-raw '{}'

{
    "meta": {
        "modts": "2022-03-07T21:39:51.536268113Z",
        "createts": "2022-01-10T21:03:52.762132614Z",
        "dn": "userapikey/local-admin",
        "type": "userapikey",
        "version": 0
    },
    "schemaversion": "1",
    "apiKeyUser": "local-admin",
    "apiKeys": [{
            "name": "",
            "key": "0bf6ac8f384047f1b1461a3ca9c9191ef712fb5b3072468c87a770d50b923e09"
        }, {
            "name": "",
            "key": "269da21abfb54f19b669f40869c713513d6c0b63751c4eb09233cae088640d4a"
        }, {
            "name": "",
            "key": "02c945ba8aac460c96a800670a24cfdbe7d59a5514b24c96968482ac1de4552b"
        }
    ],
    "securityDomains": []
}
Getting the list of existing keys assigned to a user using an API key.

Code Snippet
Copycurl -k --request GET 'https://<nd-node-ip>/api/config/dn/userapikey/local-admin?showPassword=yes' \
  --header "X-Nd-Apikey: $API_KEY" \
  --header 'X-Nd-Username: admin' \
  --data-raw '{}'

{
    "meta": {
        "modts": "2022-03-07T21:39:51.536268113Z",
        "createts": "2022-01-10T21:03:52.762132614Z",
        "dn": "userapikey/local-admin",
        "type": "userapikey",
        "version": 0
    },
    "schemaversion": "1",
    "apiKeyUser": "local-admin",
    "apiKeys": [{
            "name": "",
            "key": "0bf6ac8f384047f1b1461a3ca9c9191ef712fb5b3072468c87a770d50b923e09"
        }, {
            "name": "",
            "key": "269da21abfb54f19b669f40869c713513d6c0b63751c4eb09233cae088640d4a"
        }, {
            "name": "",
            "key": "02c945ba8aac460c96a800670a24cfdbe7d59a5514b24c96968482ac1de4552b"
        }
    ],
    "securityDomains": []
}
Updating one or more keys.

The following example updates the name of one of the keys (269da21abfb54f19b669f40869c713513d6c0b63751c4eb09233cae088640d4a) to newName.

Code Snippet
Copycurl -k --request POST 'https://<nd-node-ip>/api/config/userapikey/' \
  --header "X-Nd-Apikey: $API_KEY" \
  --header 'X-Nd-Username: admin' \
  --data-raw '{"apiKeyUser": "local-admin","apiKeys": [{"name": "newName", "key": "269da21abfb54f19b669f40869c713513d6c0b63751c4eb09233cae088640d4a"} ]}"

{"response":[{"apiKeyUser":"local-admin","meta":{"modts":"2022-03-07T22:01:03.513994162Z","createts":"2022-01-10T21:03:52.762132614Z","dn":"userapikey/local-admin","type":"userapikey","version":1},"schemaversion":"1","securityDomains":[]}]}
To verify the change:

Code Snippet
Copycurl -k --request GET 'https://<nd-node-ip>/api/config/dn/userapikey/local-admin?showPassword=yes' \
  --header "X-Nd-Apikey: $API_KEY" \
  --header 'X-Nd-Username: admin' \
  --data-raw '{}'

{
    "meta": {
        "modts": "2022-03-07T22:01:03.513994162Z",
        "createts": "2022-01-10T21:03:52.762132614Z",
        "dn": "userapikey/local-admin",
        "type": "userapikey",
        "version": 1
    },
    "schemaversion": "1",
    "apiKeyUser": "local-admin",
    "apiKeys": [{
            "name": "newName",
            "key": "269da21abfb54f19b669f40869c713513d6c0b63751c4eb09233cae088640d4a"
        }, {
            "name": "",
            "key": "0bf6ac8f384047f1b1461a3ca9c9191ef712fb5b3072468c87a770d50b923e09"
        }
    ],
    "securityDomains": []
}
To delete one or more keys:

The following example deletes the last key (02c945ba8aac460c96a800670a24cfdbe7d59a5514b24c96968482ac1de4552b) shown in the previous bullet point.

Code Snippet
Copycurl -k --request POST 'https://<nd-node-ip>/api/config/deleteapikey' \
  --header "X-Nd-Apikey: $API_KEY" \
  --header 'X-Nd-Username: admin' \
  --data-raw '{"apiKeys" :["02c945ba8aac460c96a800670a24cfdbe7d59a5514b24c96968482ac1de4552b"]}'
To verify that the key was deleted:

Code Snippet
Copycurl -k --request GET 'https://<nd-node-ip>/api/config/dn/userapikey/local-admin?showPassword=yes' \
  --header "X-Nd-Apikey: $API_KEY" \
  --header 'X-Nd-Username: admin' \
  --data-raw '{}'

{
    "meta": {
        "modts": "2022-03-07T21:56:27.043891263Z",
        "createts": "2022-01-10T21:03:52.762132614Z",
        "dn": "userapikey/local-admin",
        "type": "userapikey",
        "version": 0
    },
    "schemaversion": "1",
    "apiKeyUser": "local-admin",
    "apiKeys": [{
            "name": "newName",
            "key": "269da21abfb54f19b669f40869c713513d6c0b63751c4eb09233cae088640d4a"
        }, {
            "name": "",
            "key": "0bf6ac8f384047f1b1461a3ca9c9191ef712fb5b3072468c87a770d50b923e09"
        }
    ],
    "securityDomains": []
}
Using Nexus Dashboard to Test APIs
You can test all the available API calls on a live Nexus Dashboard cluster directly from the API reference documentation page.

Log in to your Nexus Dashboard cluster.

From the top menu bar, select Help > Help Center.

In the Nexus Dashboard help center page, click REST API.

In the API DOCS page, use the Try It functionality to test the call. In the following example, you use the Login API.

Nexus Dashboard Login Using "Try It"

In the left sidebar, select the API call you want to test.

In the right sidebar, click Try It.

In the Body area, provide the payload information parameters required by the call.

In this case you provide the username, password, and login domain for the user that you want to use.

Click Run to make the call.

The Response area is populated with the response code and payload.

In this case you can see the 200 success code and the response JSON containing the authentication token and some additional user information.

In addition to the Try It functionality, you can also use the API DOCS page to view examples of the Request and Response payloads of all available API calls.

Using Postman to Test API
Postman is an API platform for building and using APIs. You can use Postman to quickly and easily test API calls before you implement them in complex applications.

Installing Postman
Complete installation and configuration guide for Postman is outside the scope of this document. The following steps provide an overview of basic installation and configuration as required for use with Nexus Dashboard API testing.

Download and install Postman.

You can download the installation package from https://www.postman.com.

Disable SSL verification in Postman.

Start Postman.
In the top right corner of the screen, click the tools icon and select Settings.
In the General tab, disable SSL certificate verification option.
Using Postman
The following example shows how to test the login API using Postman.

Open Postman.

Create a new request.

Provide the request information.

Nexus Dashboard Login Using Postman

Select POST and provide the URL.

You can use the management IP address of any of the cluster’s nodes.

Select how you plan to provide the request payload.

You can select Body and raw if you want to copy and modify an existing JSON payload example, such as ones available from the API reference.

Copy the JSON payload for logging in from the example in the API reference and modify it for your specific case.

You can get sample Request and Response payloads from the complete API reference, as described in Using Nexus Dashboard To Test APIs.

In this case you changed the userName and userPasswd to reflect our example.

Click Send to send the request to your Nexus Dashboard.

In the response payload, copy the value of the jwttoken to use for authentication in any subsequent API calls.

Using cURL to Test APIs
You can also use cURL to execute the calls.

Log in using a cURL command to retrieve the authentication token:

Code Snippet
Copycurl -k --request POST 'https://<nd-node-ip>/login' \
  --data-raw '{"userName": "admin","userPasswd":"Cisco123!","domain":"DefaultAuth"}'
NOTE: If you are running cURL from Windows, you need to escape the quotes, for example: > curl -k --request POST "https://<nd-node-ip>/login" --data-raw "{\"userName\":\"admin\",\"userPasswd\":\"Cisco123!\",\"domain\":\"DefaultAuth\"}"

Sample response payload containing the token (jwttoken):

Code Snippet
Copy{
  "jwttoken": "eyJhbGciOiJSUzI1NiIsImtpZCI6InliZTVvZjMzODFqcXphczZsZnZ5Y3c0MmlsOXZ3Ym9hIiwidHlwIjoiSldUIn0.eyJhdnBhaXIiOiJzaGVsbDpkb21haW5zPWFsbC9hZG1pbi8iLCJjbHVzdGVyIjoiNjQ2NTc2NjMtNmM3NS03Mzc0LTY1NzItMzEyZDMzMzIyZDMzIiwiZXhwIjoxNjQ0MzQzMjkzLCJpYXQiOjE2NDQzNDIwOTMsImlkIjoiNDhkMTA1YmRmYmM0OWE1ZmNmMzlhMTBiOTYxMzg2ZTYxZGZlNDAwODVjYjAzMTVkODE4Yjc2MWM1NzM1ZGFmYSIsImlzcyI6Im5kIiwiaXNzLWhvc3QiOiIxMC4zMC4xMS4zMiIsInJiYWMiOlt7ImRvbWFpbiI6ImFsbCIsInJvbGVzUiI6MTY3NzcyMTYsInJvbGVzVyI6MSwicm9sZXMiOltbImFkbWluIiwiV3JpdGVQcml2Il0sWyJhcHAtdXNlciIsIlJlYWRQcml2Il1dfV0sInNlc3Npb25pZCI6IkxIbUVVWW0zUjI3ZFNtVGRKOTdIN0lZQiIsInVzZXJmbGFncyI6MCwidXNlcmlkIjoyNTAwMiwidXNlcm5hbWUiOiJhZG1pbiIsInVzZXJ0eXBlIjoibG9jYWwifQ.JBC2b_tbE-ULqv7oQBY9I7tMI47IYDHr0loVtCD3Kd3V2TX6TGSI0W7UHtB27NxuKgVuUDa3s9CHpBlMuLe9u-RU8z6mmJAPofGmRcy33-kDq7DnFEQjcq2m41V3CPmYSYP7BrcGWi2evImGrSErkZAFWsIIcfqLJ20x8emczFFRr_Pvep0jkLtQCE6nrX1954EUvZl4Mu0WD_uQ25OdgdpRzsc1jnf2E4oWcrqoKiIah4Ai4wuVPi-NXhU5Fj8WpeX4MTjlXnQB3WKE5-3e-MyVQU_TgIAzqMs6h_dlJ9jyrhBDunXgigG1ztUY98dM39qQ6CImZVel9M3-sUrzSg",
  "username": "admin",
  "usertype": "local",
  "rbac": "[{\"domain\":\"all\",\"rolesR\":16777216,\"rolesW\":1,\"roles\":[[\"admin\",\"WritePriv\"],[\"app-user\",\"ReadPriv\"]]}]",
  "statusCode": 200,
  "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6InliZTVvZjMzODFqcXphczZsZnZ5Y3c0MmlsOXZ3Ym9hIiwidHlwIjoiSldUIn0.eyJhdnBhaXIiOiJzaGVsbDpkb21haW5zPWFsbC9hZG1pbi8iLCJjbHVzdGVyIjoiNjQ2NTc2NjMtNmM3NS03Mzc0LTY1NzItMzEyZDMzMzIyZDMzIiwiZXhwIjoxNjQ0MzQzMjkzLCJpYXQiOjE2NDQzNDIwOTMsImlkIjoiNDhkMTA1YmRmYmM0OWE1ZmNmMzlhMTBiOTYxMzg2ZTYxZGZlNDAwODVjYjAzMTVkODE4Yjc2MWM1NzM1ZGFmYSIsImlzcyI6Im5kIiwiaXNzLWhvc3QiOiIxMC4zMC4xMS4zMiIsInJiYWMiOlt7ImRvbWFpbiI6ImFsbCIsInJvbGVzUiI6MTY3NzcyMTYsInJvbGVzVyI6MSwicm9sZXMiOltbImFkbWluIiwiV3JpdGVQcml2Il0sWyJhcHAtdXNlciIsIlJlYWRQcml2Il1dfV0sInNlc3Npb25pZCI6IkxIbUVVWW0zUjI3ZFNtVGRKOTdIN0lZQiIsInVzZXJmbGFncyI6MCwidXNlcmlkIjoyNTAwMiwidXNlcm5hbWUiOiJhZG1pbiIsInVzZXJ0eXBlIjoibG9jYWwifQ.JBC2b_tbE-ULqv7oQBY9I7tMI47IYDHr0loVtCD3Kd3V2TX6TGSI0W7UHtB27NxuKgVuUDa3s9CHpBlMuLe9u-RU8z6mmJAPofGmRcy33-kDq7DnFEQjcq2m41V3CPmYSYP7BrcGWi2evImGrSErkZAFWsIIcfqLJ20x8emczFFRr_Pvep0jkLtQCE6nrX1954EUvZl4Mu0WD_uQ25OdgdpRzsc1jnf2E4oWcrqoKiIah4Ai4wuVPi-NXhU5Fj8WpeX4MTjlXnQB3WKE5-3e-MyVQU_TgIAzqMs6h_dlJ9jyrhBDunXgigG1ztUY98dM39qQ6CImZVel9M3-sUrzSg"
}
Extract the authentication token from the response payload.

The standard login response payload contains the authentication token as well as the user's login information and role-based access control (RBAC) privileges.

You will need to use only the authentication token for the subsequent calls.

Optionally, you can extract the token into a shell variable to simplify future calls, for example:

Code Snippet
Copyexport AUTH_TOKEN=eyJhbGciOiJSUzI1NiIsImtpZCI6InliZTVvZjMzODFqcXphczZsZnZ5Y3c0MmlsOXZ3Ym9hIiwidHlwIjoiSldUIn0.eyJhdnBhaXIiOiJzaGVsbDpkb21haW5zPWFsbC9hZG1pbi8iLCJjbHVzdGVyIjoiNjQ2NTc2NjMtNmM3NS03Mzc0LTY1NzItMzEyZDMzMzIyZDMzIiwiZXhwIjoxNjQ0MzQzMjkzLCJpYXQiOjE2NDQzNDIwOTMsImlkIjoiNDhkMTA1YmRmYmM0OWE1ZmNmMzlhMTBiOTYxMzg2ZTYxZGZlNDAwODVjYjAzMTVkODE4Yjc2MWM1NzM1ZGFmYSIsImlzcyI6Im5kIiwiaXNzLWhvc3QiOiIxMC4zMC4xMS4zMiIsInJiYWMiOlt7ImRvbWFpbiI6ImFsbCIsInJvbGVzUiI6MTY3NzcyMTYsInJvbGVzVyI6MSwicm9sZXMiOltbImFkbWluIiwiV3JpdGVQcml2Il0sWyJhcHAtdXNlciIsIlJlYWRQcml2Il1dfV0sInNlc3Npb25pZCI6IkxIbUVVWW0zUjI3ZFNtVGRKOTdIN0lZQiIsInVzZXJmbGFncyI6MCwidXNlcmlkIjoyNTAwMiwidXNlcm5hbWUiOiJhZG1pbiIsInVzZXJ0eXBlIjoibG9jYWwifQ.JBC2b_tbE-ULqv7oQBY9I7tMI47IYDHr0loVtCD3Kd3V2TX6TGSI0W7UHtB27NxuKgVuUDa3s9CHpBlMuLe9u-RU8z6mmJAPofGmRcy33-kDq7DnFEQjcq2m41V3CPmYSYP7BrcGWi2evImGrSErkZAFWsIIcfqLJ20x8emczFFRr_Pvep0jkLtQCE6nrX1954EUvZl4Mu0WD_uQ25OdgdpRzsc1jnf2E4oWcrqoKiIah4Ai4wuVPi-NXhU5Fj8WpeX4MTjlXnQB3WKE5-3e-MyVQU_TgIAzqMs6h_dlJ9jyrhBDunXgigG1ztUY98dM39qQ6CImZVel9M3-sUrzSg
Use the authentication token for a service-specific API call.

The following example shows how to retrieve the list of all sites from the Nexus Dashboard Orchestrator service:

Code Snippet
Copycurl -k --request GET 'https://<nd-node-ip>/mso/api/v1/sites' \
  --header 'Cookie: AuthCookie=eyJhbGciOiJSUzI1NiIsImtpZCI6InliZTVvZjMzODFqcXphczZsZnZ5Y3c0MmlsOXZ3Ym9hIiwidHlwIjoiSldUIn0.eyJhdnBhaXIiOiJzaGVsbDpkb21haW5zPWFsbC9hZG1pbi8iLCJjbHVzdGVyIjoiNjQ2NTc2NjMtNmM3NS03Mzc0LTY1NzItMzEyZDMzMzIyZDMzIiwiZXhwIjoxNjQ0MzQzMjYzLCJpYXQiOjE2NDQzNDIwNjMsImlkIjoiNDhkMTA1YmRmYmM0OWE1ZmNmMzlhMTBiOTYxMzg2ZTYxZGZlNDAwODVjYjAzMTVkODE4Yjc2MWM1NzM1ZGFmYSIsImlzcyI6Im5kIiwiaXNzLWhvc3QiOiIxMC4zMC4xMS4zMiIsInJiYWMiOlt7ImRvbWFpbiI6ImFsbCIsInJvbGVzUiI6MTY3NzcyMTYsInJvbGVzVyI6MSwicm9sZXMiOltbImFkbWluIiwiV3JpdGVQcml2Il0sWyJhcHAtdXNlciIsIlJlYWRQcml2Il1dfV0sInNlc3Npb25pZCI6IlNKTVhQTXpiMWNNRHVTNjBaUmUzR0NDRSIsInVzZXJmbGFncyI6MCwidXNlcmlkIjoyNTAwMiwidXNlcm5hbWUiOiJhZG1pbiIsInVzZXJ0eXBlIjoibG9jYWwifQ.TbGc5Wz9-16WIH6UChYEfplRie9v_n4LrTpOthx2Mepl0FIseTkQwJGAzaBIsIjJ1dIWXjayXzVtHNURe2LHdwFIHZ9lkWGfsvh6xsrBWWerZDYuV4nsF9J0hW-LuTsnZCQxyPwL99G1SVcBKgDsnpblqkOi68cbkjED-C1ecG2WBgG3xFnjE7fQbI0Sr1y61q4FNhdkq9CBhs9jXHM4NCHDRFO8nqug67LsSJ9A-VLZXXxGJ4M9IejJkff76uz14YRoqbzgLQzvhmNkrxAqcbFm_LENV48T-2XJzcFqO7GMddmWqKxx0h4cTYps7umT63Qcnwp80rMa_7GWBsSFrw'
Or the same call using the token shell variable:

Code Snippet
Copycurl -k --request GET 'https://<nd-node-ip>/mso/api/v1/sites' \
  --header 'Cookie: AuthCookie='"$AUTH_TOKEN"''
Response output:

Code Snippet
Copy{"sites":[{"id":"5fd30eb7bc10432dc4dd3cfe","name":"scale-ms6","urls":["https://180.168.61.11"],"username":"Cisco_MSO_UvjzxTgS","password":"******","apicSiteId":"6","labels":null,"platform":"on-premise","apicVersion":"5.1(2g)","maintenanceMode":false,"health":{}},{"id":"5fd30e74bc10432dc4dd3cfb","name":"scale-ms11","urls":["https://180.168.111.11"],"username":"Cisco_MSO_UvjzxTgS","password":"******","apicSiteId":"254","labels":null,"platform":"on-premise","apicVersion":"5.2(3.116a)","maintenanceMode":false,"health":{}},{"id":"5fd30ea0bc10432dc4dd3cfd","name":"scale-ms8","urls":["https://180.168.81.11"],"username":"Cisco_MSO_UvjzxTgS","password":"******","apicSiteId":"8","labels":null,"platform":"on-premise","apicVersion":"5.0(2j)","maintenanceMode":false,"health":{}},{"id":"5fd30efb8f01cb182a28cb6e","name":"scale-ms10","urls":["https://180.168.101.11"],"username":"Cisco_MSO_UvjzxTgS","password":"******","apicSiteId":"10","labels":null,"platform":"on-premise","apicVersion":"5.2(3.96a)","maintenanceMode":false,"health":{}},{"id":"5fd30e8ebc10432dc4dd3cfc","name":"scale-ms7","urls":["https://180.168.71.11"],"username":"Cisco_MSO_UvjzxTgS","password":"******","apicSiteId":"7","labels":null,"platform":"on-premise","apicVersion":"4.2(7n)","maintenanceMode":false,"health":{}},{"id":"5fd30ee98f01cb182a28cb6d","name":"scale-ms9","urls":["https://180.168.91.11"],"username":"Cisco_MSO_UvjzxTgS","password":"******","apicSiteId":"9","labels":null,"platform":"on-premise","apicVersion":"5.2(2f)","maintenanceMode":false,"health":{}},{"id":"5fd30edbbc10432dc4dd3d00","name":"scale1","urls":["https://192.168.0.20"],"username":"Cisco_MSO_UvjzxTgS","password":"******","apicSiteId":"5","labels":null,"platform":"on-premise","apicVersion":"5.2(3.108a)","maintenanceMode":false,"health":{}},{"id":"5fd30ecbbc10432dc4dd3cff","name":"scale-ms12","urls":["https://180.168.121.11"],"username":"Cisco_MSO_UvjzxTgS","password":"******","apicSiteId":"12","labels":null,"platform":"on-premise","apicVersion":"5.1(3e)","maintenanceMode":false,"health":{}}]}
Troubleshooting
A successful API call returns the 200 status code. If the response payload contains a status code other than 200, it typically also includes an error message to indicate a specific issue. In addition to the error message, you can check the following:

Check that you selected the correct action (for example, POST) for the specific API you are using.

The action is specified next to the API call in the API reference: API Action

Verify that the URL you provided is the same URL that you use to log into the Nexus Dashboard GUI.

Ensure that SSL certificate verification is disabled in Postman settings.

Check the Nexus Dashboard cluster health using the GUI or acs health command to verify there are no issues with the cluster that could prevent you from using the APIs.