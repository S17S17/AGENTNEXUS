Administration
Programmatically manage your organization. The Audit Logs endpoint provides a log of all actions taken in the organization for security and monitoring purposes. To access these endpoints please generate an Admin API Key through the API Platform Organization overview. Admin API keys cannot be used for non-administration endpoints. For best practices on setting up your organization, please refer to this guide

Admin API Keys
The Usage API provides detailed insights into your activity across the OpenAI API. It also includes a separate Costs endpoint, which offers visibility into your spend, breaking down consumption by invoice line items and project IDs. While the Usage API delivers granular usage data, it may not always reconcile perfectly with the Costs due to minor differences in how usage and spend are recorded. For financial purposes, we recommend using the Costs endpoint or the Costs tab in the Usage Dashboard, which will reconcile back to your billing invoice.

List admin API keys
get
 
https://api.openai.com/v1/organization/admin_api_keys
List organization API keys

Query parameters
after
string or null

Optional
limit
integer

Optional
Defaults to 20
order
string

Optional
Defaults to asc
Returns
A list of admin API key objects.

Example request
curl https://api.openai.com/v1/organization/admin_api_keys?after=key_abc&limit=20 \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"
Response
{
  "object": "list",
  "data": [
    {
      "object": "organization.admin_api_key",
      "id": "key_abc",
      "name": "Main Admin Key",
      "redacted_value": "sk-admin...def",
      "created_at": 1711471533,
      "owner": {
        "type": "service_account",
        "object": "organization.service_account",
        "id": "sa_456",
        "name": "My Service Account",
        "created_at": 1711471533,
        "role": "member"
      }
    }
  ],
  "first_id": "key_abc",
  "last_id": "key_abc",
  "has_more": false
}
Create admin API key
post
 
https://api.openai.com/v1/organization/admin_api_keys
Create an organization admin API key

Request body
name
string

Required
Returns
The created admin API key object.

Example request
curl -X POST https://api.openai.com/v1/organization/admin_api_keys \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
      "name": "New Admin Key"
  }'
Response
{
  "object": "organization.admin_api_key",
  "id": "key_xyz",
  "name": "New Admin Key",
  "redacted_value": "sk-admin...xyz",
  "created_at": 1711471533,
  "owner": {
    "type": "user",
    "object": "organization.user",
    "id": "user_123",
    "name": "John Doe",
    "created_at": 1711471533,
    "role": "owner"
  },
  "value": "sk-admin-1234abcd"
}
Retrieve admin API key
get
 
https://api.openai.com/v1/organization/admin_api_keys/{key_id}
Retrieve a single organization API key

Path parameters
key_id
string

Required
Returns
The requested admin API key object.

Example request
curl https://api.openai.com/v1/organization/admin_api_keys/key_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"
Response
{
  "object": "organization.admin_api_key",
  "id": "key_abc",
  "name": "Main Admin Key",
  "redacted_value": "sk-admin...xyz",
  "created_at": 1711471533,
  "owner": {
    "type": "user",
    "object": "organization.user",
    "id": "user_123",
    "name": "John Doe",
    "created_at": 1711471533,
    "role": "owner"
  }
}
Delete admin API key
delete
 
https://api.openai.com/v1/organization/admin_api_keys/{key_id}
Delete an organization admin API key

Path parameters
key_id
string

Required
Returns
A confirmation object indicating the key was deleted.

Example request
curl -X DELETE https://api.openai.com/v1/organization/admin_api_keys/key_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"
Response
{
  "id": "key_abc",
  "object": "organization.admin_api_key.deleted",
  "deleted": true
}
Invites
Invite and manage invitations for an organization.

List invites
get
 
https://api.openai.com/v1/organization/invites
Returns a list of invites in the organization.

Query parameters
after
string

Optional
A cursor for use in pagination. after is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

limit
integer

Optional
Defaults to 20
A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

Returns
A list of Invite objects.

Example request
curl https://api.openai.com/v1/organization/invites?after=invite-abc&limit=20 \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"
Response
{
  "object": "list",
  "data": [
    {
      "object": "organization.invite",
      "id": "invite-abc",
      "email": "user@example.com",
      "role": "owner",
      "status": "accepted",
      "invited_at": 1711471533,
      "expires_at": 1711471533,
      "accepted_at": 1711471533
    }
  ],
  "first_id": "invite-abc",
  "last_id": "invite-abc",
  "has_more": false
}
Create invite
post
 
https://api.openai.com/v1/organization/invites
Create an invite for a user to the organization. The invite must be accepted by the user before they have access to the organization.

Request body
email
string

Required
Send an email to this address

role
string

Required
owner or reader

projects
array

Optional
An array of projects to which membership is granted at the same time the org invite is accepted. If omitted, the user will be invited to the default project for compatibility with legacy behavior.


Show properties
Returns
The created Invite object.

Example request
curl -X POST https://api.openai.com/v1/organization/invites \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
      "email": "anotheruser@example.com",
      "role": "reader",
      "projects": [
        {
          "id": "project-xyz",
          "role": "member"
        },
        {
          "id": "project-abc",
          "role": "owner"
        }
      ]
  }'
Response
{
  "object": "organization.invite",
  "id": "invite-def",
  "email": "anotheruser@example.com",
  "role": "reader",
  "status": "pending",
  "invited_at": 1711471533,
  "expires_at": 1711471533,
  "accepted_at": null,
  "projects": [
    {
      "id": "project-xyz",
      "role": "member"
    },
    {
      "id": "project-abc",
      "role": "owner"
    }
  ]
}
Retrieve invite
get
 
https://api.openai.com/v1/organization/invites/{invite_id}
Retrieves an invite.

Path parameters
invite_id
string

Required
The ID of the invite to retrieve.

Returns
The Invite object matching the specified ID.

Example request
curl https://api.openai.com/v1/organization/invites/invite-abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"
Response
{
    "object": "organization.invite",
    "id": "invite-abc",
    "email": "user@example.com",
    "role": "owner",
    "status": "accepted",
    "invited_at": 1711471533,
    "expires_at": 1711471533,
    "accepted_at": 1711471533
}
Delete invite
delete
 
https://api.openai.com/v1/organization/invites/{invite_id}
Delete an invite. If the invite has already been accepted, it cannot be deleted.

Path parameters
invite_id
string

Required
The ID of the invite to delete.

Returns
Confirmation that the invite has been deleted

Example request
curl -X DELETE https://api.openai.com/v1/organization/invites/invite-abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"
Response
{
    "object": "organization.invite.deleted",
    "id": "invite-abc",
    "deleted": true
}
The invite object
Represents an individual invite to the organization.

accepted_at
integer

The Unix timestamp (in seconds) of when the invite was accepted.

email
string

The email address of the individual to whom the invite was sent

expires_at
integer

The Unix timestamp (in seconds) of when the invite expires.

id
string

The identifier, which can be referenced in API endpoints

invited_at
integer

The Unix timestamp (in seconds) of when the invite was sent.

object
string

The object type, which is always organization.invite

projects
array

The projects that were granted membership upon acceptance of the invite.


Show properties
role
string

owner or reader

status
string

accepted,expired, or pending

OBJECT The invite object
{
  "object": "organization.invite",
  "id": "invite-abc",
  "email": "user@example.com",
  "role": "owner",
  "status": "accepted",
  "invited_at": 1711471533,
  "expires_at": 1711471533,
  "accepted_at": 1711471533,
  "projects": [
    {
      "id": "project-xyz",
      "role": "member"
    }
  ]
}
Users
Manage users and their role in an organization.

List users
get
 
https://api.openai.com/v1/organization/users
Lists all of the users in the organization.

Query parameters
after
string

Optional
A cursor for use in pagination. after is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

emails
array

Optional
Filter by the email address of users.

limit
integer

Optional
Defaults to 20
A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

Returns
A list of User objects.

Example request
curl https://api.openai.com/v1/organization/users?after=user_abc&limit=20 \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"
Response
{
    "object": "list",
    "data": [
        {
            "object": "organization.user",
            "id": "user_abc",
            "name": "First Last",
            "email": "user@example.com",
            "role": "owner",
            "added_at": 1711471533
        }
    ],
    "first_id": "user-abc",
    "last_id": "user-xyz",
    "has_more": false
}
Modify user
post
 
https://api.openai.com/v1/organization/users/{user_id}
Modifies a user's role in the organization.

Path parameters
user_id
string

Required
The ID of the user.

Request body
role
string

Required
owner or reader

Returns
The updated User object.

Example request
curl -X POST https://api.openai.com/v1/organization/users/user_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
      "role": "owner"
  }'
Response
{
    "object": "organization.user",
    "id": "user_abc",
    "name": "First Last",
    "email": "user@example.com",
    "role": "owner",
    "added_at": 1711471533
}
Retrieve user
get
 
https://api.openai.com/v1/organization/users/{user_id}
Retrieves a user by their identifier.

Path parameters
user_id
string

Required
The ID of the user.

Returns
The User object matching the specified ID.

Example request
curl https://api.openai.com/v1/organization/users/user_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"
Response
{
    "object": "organization.user",
    "id": "user_abc",
    "name": "First Last",
    "email": "user@example.com",
    "role": "owner",
    "added_at": 1711471533
}
Delete user
delete
 
https://api.openai.com/v1/organization/users/{user_id}
Deletes a user from the organization.

Path parameters
user_id
string

Required
The ID of the user.

Returns
Confirmation of the deleted user

Example request
curl -X DELETE https://api.openai.com/v1/organization/users/user_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"
Response
{
    "object": "organization.user.deleted",
    "id": "user_abc",
    "deleted": true
}
The user object
Represents an individual user within an organization.

added_at
integer

The Unix timestamp (in seconds) of when the user was added.

email
string

The email address of the user

id
string

The identifier, which can be referenced in API endpoints

name
string

The name of the user

object
string

The object type, which is always organization.user

role
string

owner or reader

OBJECT The user object
{
    "object": "organization.user",
    "id": "user_abc",
    "name": "First Last",
    "email": "user@example.com",
    "role": "owner",
    "added_at": 1711471533
}
Projects
Manage the projects within an orgnanization includes creation, updating, and archiving or projects. The Default project cannot be archived.

List projects
get
 
https://api.openai.com/v1/organization/projects
Returns a list of projects.

Query parameters
after
string

Optional
A cursor for use in pagination. after is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

include_archived
boolean

Optional
Defaults to false
If true returns all projects including those that have been archived. Archived projects are not included by default.

limit
integer

Optional
Defaults to 20
A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

Returns
A list of Project objects.

Example request
curl https://api.openai.com/v1/organization/projects?after=proj_abc&limit=20&include_archived=false \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"
Response
{
    "object": "list",
    "data": [
        {
            "id": "proj_abc",
            "object": "organization.project",
            "name": "Project example",
            "created_at": 1711471533,
            "archived_at": null,
            "status": "active"
        }
    ],
    "first_id": "proj-abc",
    "last_id": "proj-xyz",
    "has_more": false
}
Create project
post
 
https://api.openai.com/v1/organization/projects
Create a new project in the organization. Projects can be created and archived, but cannot be deleted.

Request body
name
string

Required
The friendly name of the project, this name appears in reports.

Returns
The created Project object.

Example request
curl -X POST https://api.openai.com/v1/organization/projects \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
      "name": "Project ABC"
  }'
Response
{
    "id": "proj_abc",
    "object": "organization.project",
    "name": "Project ABC",
    "created_at": 1711471533,
    "archived_at": null,
    "status": "active"
}
Retrieve project
get
 
https://api.openai.com/v1/organization/projects/{project_id}
Retrieves a project.

Path parameters
project_id
string

Required
The ID of the project.

Returns
The Project object matching the specified ID.

Example request
curl https://api.openai.com/v1/organization/projects/proj_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"
Response
{
    "id": "proj_abc",
    "object": "organization.project",
    "name": "Project example",
    "created_at": 1711471533,
    "archived_at": null,
    "status": "active"
}
Modify project
post
 
https://api.openai.com/v1/organization/projects/{project_id}
Modifies a project in the organization.

Path parameters
project_id
string

Required
The ID of the project.

Request body
name
string

Required
The updated name of the project, this name appears in reports.

Returns
The updated Project object.

Example request
curl -X POST https://api.openai.com/v1/organization/projects/proj_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
      "name": "Project DEF"
  }'
Archive project
post
 
https://api.openai.com/v1/organization/projects/{project_id}/archive
Archives a project in the organization. Archived projects cannot be used or updated.

Path parameters
project_id
string

Required
The ID of the project.

Returns
The archived Project object.

Example request
curl -X POST https://api.openai.com/v1/organization/projects/proj_abc/archive \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"
Response
{
    "id": "proj_abc",
    "object": "organization.project",
    "name": "Project DEF",
    "created_at": 1711471533,
    "archived_at": 1711471533,
    "status": "archived"
}
The project object
Represents an individual project.

archived_at
integer or null

The Unix timestamp (in seconds) of when the project was archived or null.

created_at
integer

The Unix timestamp (in seconds) of when the project was created.

id
string

The identifier, which can be referenced in API endpoints

name
string

The name of the project. This appears in reporting.

object
string

The object type, which is always organization.project

status
string

active or archived

OBJECT The project object
{
    "id": "proj_abc",
    "object": "organization.project",
    "name": "Project example",
    "created_at": 1711471533,
    "archived_at": null,
    "status": "active"
}
Project users
Manage users within a project, including adding, updating roles, and removing users.

List project users
get
 
https://api.openai.com/v1/organization/projects/{project_id}/users
Returns a list of users in the project.

Path parameters
project_id
string

Required
The ID of the project.

Query parameters
after
string

Optional
A cursor for use in pagination. after is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

limit
integer

Optional
Defaults to 20
A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

Returns
A list of ProjectUser objects.

Example request
curl https://api.openai.com/v1/organization/projects/proj_abc/users?after=user_abc&limit=20 \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"
Response
{
    "object": "list",
    "data": [
        {
            "object": "organization.project.user",
            "id": "user_abc",
            "name": "First Last",
            "email": "user@example.com",
            "role": "owner",
            "added_at": 1711471533
        }
    ],
    "first_id": "user-abc",
    "last_id": "user-xyz",
    "has_more": false
}
Create project user
post
 
https://api.openai.com/v1/organization/projects/{project_id}/users
Adds a user to the project. Users must already be members of the organization to be added to a project.

Path parameters
project_id
string

Required
The ID of the project.

Request body
role
string

Required
owner or member

user_id
string

Required
The ID of the user.

Returns
The created ProjectUser object.

Example request
curl -X POST https://api.openai.com/v1/organization/projects/proj_abc/users \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
      "user_id": "user_abc",
      "role": "member"
  }'
Response
{
    "object": "organization.project.user",
    "id": "user_abc",
    "email": "user@example.com",
    "role": "owner",
    "added_at": 1711471533
}
Retrieve project user
get
 
https://api.openai.com/v1/organization/projects/{project_id}/users/{user_id}
Retrieves a user in the project.

Path parameters
project_id
string

Required
The ID of the project.

user_id
string

Required
The ID of the user.

Returns
The ProjectUser object matching the specified ID.

Example request
curl https://api.openai.com/v1/organization/projects/proj_abc/users/user_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"
Response
{
    "object": "organization.project.user",
    "id": "user_abc",
    "name": "First Last",
    "email": "user@example.com",
    "role": "owner",
    "added_at": 1711471533
}
Modify project user
post
 
https://api.openai.com/v1/organization/projects/{project_id}/users/{user_id}
Modifies a user's role in the project.

Path parameters
project_id
string

Required
The ID of the project.

user_id
string

Required
The ID of the user.

Request body
role
string

Required
owner or member

Returns
The updated ProjectUser object.

Example request
curl -X POST https://api.openai.com/v1/organization/projects/proj_abc/users/user_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
      "role": "owner"
  }'
Response
{
    "object": "organization.project.user",
    "id": "user_abc",
    "name": "First Last",
    "email": "user@example.com",
    "role": "owner",
    "added_at": 1711471533
}
Delete project user
delete
 
https://api.openai.com/v1/organization/projects/{project_id}/users/{user_id}
Deletes a user from the project.

Path parameters
project_id
string

Required
The ID of the project.

user_id
string

Required
The ID of the user.

Returns
Confirmation that project has been deleted or an error in case of an archived project, which has no users

Example request
curl -X DELETE https://api.openai.com/v1/organization/projects/proj_abc/users/user_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"
Response
{
    "object": "organization.project.user.deleted",
    "id": "user_abc",
    "deleted": true
}
The project user object
Represents an individual user in a project.

added_at
integer

The Unix timestamp (in seconds) of when the project was added.

email
string

The email address of the user

id
string

The identifier, which can be referenced in API endpoints

name
string

The name of the user

object
string

The object type, which is always organization.project.user

role
string

owner or member

OBJECT The project user object
{
    "object": "organization.project.user",
    "id": "user_abc",
    "name": "First Last",
    "email": "user@example.com",
    "role": "owner",
    "added_at": 1711471533
}
Project service accounts
Manage service accounts within a project. A service account is a bot user that is not associated with a user. If a user leaves an organization, their keys and membership in projects will no longer work. Service accounts do not have this limitation. However, service accounts can also be deleted from a project.

List project service accounts
get
 
https://api.openai.com/v1/organization/projects/{project_id}/service_accounts
Returns a list of service accounts in the project.

Path parameters
project_id
string

Required
The ID of the project.

Query parameters
after
string

Optional
A cursor for use in pagination. after is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

limit
integer

Optional
Defaults to 20
A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

Returns
A list of ProjectServiceAccount objects.

Example request
curl https://api.openai.com/v1/organization/projects/proj_abc/service_accounts?after=custom_id&limit=20 \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"
Response
{
    "object": "list",
    "data": [
        {
            "object": "organization.project.service_account",
            "id": "svc_acct_abc",
            "name": "Service Account",
            "role": "owner",
            "created_at": 1711471533
        }
    ],
    "first_id": "svc_acct_abc",
    "last_id": "svc_acct_xyz",
    "has_more": false
}
Create project service account
post
 
https://api.openai.com/v1/organization/projects/{project_id}/service_accounts
Creates a new service account in the project. This also returns an unredacted API key for the service account.

Path parameters
project_id
string

Required
The ID of the project.

Request body
name
string

Required
The name of the service account being created.

Returns
The created ProjectServiceAccount object.

Example request
curl -X POST https://api.openai.com/v1/organization/projects/proj_abc/service_accounts \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
      "name": "Production App"
  }'
Response
{
    "object": "organization.project.service_account",
    "id": "svc_acct_abc",
    "name": "Production App",
    "role": "member",
    "created_at": 1711471533,
    "api_key": {
        "object": "organization.project.service_account.api_key",
        "value": "sk-abcdefghijklmnop123",
        "name": "Secret Key",
        "created_at": 1711471533,
        "id": "key_abc"
    }
}
Retrieve project service account
get
 
https://api.openai.com/v1/organization/projects/{project_id}/service_accounts/{service_account_id}
Retrieves a service account in the project.

Path parameters
project_id
string

Required
The ID of the project.

service_account_id
string

Required
The ID of the service account.

Returns
The ProjectServiceAccount object matching the specified ID.

Example request
curl https://api.openai.com/v1/organization/projects/proj_abc/service_accounts/svc_acct_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"
Response
{
    "object": "organization.project.service_account",
    "id": "svc_acct_abc",
    "name": "Service Account",
    "role": "owner",
    "created_at": 1711471533
}
Delete project service account
delete
 
https://api.openai.com/v1/organization/projects/{project_id}/service_accounts/{service_account_id}
Deletes a service account from the project.

Path parameters
project_id
string

Required
The ID of the project.

service_account_id
string

Required
The ID of the service account.

Returns
Confirmation of service account being deleted, or an error in case of an archived project, which has no service accounts

Example request
curl -X DELETE https://api.openai.com/v1/organization/projects/proj_abc/service_accounts/svc_acct_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"
Response
{
    "object": "organization.project.service_account.deleted",
    "id": "svc_acct_abc",
    "deleted": true
}
The project service account object
Represents an individual service account in a project.

created_at
integer

The Unix timestamp (in seconds) of when the service account was created

id
string

The identifier, which can be referenced in API endpoints

name
string

The name of the service account

object
string

The object type, which is always organization.project.service_account

role
string

owner or member

OBJECT The project service account object
{
    "object": "organization.project.service_account",
    "id": "svc_acct_abc",
    "name": "Service Account",
    "role": "owner",
    "created_at": 1711471533
}
Project API keys
Manage API keys for a given project. Supports listing and deleting keys for users. This API does not allow issuing keys for users, as users need to authorize themselves to generate keys.

List project API keys
get
 
https://api.openai.com/v1/organization/projects/{project_id}/api_keys
Returns a list of API keys in the project.

Path parameters
project_id
string

Required
The ID of the project.

Query parameters
after
string

Optional
A cursor for use in pagination. after is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

limit
integer

Optional
Defaults to 20
A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

Returns
A list of ProjectApiKey objects.

Example request
curl https://api.openai.com/v1/organization/projects/proj_abc/api_keys?after=key_abc&limit=20 \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"
Response
{
    "object": "list",
    "data": [
        {
            "object": "organization.project.api_key",
            "redacted_value": "sk-abc...def",
            "name": "My API Key",
            "created_at": 1711471533,
            "id": "key_abc",
            "owner": {
                "type": "user",
                "user": {
                    "object": "organization.project.user",
                    "id": "user_abc",
                    "name": "First Last",
                    "email": "user@example.com",
                    "role": "owner",
                    "added_at": 1711471533
                }
            }
        }
    ],
    "first_id": "key_abc",
    "last_id": "key_xyz",
    "has_more": false
}
Retrieve project API key
get
 
https://api.openai.com/v1/organization/projects/{project_id}/api_keys/{key_id}
Retrieves an API key in the project.

Path parameters
key_id
string

Required
The ID of the API key.

project_id
string

Required
The ID of the project.

Returns
The ProjectApiKey object matching the specified ID.

Example request
curl https://api.openai.com/v1/organization/projects/proj_abc/api_keys/key_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"
Response
{
    "object": "organization.project.api_key",
    "redacted_value": "sk-abc...def",
    "name": "My API Key",
    "created_at": 1711471533,
    "id": "key_abc",
    "owner": {
        "type": "user",
        "user": {
            "object": "organization.project.user",
            "id": "user_abc",
            "name": "First Last",
            "email": "user@example.com",
            "role": "owner",
            "added_at": 1711471533
        }
    }
}
Delete project API key
delete
 
https://api.openai.com/v1/organization/projects/{project_id}/api_keys/{key_id}
Deletes an API key from the project.

Path parameters
key_id
string

Required
The ID of the API key.

project_id
string

Required
The ID of the project.

Returns
Confirmation of the key's deletion or an error if the key belonged to a service account

Example request
curl -X DELETE https://api.openai.com/v1/organization/projects/proj_abc/api_keys/key_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"
Response
{
    "object": "organization.project.api_key.deleted",
    "id": "key_abc",
    "deleted": true
}
The project API key object
Represents an individual API key in a project.

created_at
integer

The Unix timestamp (in seconds) of when the API key was created

id
string

The identifier, which can be referenced in API endpoints

name
string

The name of the API key

object
string

The object type, which is always organization.project.api_key

owner
object


Show properties
redacted_value
string

The redacted value of the API key

OBJECT The project API key object
{
    "object": "organization.project.api_key",
    "redacted_value": "sk-abc...def",
    "name": "My API Key",
    "created_at": 1711471533,
    "id": "key_abc",
    "owner": {
        "type": "user",
        "user": {
            "object": "organization.project.user",
            "id": "user_abc",
            "name": "First Last",
            "email": "user@example.com",
            "role": "owner",
            "created_at": 1711471533
        }
    }
}
Project rate limits
Manage rate limits per model for projects. Rate limits may be configured to be equal to or lower than the organization's rate limits.

List project rate limits
get
 
https://api.openai.com/v1/organization/projects/{project_id}/rate_limits
Returns the rate limits per model for a project.

Path parameters
project_id
string

Required
The ID of the project.

Query parameters
after
string

Optional
A cursor for use in pagination. after is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

before
string

Optional
A cursor for use in pagination. before is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, beginning with obj_foo, your subsequent call can include before=obj_foo in order to fetch the previous page of the list.

limit
integer

Optional
Defaults to 100
A limit on the number of objects to be returned. The default is 100.

Returns
A list of ProjectRateLimit objects.

Example request
curl https://api.openai.com/v1/organization/projects/proj_abc/rate_limits?after=rl_xxx&limit=20 \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"
Response
{
    "object": "list",
    "data": [
        {
          "object": "project.rate_limit",
          "id": "rl-ada",
          "model": "ada",
          "max_requests_per_1_minute": 600,
          "max_tokens_per_1_minute": 150000,
          "max_images_per_1_minute": 10
        }
    ],
    "first_id": "rl-ada",
    "last_id": "rl-ada",
    "has_more": false
}
Modify project rate limit
post
 
https://api.openai.com/v1/organization/projects/{project_id}/rate_limits/{rate_limit_id}
Updates a project rate limit.

Path parameters
project_id
string

Required
The ID of the project.

rate_limit_id
string

Required
The ID of the rate limit.

Request body
batch_1_day_max_input_tokens
integer

Optional
The maximum batch input tokens per day. Only relevant for certain models.

max_audio_megabytes_per_1_minute
integer

Optional
The maximum audio megabytes per minute. Only relevant for certain models.

max_images_per_1_minute
integer

Optional
The maximum images per minute. Only relevant for certain models.

max_requests_per_1_day
integer

Optional
The maximum requests per day. Only relevant for certain models.

max_requests_per_1_minute
integer

Optional
The maximum requests per minute.

max_tokens_per_1_minute
integer

Optional
The maximum tokens per minute.

Returns
The updated ProjectRateLimit object.

Example request
curl -X POST https://api.openai.com/v1/organization/projects/proj_abc/rate_limits/rl_xxx \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
      "max_requests_per_1_minute": 500
  }'
Response
{
    "object": "project.rate_limit",
    "id": "rl-ada",
    "model": "ada",
    "max_requests_per_1_minute": 600,
    "max_tokens_per_1_minute": 150000,
    "max_images_per_1_minute": 10
  }
The project rate limit object
Represents a project rate limit config.

batch_1_day_max_input_tokens
integer

The maximum batch input tokens per day. Only present for relevant models.

id
string

The identifier, which can be referenced in API endpoints.

max_audio_megabytes_per_1_minute
integer

The maximum audio megabytes per minute. Only present for relevant models.

max_images_per_1_minute
integer

The maximum images per minute. Only present for relevant models.

max_requests_per_1_day
integer

The maximum requests per day. Only present for relevant models.

max_requests_per_1_minute
integer

The maximum requests per minute.

max_tokens_per_1_minute
integer

The maximum tokens per minute.

model
string

The model this rate limit applies to.

object
string

The object type, which is always project.rate_limit

OBJECT The project rate limit object
{
    "object": "project.rate_limit",
    "id": "rl_ada",
    "model": "ada",
    "max_requests_per_1_minute": 600,
    "max_tokens_per_1_minute": 150000,
    "max_images_per_1_minute": 10
}
Audit logs
Logs of user actions and configuration changes within this organization. To log events, you must activate logging in the Organization Settings. Once activated, for security reasons, logging cannot be deactivated.

List audit logs
get
 
https://api.openai.com/v1/organization/audit_logs
List user actions and configuration changes within this organization.

Query parameters
actor_emails[]
array

Optional
Return only events performed by users with these emails.

actor_ids[]
array

Optional
Return only events performed by these actors. Can be a user ID, a service account ID, or an api key tracking ID.

after
string

Optional
A cursor for use in pagination. after is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

before
string

Optional
A cursor for use in pagination. before is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, starting with obj_foo, your subsequent call can include before=obj_foo in order to fetch the previous page of the list.

effective_at
object

Optional
Return only events whose effective_at (Unix seconds) is in this range.


Show properties
event_types[]
array

Optional
Return only events with a type in one of these values. For example, project.created. For all options, see the documentation for the audit log object.

limit
integer

Optional
Defaults to 20
A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

project_ids[]
array

Optional
Return only events for these projects.

resource_ids[]
array

Optional
Return only events performed on these targets. For example, a project ID updated.

Returns
A list of paginated Audit Log objects.

Example request
curl https://api.openai.com/v1/organization/audit_logs \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
-H "Content-Type: application/json"
Response
{
    "object": "list",
    "data": [
        {
            "id": "audit_log-xxx_yyyymmdd",
            "type": "project.archived",
            "effective_at": 1722461446,
            "actor": {
                "type": "api_key",
                "api_key": {
                    "type": "user",
                    "user": {
                        "id": "user-xxx",
                        "email": "user@example.com"
                    }
                }
            },
            "project.archived": {
                "id": "proj_abc"
            },
        },
        {
            "id": "audit_log-yyy__20240101",
            "type": "api_key.updated",
            "effective_at": 1720804190,
            "actor": {
                "type": "session",
                "session": {
                    "user": {
                        "id": "user-xxx",
                        "email": "user@example.com"
                    },
                    "ip_address": "127.0.0.1",
                    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                    "ja3": "a497151ce4338a12c4418c44d375173e",
                    "ja4": "q13d0313h3_55b375c5d22e_c7319ce65786",
                    "ip_address_details": {
                      "country": "US",
                      "city": "San Francisco",
                      "region": "California",
                      "region_code": "CA",
                      "asn": "1234",
                      "latitude": "37.77490",
                      "longitude": "-122.41940"
                    }
                }
            },
            "api_key.updated": {
                "id": "key_xxxx",
                "data": {
                    "scopes": ["resource_2.operation_2"]
                }
            },
        }
    ],
    "first_id": "audit_log-xxx__20240101",
    "last_id": "audit_log_yyy__20240101",
    "has_more": true
}
The audit log object
A log of a user action or configuration change within this organization.

actor
object

The actor who performed the audit logged action.


Show properties
api_key.created
object

The details for events with this type.


Show properties
api_key.deleted
object

The details for events with this type.


Show properties
api_key.updated
object

The details for events with this type.


Show properties
effective_at
integer

The Unix timestamp (in seconds) of the event.

id
string

The ID of this log.

invite.accepted
object

The details for events with this type.


Show properties
invite.deleted
object

The details for events with this type.


Show properties
invite.sent
object

The details for events with this type.


Show properties
login.failed
object

The details for events with this type.


Show properties
logout.failed
object

The details for events with this type.


Show properties
organization.updated
object

The details for events with this type.


Show properties
project
object

The project that the action was scoped to. Absent for actions not scoped to projects.


Show properties
project.archived
object

The details for events with this type.


Show properties
project.created
object

The details for events with this type.


Show properties
project.updated
object

The details for events with this type.


Show properties
rate_limit.deleted
object

The details for events with this type.


Show properties
rate_limit.updated
object

The details for events with this type.


Show properties
service_account.created
object

The details for events with this type.


Show properties
service_account.deleted
object

The details for events with this type.


Show properties
service_account.updated
object

The details for events with this type.


Show properties
type
string

The event type.

user.added
object

The details for events with this type.


Show properties
user.deleted
object

The details for events with this type.


Show properties
user.updated
object

The details for events with this type.


Show properties
OBJECT The audit log object
{
    "id": "req_xxx_20240101",
    "type": "api_key.created",
    "effective_at": 1720804090,
    "actor": {
        "type": "session",
        "session": {
            "user": {
                "id": "user-xxx",
                "email": "user@example.com"
            },
            "ip_address": "127.0.0.1",
            "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
    },
    "api_key.created": {
        "id": "key_xxxx",
        "data": {
            "scopes": ["resource.operation"]
        }
    }
}
Usage
The Usage API provides detailed insights into your activity across the OpenAI API. It also includes a separate Costs endpoint, which offers visibility into your spend, breaking down consumption by invoice line items and project IDs.

While the Usage API delivers granular usage data, it may not always reconcile perfectly with the Costs due to minor differences in how usage and spend are recorded. For financial purposes, we recommend using the Costs endpoint or the Costs tab in the Usage Dashboard, which will reconcile back to your billing invoice.

Completions
get
 
https://api.openai.com/v1/organization/usage/completions
Get completions usage details for the organization.

Query parameters
start_time
integer

Required
Start time (Unix seconds) of the query time range, inclusive.

api_key_ids
array

Optional
Return only usage for these API keys.

batch
boolean

Optional
If true, return batch jobs only. If false, return non-batch jobs only. By default, return both.

bucket_width
string

Optional
Defaults to 1d
Width of each time bucket in response. Currently 1m, 1h and 1d are supported, default to 1d.

end_time
integer

Optional
End time (Unix seconds) of the query time range, exclusive.

group_by
array

Optional
Group the usage data by the specified fields. Support fields include project_id, user_id, api_key_id, model, batch or any combination of them.

limit
integer

Optional
Specifies the number of buckets to return.

bucket_width=1d: default: 7, max: 31
bucket_width=1h: default: 24, max: 168
bucket_width=1m: default: 60, max: 1440
models
array

Optional
Return only usage for these models.

page
string

Optional
A cursor for use in pagination. Corresponding to the next_page field from the previous response.

project_ids
array

Optional
Return only usage for these projects.

user_ids
array

Optional
Return only usage for these users.

Returns
A list of paginated, time bucketed Completions usage objects.

Example request
curl "https://api.openai.com/v1/organization/usage/completions?start_time=1730419200&limit=1" \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
-H "Content-Type: application/json"
Response
{
    "object": "page",
    "data": [
        {
            "object": "bucket",
            "start_time": 1730419200,
            "end_time": 1730505600,
            "results": [
                {
                    "object": "organization.usage.completions.result",
                    "input_tokens": 1000,
                    "output_tokens": 500,
                    "input_cached_tokens": 800,
                    "input_audio_tokens": 0,
                    "output_audio_tokens": 0,
                    "num_model_requests": 5,
                    "project_id": null,
                    "user_id": null,
                    "api_key_id": null,
                    "model": null,
                    "batch": null
                }
            ]
        }
    ],
    "has_more": true,
    "next_page": "page_AAAAAGdGxdEiJdKOAAAAAGcqsYA="
}
Completions usage object
The aggregated completions usage details of the specific time bucket.

api_key_id
string or null

When group_by=api_key_id, this field provides the API key ID of the grouped usage result.

batch
boolean or null

When group_by=batch, this field tells whether the grouped usage result is batch or not.

input_audio_tokens
integer

The aggregated number of audio input tokens used, including cached tokens.

input_cached_tokens
integer

The aggregated number of text input tokens that has been cached from previous requests. For customers subscribe to scale tier, this includes scale tier tokens.

input_tokens
integer

The aggregated number of text input tokens used, including cached tokens. For customers subscribe to scale tier, this includes scale tier tokens.

model
string or null

When group_by=model, this field provides the model name of the grouped usage result.

num_model_requests
integer

The count of requests made to the model.

object
string

output_audio_tokens
integer

The aggregated number of audio output tokens used.

output_tokens
integer

The aggregated number of text output tokens used. For customers subscribe to scale tier, this includes scale tier tokens.

project_id
string or null

When group_by=project_id, this field provides the project ID of the grouped usage result.

user_id
string or null

When group_by=user_id, this field provides the user ID of the grouped usage result.

OBJECT Completions usage object
{
    "object": "organization.usage.completions.result",
    "input_tokens": 5000,
    "output_tokens": 1000,
    "input_cached_tokens": 4000,
    "input_audio_tokens": 300,
    "output_audio_tokens": 200,
    "num_model_requests": 5,
    "project_id": "proj_abc",
    "user_id": "user-abc",
    "api_key_id": "key_abc",
    "model": "gpt-4o-mini-2024-07-18",
    "batch": false
}
Embeddings
get
 
https://api.openai.com/v1/organization/usage/embeddings
Get embeddings usage details for the organization.

Query parameters
start_time
integer

Required
Start time (Unix seconds) of the query time range, inclusive.

api_key_ids
array

Optional
Return only usage for these API keys.

bucket_width
string

Optional
Defaults to 1d
Width of each time bucket in response. Currently 1m, 1h and 1d are supported, default to 1d.

end_time
integer

Optional
End time (Unix seconds) of the query time range, exclusive.

group_by
array

Optional
Group the usage data by the specified fields. Support fields include project_id, user_id, api_key_id, model or any combination of them.

limit
integer

Optional
Specifies the number of buckets to return.

bucket_width=1d: default: 7, max: 31
bucket_width=1h: default: 24, max: 168
bucket_width=1m: default: 60, max: 1440
models
array

Optional
Return only usage for these models.

page
string

Optional
A cursor for use in pagination. Corresponding to the next_page field from the previous response.

project_ids
array

Optional
Return only usage for these projects.

user_ids
array

Optional
Return only usage for these users.

Returns
A list of paginated, time bucketed Embeddings usage objects.

Example request
curl "https://api.openai.com/v1/organization/usage/embeddings?start_time=1730419200&limit=1" \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
-H "Content-Type: application/json"
Response
{
    "object": "page",
    "data": [
        {
            "object": "bucket",
            "start_time": 1730419200,
            "end_time": 1730505600,
            "results": [
                {
                    "object": "organization.usage.embeddings.result",
                    "input_tokens": 16,
                    "num_model_requests": 2,
                    "project_id": null,
                    "user_id": null,
                    "api_key_id": null,
                    "model": null
                }
            ]
        }
    ],
    "has_more": false,
    "next_page": null
}
Embeddings usage object
The aggregated embeddings usage details of the specific time bucket.

api_key_id
string or null

When group_by=api_key_id, this field provides the API key ID of the grouped usage result.

input_tokens
integer

The aggregated number of input tokens used.

model
string or null

When group_by=model, this field provides the model name of the grouped usage result.

num_model_requests
integer

The count of requests made to the model.

object
string

project_id
string or null

When group_by=project_id, this field provides the project ID of the grouped usage result.

user_id
string or null

When group_by=user_id, this field provides the user ID of the grouped usage result.

OBJECT Embeddings usage object
{
    "object": "organization.usage.embeddings.result",
    "input_tokens": 20,
    "num_model_requests": 2,
    "project_id": "proj_abc",
    "user_id": "user-abc",
    "api_key_id": "key_abc",
    "model": "text-embedding-ada-002-v2"
}
Moderations
get
 
https://api.openai.com/v1/organization/usage/moderations
Get moderations usage details for the organization.

Query parameters
start_time
integer

Required
Start time (Unix seconds) of the query time range, inclusive.

api_key_ids
array

Optional
Return only usage for these API keys.

bucket_width
string

Optional
Defaults to 1d
Width of each time bucket in response. Currently 1m, 1h and 1d are supported, default to 1d.

end_time
integer

Optional
End time (Unix seconds) of the query time range, exclusive.

group_by
array

Optional
Group the usage data by the specified fields. Support fields include project_id, user_id, api_key_id, model or any combination of them.

limit
integer

Optional
Specifies the number of buckets to return.

bucket_width=1d: default: 7, max: 31
bucket_width=1h: default: 24, max: 168
bucket_width=1m: default: 60, max: 1440
models
array

Optional
Return only usage for these models.

page
string

Optional
A cursor for use in pagination. Corresponding to the next_page field from the previous response.

project_ids
array

Optional
Return only usage for these projects.

user_ids
array

Optional
Return only usage for these users.

Returns
A list of paginated, time bucketed Moderations usage objects.

Example request
curl "https://api.openai.com/v1/organization/usage/moderations?start_time=1730419200&limit=1" \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
-H "Content-Type: application/json"
Response
{
    "object": "page",
    "data": [
        {
            "object": "bucket",
            "start_time": 1730419200,
            "end_time": 1730505600,
            "results": [
                {
                    "object": "organization.usage.moderations.result",
                    "input_tokens": 16,
                    "num_model_requests": 2,
                    "project_id": null,
                    "user_id": null,
                    "api_key_id": null,
                    "model": null
                }
            ]
        }
    ],
    "has_more": false,
    "next_page": null
}
Moderations usage object
The aggregated moderations usage details of the specific time bucket.

api_key_id
string or null

When group_by=api_key_id, this field provides the API key ID of the grouped usage result.

input_tokens
integer

The aggregated number of input tokens used.

model
string or null

When group_by=model, this field provides the model name of the grouped usage result.

num_model_requests
integer

The count of requests made to the model.

object
string

project_id
string or null

When group_by=project_id, this field provides the project ID of the grouped usage result.

user_id
string or null

When group_by=user_id, this field provides the user ID of the grouped usage result.

OBJECT Moderations usage object
{
    "object": "organization.usage.moderations.result",
    "input_tokens": 20,
    "num_model_requests": 2,
    "project_id": "proj_abc",
    "user_id": "user-abc",
    "api_key_id": "key_abc",
    "model": "text-moderation"
}
Images
get
 
https://api.openai.com/v1/organization/usage/images
Get images usage details for the organization.

Query parameters
start_time
integer

Required
Start time (Unix seconds) of the query time range, inclusive.

api_key_ids
array

Optional
Return only usage for these API keys.

bucket_width
string

Optional
Defaults to 1d
Width of each time bucket in response. Currently 1m, 1h and 1d are supported, default to 1d.

end_time
integer

Optional
End time (Unix seconds) of the query time range, exclusive.

group_by
array

Optional
Group the usage data by the specified fields. Support fields include project_id, user_id, api_key_id, model, size, source or any combination of them.

limit
integer

Optional
Specifies the number of buckets to return.

bucket_width=1d: default: 7, max: 31
bucket_width=1h: default: 24, max: 168
bucket_width=1m: default: 60, max: 1440
models
array

Optional
Return only usage for these models.

page
string

Optional
A cursor for use in pagination. Corresponding to the next_page field from the previous response.

project_ids
array

Optional
Return only usage for these projects.

sizes
array

Optional
Return only usages for these image sizes. Possible values are 256x256, 512x512, 1024x1024, 1792x1792, 1024x1792 or any combination of them.

sources
array

Optional
Return only usages for these sources. Possible values are image.generation, image.edit, image.variation or any combination of them.

user_ids
array

Optional
Return only usage for these users.

Returns
A list of paginated, time bucketed Images usage objects.

Example request
curl "https://api.openai.com/v1/organization/usage/images?start_time=1730419200&limit=1" \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
-H "Content-Type: application/json"
Response
{
    "object": "page",
    "data": [
        {
            "object": "bucket",
            "start_time": 1730419200,
            "end_time": 1730505600,
            "results": [
                {
                    "object": "organization.usage.images.result",
                    "images": 2,
                    "num_model_requests": 2,
                    "size": null,
                    "source": null,
                    "project_id": null,
                    "user_id": null,
                    "api_key_id": null,
                    "model": null
                }
            ]
        }
    ],
    "has_more": false,
    "next_page": null
}
Images usage object
The aggregated images usage details of the specific time bucket.

api_key_id
string or null

When group_by=api_key_id, this field provides the API key ID of the grouped usage result.

images
integer

The number of images processed.

model
string or null

When group_by=model, this field provides the model name of the grouped usage result.

num_model_requests
integer

The count of requests made to the model.

object
string

project_id
string or null

When group_by=project_id, this field provides the project ID of the grouped usage result.

size
string or null

When group_by=size, this field provides the image size of the grouped usage result.

source
string or null

When group_by=source, this field provides the source of the grouped usage result, possible values are image.generation, image.edit, image.variation.

user_id
string or null

When group_by=user_id, this field provides the user ID of the grouped usage result.

OBJECT Images usage object
{
    "object": "organization.usage.images.result",
    "images": 2,
    "num_model_requests": 2,
    "size": "1024x1024",
    "source": "image.generation",
    "project_id": "proj_abc",
    "user_id": "user-abc",
    "api_key_id": "key_abc",
    "model": "dall-e-3"
}
Audio speeches
get
 
https://api.openai.com/v1/organization/usage/audio_speeches
Get audio speeches usage details for the organization.

Query parameters
start_time
integer

Required
Start time (Unix seconds) of the query time range, inclusive.

api_key_ids
array

Optional
Return only usage for these API keys.

bucket_width
string

Optional
Defaults to 1d
Width of each time bucket in response. Currently 1m, 1h and 1d are supported, default to 1d.

end_time
integer

Optional
End time (Unix seconds) of the query time range, exclusive.

group_by
array

Optional
Group the usage data by the specified fields. Support fields include project_id, user_id, api_key_id, model or any combination of them.

limit
integer

Optional
Specifies the number of buckets to return.

bucket_width=1d: default: 7, max: 31
bucket_width=1h: default: 24, max: 168
bucket_width=1m: default: 60, max: 1440
models
array

Optional
Return only usage for these models.

page
string

Optional
A cursor for use in pagination. Corresponding to the next_page field from the previous response.

project_ids
array

Optional
Return only usage for these projects.

user_ids
array

Optional
Return only usage for these users.

Returns
A list of paginated, time bucketed Audio speeches usage objects.

Example request
curl "https://api.openai.com/v1/organization/usage/audio_speeches?start_time=1730419200&limit=1" \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
-H "Content-Type: application/json"
Response
{
    "object": "page",
    "data": [
        {
            "object": "bucket",
            "start_time": 1730419200,
            "end_time": 1730505600,
            "results": [
                {
                    "object": "organization.usage.audio_speeches.result",
                    "characters": 45,
                    "num_model_requests": 1,
                    "project_id": null,
                    "user_id": null,
                    "api_key_id": null,
                    "model": null
                }
            ]
        }
    ],
    "has_more": false,
    "next_page": null
}
Audio speeches usage object
The aggregated audio speeches usage details of the specific time bucket.

api_key_id
string or null

When group_by=api_key_id, this field provides the API key ID of the grouped usage result.

characters
integer

The number of characters processed.

model
string or null

When group_by=model, this field provides the model name of the grouped usage result.

num_model_requests
integer

The count of requests made to the model.

object
string

project_id
string or null

When group_by=project_id, this field provides the project ID of the grouped usage result.

user_id
string or null

When group_by=user_id, this field provides the user ID of the grouped usage result.

OBJECT Audio speeches usage object
{
    "object": "organization.usage.audio_speeches.result",
    "characters": 45,
    "num_model_requests": 1,
    "project_id": "proj_abc",
    "user_id": "user-abc",
    "api_key_id": "key_abc",
    "model": "tts-1"
}
Audio transcriptions
get
 
https://api.openai.com/v1/organization/usage/audio_transcriptions
Get audio transcriptions usage details for the organization.

Query parameters
start_time
integer

Required
Start time (Unix seconds) of the query time range, inclusive.

api_key_ids
array

Optional
Return only usage for these API keys.

bucket_width
string

Optional
Defaults to 1d
Width of each time bucket in response. Currently 1m, 1h and 1d are supported, default to 1d.

end_time
integer

Optional
End time (Unix seconds) of the query time range, exclusive.

group_by
array

Optional
Group the usage data by the specified fields. Support fields include project_id, user_id, api_key_id, model or any combination of them.

limit
integer

Optional
Specifies the number of buckets to return.

bucket_width=1d: default: 7, max: 31
bucket_width=1h: default: 24, max: 168
bucket_width=1m: default: 60, max: 1440
models
array

Optional
Return only usage for these models.

page
string

Optional
A cursor for use in pagination. Corresponding to the next_page field from the previous response.

project_ids
array

Optional
Return only usage for these projects.

user_ids
array

Optional
Return only usage for these users.

Returns
A list of paginated, time bucketed Audio transcriptions usage objects.

Example request
curl "https://api.openai.com/v1/organization/usage/audio_transcriptions?start_time=1730419200&limit=1" \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
-H "Content-Type: application/json"
Response
{
    "object": "page",
    "data": [
        {
            "object": "bucket",
            "start_time": 1730419200,
            "end_time": 1730505600,
            "results": [
                {
                    "object": "organization.usage.audio_transcriptions.result",
                    "seconds": 20,
                    "num_model_requests": 1,
                    "project_id": null,
                    "user_id": null,
                    "api_key_id": null,
                    "model": null
                }
            ]
        }
    ],
    "has_more": false,
    "next_page": null
}
Audio transcriptions usage object
The aggregated audio transcriptions usage details of the specific time bucket.

api_key_id
string or null

When group_by=api_key_id, this field provides the API key ID of the grouped usage result.

model
string or null

When group_by=model, this field provides the model name of the grouped usage result.

num_model_requests
integer

The count of requests made to the model.

object
string

project_id
string or null

When group_by=project_id, this field provides the project ID of the grouped usage result.

seconds
integer

The number of seconds processed.

user_id
string or null

When group_by=user_id, this field provides the user ID of the grouped usage result.

OBJECT Audio transcriptions usage object
{
    "object": "organization.usage.audio_transcriptions.result",
    "seconds": 10,
    "num_model_requests": 1,
    "project_id": "proj_abc",
    "user_id": "user-abc",
    "api_key_id": "key_abc",
    "model": "tts-1"
}
Vector stores
get
 
https://api.openai.com/v1/organization/usage/vector_stores
Get vector stores usage details for the organization.

Query parameters
start_time
integer

Required
Start time (Unix seconds) of the query time range, inclusive.

bucket_width
string

Optional
Defaults to 1d
Width of each time bucket in response. Currently 1m, 1h and 1d are supported, default to 1d.

end_time
integer

Optional
End time (Unix seconds) of the query time range, exclusive.

group_by
array

Optional
Group the usage data by the specified fields. Support fields include project_id.

limit
integer

Optional
Specifies the number of buckets to return.

bucket_width=1d: default: 7, max: 31
bucket_width=1h: default: 24, max: 168
bucket_width=1m: default: 60, max: 1440
page
string

Optional
A cursor for use in pagination. Corresponding to the next_page field from the previous response.

project_ids
array

Optional
Return only usage for these projects.

Returns
A list of paginated, time bucketed Vector stores usage objects.

Example request
curl "https://api.openai.com/v1/organization/usage/vector_stores?start_time=1730419200&limit=1" \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
-H "Content-Type: application/json"
Response
{
    "object": "page",
    "data": [
        {
            "object": "bucket",
            "start_time": 1730419200,
            "end_time": 1730505600,
            "results": [
                {
                    "object": "organization.usage.vector_stores.result",
                    "usage_bytes": 1024,
                    "project_id": null
                }
            ]
        }
    ],
    "has_more": false,
    "next_page": null
}
Vector stores usage object
The aggregated vector stores usage details of the specific time bucket.

object
string

project_id
string or null

When group_by=project_id, this field provides the project ID of the grouped usage result.

usage_bytes
integer

The vector stores usage in bytes.

OBJECT Vector stores usage object
{
    "object": "organization.usage.vector_stores.result",
    "usage_bytes": 1024,
    "project_id": "proj_abc"
}
Code interpreter sessions
get
 
https://api.openai.com/v1/organization/usage/code_interpreter_sessions
Get code interpreter sessions usage details for the organization.

Query parameters
start_time
integer

Required
Start time (Unix seconds) of the query time range, inclusive.

bucket_width
string

Optional
Defaults to 1d
Width of each time bucket in response. Currently 1m, 1h and 1d are supported, default to 1d.

end_time
integer

Optional
End time (Unix seconds) of the query time range, exclusive.

group_by
array

Optional
Group the usage data by the specified fields. Support fields include project_id.

limit
integer

Optional
Specifies the number of buckets to return.

bucket_width=1d: default: 7, max: 31
bucket_width=1h: default: 24, max: 168
bucket_width=1m: default: 60, max: 1440
page
string

Optional
A cursor for use in pagination. Corresponding to the next_page field from the previous response.

project_ids
array

Optional
Return only usage for these projects.

Returns
A list of paginated, time bucketed Code interpreter sessions usage objects.

Example request
curl "https://api.openai.com/v1/organization/usage/code_interpreter_sessions?start_time=1730419200&limit=1" \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
-H "Content-Type: application/json"
Response
{
    "object": "page",
    "data": [
        {
            "object": "bucket",
            "start_time": 1730419200,
            "end_time": 1730505600,
            "results": [
                {
                    "object": "organization.usage.code_interpreter_sessions.result",
                    "num_sessions": 1,
                    "project_id": null
                }
            ]
        }
    ],
    "has_more": false,
    "next_page": null
}
Code interpreter sessions usage object
The aggregated code interpreter sessions usage details of the specific time bucket.

num_sessions
integer

The number of code interpreter sessions.

object
string

project_id
string or null

When group_by=project_id, this field provides the project ID of the grouped usage result.

OBJECT Code interpreter sessions usage object
{
    "object": "organization.usage.code_interpreter_sessions.result",
    "num_sessions": 1,
    "project_id": "proj_abc"
}
Costs
get
 
https://api.openai.com/v1/organization/costs
Get costs details for the organization.

Query parameters
start_time
integer

Required
Start time (Unix seconds) of the query time range, inclusive.

bucket_width
string

Optional
Defaults to 1d
Width of each time bucket in response. Currently only 1d is supported, default to 1d.

end_time
integer

Optional
End time (Unix seconds) of the query time range, exclusive.

group_by
array

Optional
Group the costs by the specified fields. Support fields include project_id, line_item and any combination of them.

limit
integer

Optional
Defaults to 7
A limit on the number of buckets to be returned. Limit can range between 1 and 180, and the default is 7.

page
string

Optional
A cursor for use in pagination. Corresponding to the next_page field from the previous response.

project_ids
array

Optional
Return only costs for these projects.

Returns
A list of paginated, time bucketed Costs objects.

Example request
curl "https://api.openai.com/v1/organization/costs?start_time=1730419200&limit=1" \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
-H "Content-Type: application/json"
Response
{
    "object": "page",
    "data": [
        {
            "object": "bucket",
            "start_time": 1730419200,
            "end_time": 1730505600,
            "results": [
                {
                    "object": "organization.costs.result",
                    "amount": {
                        "value": 0.06,
                        "currency": "usd"
                    },
                    "line_item": null,
                    "project_id": null
                }
            ]
        }
    ],
    "has_more": false,
    "next_page": null
}
Costs object
The aggregated costs details of the specific time bucket.

amount
object

The monetary value in its associated currency.


Show properties
line_item
string or null

When group_by=line_item, this field provides the line item of the grouped costs result.

object
string

project_id
string or null

When group_by=project_id, this field provides the project ID of the grouped costs result.

OBJECT Costs object
{
    "object": "organization.costs.result",
    "amount": {
      "value": 0.06,
      "currency": "usd"
    },
    "line_item": "Image models",
    "project_id": "proj_abc"
}
Assistants
Beta
Build assistants that can call models and use tools to perform tasks.

Get started with the Assistants API

Create assistant
Beta
post
 
https://api.openai.com/v1/assistants
Create an assistant with a model and instructions.

Request body
model
string

Required
ID of the model to use. You can use the List models API to see all of your available models, or see our Model overview for descriptions of them.

description
string or null

Optional
The description of the assistant. The maximum length is 512 characters.

instructions
string or null

Optional
The system instructions that the assistant uses. The maximum length is 256,000 characters.

metadata
map

Optional
Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format, and querying for objects via API or the dashboard.

Keys are strings with a maximum length of 64 characters. Values are strings with a maximum length of 512 characters.

name
string or null

Optional
The name of the assistant. The maximum length is 256 characters.

reasoning_effort
string or null

Optional
Defaults to medium
o-series models only

Constrains effort on reasoning for reasoning models. Currently supported values are low, medium, and high. Reducing reasoning effort can result in faster responses and fewer tokens used on reasoning in a response.

response_format
"auto" or object

Optional
Specifies the format that the model must output. Compatible with GPT-4o, GPT-4 Turbo, and all GPT-3.5 Turbo models since gpt-3.5-turbo-1106.

Setting to { "type": "json_schema", "json_schema": {...} } enables Structured Outputs which ensures the model will match your supplied JSON schema. Learn more in the Structured Outputs guide.

Setting to { "type": "json_object" } enables JSON mode, which ensures the message the model generates is valid JSON.

Important: when using JSON mode, you must also instruct the model to produce JSON yourself via a system or user message. Without this, the model may generate an unending stream of whitespace until the generation reaches the token limit, resulting in a long-running and seemingly "stuck" request. Also note that the message content may be partially cut off if finish_reason="length", which indicates the generation exceeded max_tokens or the conversation exceeded the max context length.


Show possible types
temperature
number or null

Optional
Defaults to 1
What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.

tool_resources
object or null

Optional
A set of resources that are used by the assistant's tools. The resources are specific to the type of tool. For example, the code_interpreter tool requires a list of file IDs, while the file_search tool requires a list of vector store IDs.


Show properties
tools
array

Optional
Defaults to []
A list of tool enabled on the assistant. There can be a maximum of 128 tools per assistant. Tools can be of types code_interpreter, file_search, or function.


Show possible types
top_p
number or null

Optional
Defaults to 1
An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.

We generally recommend altering this or temperature but not both.

Returns
An assistant object.


Code Interpreter

Files
Example request
curl "https://api.openai.com/v1/assistants" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
    "instructions": "You are a personal math tutor. When asked a question, write and run Python code to answer the question.",
    "name": "Math Tutor",
    "tools": [{"type": "code_interpreter"}],
    "model": "gpt-4o"
  }'
Response
{
  "id": "asst_abc123",
  "object": "assistant",
  "created_at": 1698984975,
  "name": "Math Tutor",
  "description": null,
  "model": "gpt-4o",
  "instructions": "You are a personal math tutor. When asked a question, write and run Python code to answer the question.",
  "tools": [
    {
      "type": "code_interpreter"
    }
  ],
  "metadata": {},
  "top_p": 1.0,
  "temperature": 1.0,
  "response_format": "auto"
}
List assistants
Beta
get
 
https://api.openai.com/v1/assistants
Returns a list of assistants.

Query parameters
after
string

Optional
A cursor for use in pagination. after is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

before
string

Optional
A cursor for use in pagination. before is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, starting with obj_foo, your subsequent call can include before=obj_foo in order to fetch the previous page of the list.

limit
integer

Optional
Defaults to 20
A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

order
string

Optional
Defaults to desc
Sort order by the created_at timestamp of the objects. asc for ascending order and desc for descending order.

Returns
A list of assistant objects.

Example request
curl "https://api.openai.com/v1/assistants?order=desc&limit=20" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2"
Response
{
  "object": "list",
  "data": [
    {
      "id": "asst_abc123",
      "object": "assistant",
      "created_at": 1698982736,
      "name": "Coding Tutor",
      "description": null,
      "model": "gpt-4o",
      "instructions": "You are a helpful assistant designed to make me better at coding!",
      "tools": [],
      "tool_resources": {},
      "metadata": {},
      "top_p": 1.0,
      "temperature": 1.0,
      "response_format": "auto"
    },
    {
      "id": "asst_abc456",
      "object": "assistant",
      "created_at": 1698982718,
      "name": "My Assistant",
      "description": null,
      "model": "gpt-4o",
      "instructions": "You are a helpful assistant designed to make me better at coding!",
      "tools": [],
      "tool_resources": {},
      "metadata": {},
      "top_p": 1.0,
      "temperature": 1.0,
      "response_format": "auto"
    },
    {
      "id": "asst_abc789",
      "object": "assistant",
      "created_at": 1698982643,
      "name": null,
      "description": null,
      "model": "gpt-4o",
      "instructions": null,
      "tools": [],
      "tool_resources": {},
      "metadata": {},
      "top_p": 1.0,
      "temperature": 1.0,
      "response_format": "auto"
    }
  ],
  "first_id": "asst_abc123",
  "last_id": "asst_abc789",
  "has_more": false
}
Retrieve assistant
Beta
get
 
https://api.openai.com/v1/assistants/{assistant_id}
Retrieves an assistant.

Path parameters
assistant_id
string

Required
The ID of the assistant to retrieve.

Returns
The assistant object matching the specified ID.

Example request
curl https://api.openai.com/v1/assistants/asst_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2"
Response
{
  "id": "asst_abc123",
  "object": "assistant",
  "created_at": 1699009709,
  "name": "HR Helper",
  "description": null,
  "model": "gpt-4o",
  "instructions": "You are an HR bot, and you have access to files to answer employee questions about company policies.",
  "tools": [
    {
      "type": "file_search"
    }
  ],
  "metadata": {},
  "top_p": 1.0,
  "temperature": 1.0,
  "response_format": "auto"
}
Modify assistant
Beta
post
 
https://api.openai.com/v1/assistants/{assistant_id}
Modifies an assistant.

Path parameters
assistant_id
string

Required
The ID of the assistant to modify.

Request body
description
string or null

Optional
The description of the assistant. The maximum length is 512 characters.

instructions
string or null

Optional
The system instructions that the assistant uses. The maximum length is 256,000 characters.

metadata
map

Optional
Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format, and querying for objects via API or the dashboard.

Keys are strings with a maximum length of 64 characters. Values are strings with a maximum length of 512 characters.

model
string

Optional
ID of the model to use. You can use the List models API to see all of your available models, or see our Model overview for descriptions of them.

name
string or null

Optional
The name of the assistant. The maximum length is 256 characters.

reasoning_effort
string or null

Optional
Defaults to medium
o-series models only

Constrains effort on reasoning for reasoning models. Currently supported values are low, medium, and high. Reducing reasoning effort can result in faster responses and fewer tokens used on reasoning in a response.

response_format
"auto" or object

Optional
Specifies the format that the model must output. Compatible with GPT-4o, GPT-4 Turbo, and all GPT-3.5 Turbo models since gpt-3.5-turbo-1106.

Setting to { "type": "json_schema", "json_schema": {...} } enables Structured Outputs which ensures the model will match your supplied JSON schema. Learn more in the Structured Outputs guide.

Setting to { "type": "json_object" } enables JSON mode, which ensures the message the model generates is valid JSON.

Important: when using JSON mode, you must also instruct the model to produce JSON yourself via a system or user message. Without this, the model may generate an unending stream of whitespace until the generation reaches the token limit, resulting in a long-running and seemingly "stuck" request. Also note that the message content may be partially cut off if finish_reason="length", which indicates the generation exceeded max_tokens or the conversation exceeded the max context length.


Show possible types
temperature
number or null

Optional
Defaults to 1
What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.

tool_resources
object or null

Optional
A set of resources that are used by the assistant's tools. The resources are specific to the type of tool. For example, the code_interpreter tool requires a list of file IDs, while the file_search tool requires a list of vector store IDs.


Show properties
tools
array

Optional
Defaults to []
A list of tool enabled on the assistant. There can be a maximum of 128 tools per assistant. Tools can be of types code_interpreter, file_search, or function.


Show possible types
top_p
number or null

Optional
Defaults to 1
An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.

We generally recommend altering this or temperature but not both.

Returns
The modified assistant object.

Example request
curl https://api.openai.com/v1/assistants/asst_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
      "instructions": "You are an HR bot, and you have access to files to answer employee questions about company policies. Always response with info from either of the files.",
      "tools": [{"type": "file_search"}],
      "model": "gpt-4o"
    }'
Response
{
  "id": "asst_123",
  "object": "assistant",
  "created_at": 1699009709,
  "name": "HR Helper",
  "description": null,
  "model": "gpt-4o",
  "instructions": "You are an HR bot, and you have access to files to answer employee questions about company policies. Always response with info from either of the files.",
  "tools": [
    {
      "type": "file_search"
    }
  ],
  "tool_resources": {
    "file_search": {
      "vector_store_ids": []
    }
  },
  "metadata": {},
  "top_p": 1.0,
  "temperature": 1.0,
  "response_format": "auto"
}
Delete assistant
Beta
delete
 
https://api.openai.com/v1/assistants/{assistant_id}
Delete an assistant.

Path parameters
assistant_id
string

Required
The ID of the assistant to delete.

Returns
Deletion status

Example request
curl https://api.openai.com/v1/assistants/asst_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -X DELETE
Response
{
  "id": "asst_abc123",
  "object": "assistant.deleted",
  "deleted": true
}
The assistant object
Beta
Represents an assistant that can call the model and use tools.

created_at
integer

The Unix timestamp (in seconds) for when the assistant was created.

description
string or null

The description of the assistant. The maximum length is 512 characters.

id
string

The identifier, which can be referenced in API endpoints.

instructions
string or null

The system instructions that the assistant uses. The maximum length is 256,000 characters.

metadata
map

Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format, and querying for objects via API or the dashboard.

Keys are strings with a maximum length of 64 characters. Values are strings with a maximum length of 512 characters.

model
string

ID of the model to use. You can use the List models API to see all of your available models, or see our Model overview for descriptions of them.

name
string or null

The name of the assistant. The maximum length is 256 characters.

object
string

The object type, which is always assistant.

response_format
"auto" or object

Specifies the format that the model must output. Compatible with GPT-4o, GPT-4 Turbo, and all GPT-3.5 Turbo models since gpt-3.5-turbo-1106.

Setting to { "type": "json_schema", "json_schema": {...} } enables Structured Outputs which ensures the model will match your supplied JSON schema. Learn more in the Structured Outputs guide.

Setting to { "type": "json_object" } enables JSON mode, which ensures the message the model generates is valid JSON.

Important: when using JSON mode, you must also instruct the model to produce JSON yourself via a system or user message. Without this, the model may generate an unending stream of whitespace until the generation reaches the token limit, resulting in a long-running and seemingly "stuck" request. Also note that the message content may be partially cut off if finish_reason="length", which indicates the generation exceeded max_tokens or the conversation exceeded the max context length.


Show possible types
temperature
number or null

What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.

tool_resources
object or null

A set of resources that are used by the assistant's tools. The resources are specific to the type of tool. For example, the code_interpreter tool requires a list of file IDs, while the file_search tool requires a list of vector store IDs.


Show properties
tools
array

A list of tool enabled on the assistant. There can be a maximum of 128 tools per assistant. Tools can be of types code_interpreter, file_search, or function.


Show possible types
top_p
number or null

An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.

We generally recommend altering this or temperature but not both.

OBJECT The assistant object
{
  "id": "asst_abc123",
  "object": "assistant",
  "created_at": 1698984975,
  "name": "Math Tutor",
  "description": null,
  "model": "gpt-4o",
  "instructions": "You are a personal math tutor. When asked a question, write and run Python code to answer the question.",
  "tools": [
    {
      "type": "code_interpreter"
    }
  ],
  "metadata": {},
  "top_p": 1.0,
  "temperature": 1.0,
  "response_format": "auto"
}
Threads
Beta
Create threads that assistants can interact with.

Related guide: Assistants

Create thread
Beta
post
 
https://api.openai.com/v1/threads
Create a thread.

Request body
messages
array

Optional
A list of messages to start the thread with.


Show properties
metadata
map

Optional
Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format, and querying for objects via API or the dashboard.

Keys are strings with a maximum length of 64 characters. Values are strings with a maximum length of 512 characters.

tool_resources
object or null

Optional
A set of resources that are made available to the assistant's tools in this thread. The resources are specific to the type of tool. For example, the code_interpreter tool requires a list of file IDs, while the file_search tool requires a list of vector store IDs.


Show properties
Returns
A thread object.


Empty

Messages
Example request
curl https://api.openai.com/v1/threads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -d ''
Response
{
  "id": "thread_abc123",
  "object": "thread",
  "created_at": 1699012949,
  "metadata": {},
  "tool_resources": {}
}
Retrieve thread
Beta
get
 
https://api.openai.com/v1/threads/{thread_id}
Retrieves a thread.

Path parameters
thread_id
string

Required
The ID of the thread to retrieve.

Returns
The thread object matching the specified ID.

Example request
curl https://api.openai.com/v1/threads/thread_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2"
Response
{
  "id": "thread_abc123",
  "object": "thread",
  "created_at": 1699014083,
  "metadata": {},
  "tool_resources": {
    "code_interpreter": {
      "file_ids": []
    }
  }
}
Modify thread
Beta
post
 
https://api.openai.com/v1/threads/{thread_id}
Modifies a thread.

Path parameters
thread_id
string

Required
The ID of the thread to modify. Only the metadata can be modified.

Request body
metadata
map

Optional
Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format, and querying for objects via API or the dashboard.

Keys are strings with a maximum length of 64 characters. Values are strings with a maximum length of 512 characters.

tool_resources
object or null

Optional
A set of resources that are made available to the assistant's tools in this thread. The resources are specific to the type of tool. For example, the code_interpreter tool requires a list of file IDs, while the file_search tool requires a list of vector store IDs.


Show properties
Returns
The modified thread object matching the specified ID.

Example request
curl https://api.openai.com/v1/threads/thread_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
      "metadata": {
        "modified": "true",
        "user": "abc123"
      }
    }'
Response
{
  "id": "thread_abc123",
  "object": "thread",
  "created_at": 1699014083,
  "metadata": {
    "modified": "true",
    "user": "abc123"
  },
  "tool_resources": {}
}
Delete thread
Beta
delete
 
https://api.openai.com/v1/threads/{thread_id}
Delete a thread.

Path parameters
thread_id
string

Required
The ID of the thread to delete.

Returns
Deletion status

Example request
curl https://api.openai.com/v1/threads/thread_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -X DELETE
Response
{
  "id": "thread_abc123",
  "object": "thread.deleted",
  "deleted": true
}
The thread object
Beta
Represents a thread that contains messages.

created_at
integer

The Unix timestamp (in seconds) for when the thread was created.

id
string

The identifier, which can be referenced in API endpoints.

metadata
map

Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format, and querying for objects via API or the dashboard.

Keys are strings with a maximum length of 64 characters. Values are strings with a maximum length of 512 characters.

object
string

The object type, which is always thread.

tool_resources
object or null

A set of resources that are made available to the assistant's tools in this thread. The resources are specific to the type of tool. For example, the code_interpreter tool requires a list of file IDs, while the file_search tool requires a list of vector store IDs.


Show properties
OBJECT The thread object
{
  "id": "thread_abc123",
  "object": "thread",
  "created_at": 1698107661,
  "metadata": {}
}
Messages
Beta
Create messages within threads

Related guide: Assistants

Create message
Beta
post
 
https://api.openai.com/v1/threads/{thread_id}/messages
Create a message.

Path parameters
thread_id
string

Required
The ID of the thread to create a message for.

Request body
content
string or array

Required

Show possible types
role
string

Required
The role of the entity that is creating the message. Allowed values include:

user: Indicates the message is sent by an actual user and should be used in most cases to represent user-generated messages.
assistant: Indicates the message is generated by the assistant. Use this value to insert messages from the assistant into the conversation.
attachments
array or null

Optional
A list of files attached to the message, and the tools they should be added to.


Show properties
metadata
map

Optional
Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format, and querying for objects via API or the dashboard.

Keys are strings with a maximum length of 64 characters. Values are strings with a maximum length of 512 characters.

Returns
A message object.

Example request
curl https://api.openai.com/v1/threads/thread_abc123/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
      "role": "user",
      "content": "How does AI work? Explain it in simple terms."
    }'
Response
{
  "id": "msg_abc123",
  "object": "thread.message",
  "created_at": 1713226573,
  "assistant_id": null,
  "thread_id": "thread_abc123",
  "run_id": null,
  "role": "user",
  "content": [
    {
      "type": "text",
      "text": {
        "value": "How does AI work? Explain it in simple terms.",
        "annotations": []
      }
    }
  ],
  "attachments": [],
  "metadata": {}
}
List messages
Beta
get
 
https://api.openai.com/v1/threads/{thread_id}/messages
Returns a list of messages for a given thread.

Path parameters
thread_id
string

Required
The ID of the thread the messages belong to.

Query parameters
after
string

Optional
A cursor for use in pagination. after is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

before
string

Optional
A cursor for use in pagination. before is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, starting with obj_foo, your subsequent call can include before=obj_foo in order to fetch the previous page of the list.

limit
integer

Optional
Defaults to 20
A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

order
string

Optional
Defaults to desc
Sort order by the created_at timestamp of the objects. asc for ascending order and desc for descending order.

run_id
string

Optional
Filter messages by the run ID that generated them.

Returns
A list of message objects.

Example request
curl https://api.openai.com/v1/threads/thread_abc123/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2"
Response
{
  "object": "list",
  "data": [
    {
      "id": "msg_abc123",
      "object": "thread.message",
      "created_at": 1699016383,
      "assistant_id": null,
      "thread_id": "thread_abc123",
      "run_id": null,
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": {
            "value": "How does AI work? Explain it in simple terms.",
            "annotations": []
          }
        }
      ],
      "attachments": [],
      "metadata": {}
    },
    {
      "id": "msg_abc456",
      "object": "thread.message",
      "created_at": 1699016383,
      "assistant_id": null,
      "thread_id": "thread_abc123",
      "run_id": null,
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": {
            "value": "Hello, what is AI?",
            "annotations": []
          }
        }
      ],
      "attachments": [],
      "metadata": {}
    }
  ],
  "first_id": "msg_abc123",
  "last_id": "msg_abc456",
  "has_more": false
}
Retrieve message
Beta
get
 
https://api.openai.com/v1/threads/{thread_id}/messages/{message_id}
Retrieve a message.

Path parameters
message_id
string

Required
The ID of the message to retrieve.

thread_id
string

Required
The ID of the thread to which this message belongs.

Returns
The message object matching the specified ID.

Example request
curl https://api.openai.com/v1/threads/thread_abc123/messages/msg_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2"
Response
{
  "id": "msg_abc123",
  "object": "thread.message",
  "created_at": 1699017614,
  "assistant_id": null,
  "thread_id": "thread_abc123",
  "run_id": null,
  "role": "user",
  "content": [
    {
      "type": "text",
      "text": {
        "value": "How does AI work? Explain it in simple terms.",
        "annotations": []
      }
    }
  ],
  "attachments": [],
  "metadata": {}
}
Modify message
Beta
post
 
https://api.openai.com/v1/threads/{thread_id}/messages/{message_id}
Modifies a message.

Path parameters
message_id
string

Required
The ID of the message to modify.

thread_id
string

Required
The ID of the thread to which this message belongs.

Request body
metadata
map

Optional
Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format, and querying for objects via API or the dashboard.

Keys are strings with a maximum length of 64 characters. Values are strings with a maximum length of 512 characters.

Returns
The modified message object.

Example request
curl https://api.openai.com/v1/threads/thread_abc123/messages/msg_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
      "metadata": {
        "modified": "true",
        "user": "abc123"
      }
    }'
Response
{
  "id": "msg_abc123",
  "object": "thread.message",
  "created_at": 1699017614,
  "assistant_id": null,
  "thread_id": "thread_abc123",
  "run_id": null,
  "role": "user",
  "content": [
    {
      "type": "text",
      "text": {
        "value": "How does AI work? Explain it in simple terms.",
        "annotations": []
      }
    }
  ],
  "file_ids": [],
  "metadata": {
    "modified": "true",
    "user": "abc123"
  }
}
Delete message
Beta
delete
 
https://api.openai.com/v1/threads/{thread_id}/messages/{message_id}
Deletes a message.

Path parameters
message_id
string

Required
The ID of the message to delete.

thread_id
string

Required
The ID of the thread to which this message belongs.

Returns
Deletion status

Example request
curl -X DELETE https://api.openai.com/v1/threads/thread_abc123/messages/msg_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2"
Response
{
  "id": "msg_abc123",
  "object": "thread.message.deleted",
  "deleted": true
}
The message object
Beta
Represents a message within a thread.

assistant_id
string or null

If applicable, the ID of the assistant that authored this message.

attachments
array or null

A list of files attached to the message, and the tools they were added to.


Show properties
completed_at
integer or null

The Unix timestamp (in seconds) for when the message was completed.

content
array

The content of the message in array of text and/or images.


Show possible types
created_at
integer

The Unix timestamp (in seconds) for when the message was created.

id
string

The identifier, which can be referenced in API endpoints.

incomplete_at
integer or null

The Unix timestamp (in seconds) for when the message was marked as incomplete.

incomplete_details
object or null

On an incomplete message, details about why the message is incomplete.


Show properties
metadata
map

Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format, and querying for objects via API or the dashboard.

Keys are strings with a maximum length of 64 characters. Values are strings with a maximum length of 512 characters.

object
string

The object type, which is always thread.message.

role
string

The entity that produced the message. One of user or assistant.

run_id
string or null

The ID of the run associated with the creation of this message. Value is null when messages are created manually using the create message or create thread endpoints.

status
string

The status of the message, which can be either in_progress, incomplete, or completed.

thread_id
string

The thread ID that this message belongs to.

OBJECT The message object
{
  "id": "msg_abc123",
  "object": "thread.message",
  "created_at": 1698983503,
  "thread_id": "thread_abc123",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": {
        "value": "Hi! How can I help you today?",
        "annotations": []
      }
    }
  ],
  "assistant_id": "asst_abc123",
  "run_id": "run_abc123",
  "attachments": [],
  "metadata": {}
}
Runs
Beta
Represents an execution run on a thread.

Related guide: Assistants

Create run
Beta
post
 
https://api.openai.com/v1/threads/{thread_id}/runs
Create a run.

Path parameters
thread_id
string

Required
The ID of the thread to run.

Query parameters
include[]
array

Optional
A list of additional fields to include in the response. Currently the only supported value is step_details.tool_calls[*].file_search.results[*].content to fetch the file search result content.

See the file search tool documentation for more information.

Request body
assistant_id
string

Required
The ID of the assistant to use to execute this run.

additional_instructions
string or null

Optional
Appends additional instructions at the end of the instructions for the run. This is useful for modifying the behavior on a per-run basis without overriding other instructions.

additional_messages
array or null

Optional
Adds additional messages to the thread before creating the run.


Show properties
instructions
string or null

Optional
Overrides the instructions of the assistant. This is useful for modifying the behavior on a per-run basis.

max_completion_tokens
integer or null

Optional
The maximum number of completion tokens that may be used over the course of the run. The run will make a best effort to use only the number of completion tokens specified, across multiple turns of the run. If the run exceeds the number of completion tokens specified, the run will end with status incomplete. See incomplete_details for more info.

max_prompt_tokens
integer or null

Optional
The maximum number of prompt tokens that may be used over the course of the run. The run will make a best effort to use only the number of prompt tokens specified, across multiple turns of the run. If the run exceeds the number of prompt tokens specified, the run will end with status incomplete. See incomplete_details for more info.

metadata
map

Optional
Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format, and querying for objects via API or the dashboard.

Keys are strings with a maximum length of 64 characters. Values are strings with a maximum length of 512 characters.

model
string

Optional
The ID of the Model to be used to execute this run. If a value is provided here, it will override the model associated with the assistant. If not, the model associated with the assistant will be used.

parallel_tool_calls
boolean

Optional
Defaults to true
Whether to enable parallel function calling during tool use.

reasoning_effort
string or null

Optional
Defaults to medium
o-series models only

Constrains effort on reasoning for reasoning models. Currently supported values are low, medium, and high. Reducing reasoning effort can result in faster responses and fewer tokens used on reasoning in a response.

response_format
"auto" or object

Optional
Specifies the format that the model must output. Compatible with GPT-4o, GPT-4 Turbo, and all GPT-3.5 Turbo models since gpt-3.5-turbo-1106.

Setting to { "type": "json_schema", "json_schema": {...} } enables Structured Outputs which ensures the model will match your supplied JSON schema. Learn more in the Structured Outputs guide.

Setting to { "type": "json_object" } enables JSON mode, which ensures the message the model generates is valid JSON.

Important: when using JSON mode, you must also instruct the model to produce JSON yourself via a system or user message. Without this, the model may generate an unending stream of whitespace until the generation reaches the token limit, resulting in a long-running and seemingly "stuck" request. Also note that the message content may be partially cut off if finish_reason="length", which indicates the generation exceeded max_tokens or the conversation exceeded the max context length.


Show possible types
stream
boolean or null

Optional
If true, returns a stream of events that happen during the Run as server-sent events, terminating when the Run enters a terminal state with a data: [DONE] message.

temperature
number or null

Optional
Defaults to 1
What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.

tool_choice
string or object

Optional
Controls which (if any) tool is called by the model. none means the model will not call any tools and instead generates a message. auto is the default value and means the model can pick between generating a message or calling one or more tools. required means the model must call one or more tools before responding to the user. Specifying a particular tool like {"type": "file_search"} or {"type": "function", "function": {"name": "my_function"}} forces the model to call that tool.


Show possible types
tools
array or null

Optional
Override the tools the assistant can use for this run. This is useful for modifying the behavior on a per-run basis.


Show possible types
top_p
number or null

Optional
Defaults to 1
An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.

We generally recommend altering this or temperature but not both.

truncation_strategy
object or null

Optional
Controls for how a thread will be truncated prior to the run. Use this to control the intial context window of the run.


Show properties
Returns
A run object.


Default

Streaming

Streaming with Functions
Example request
curl https://api.openai.com/v1/threads/thread_abc123/runs \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
    "assistant_id": "asst_abc123"
  }'
Response
{
  "id": "run_abc123",
  "object": "thread.run",
  "created_at": 1699063290,
  "assistant_id": "asst_abc123",
  "thread_id": "thread_abc123",
  "status": "queued",
  "started_at": 1699063290,
  "expires_at": null,
  "cancelled_at": null,
  "failed_at": null,
  "completed_at": 1699063291,
  "last_error": null,
  "model": "gpt-4o",
  "instructions": null,
  "incomplete_details": null,
  "tools": [
    {
      "type": "code_interpreter"
    }
  ],
  "metadata": {},
  "usage": null,
  "temperature": 1.0,
  "top_p": 1.0,
  "max_prompt_tokens": 1000,
  "max_completion_tokens": 1000,
  "truncation_strategy": {
    "type": "auto",
    "last_messages": null
  },
  "response_format": "auto",
  "tool_choice": "auto",
  "parallel_tool_calls": true
}
Create thread and run
Beta
post
 
https://api.openai.com/v1/threads/runs
Create a thread and run it in one request.

Request body
assistant_id
string

Required
The ID of the assistant to use to execute this run.

instructions
string or null

Optional
Override the default system message of the assistant. This is useful for modifying the behavior on a per-run basis.

max_completion_tokens
integer or null

Optional
The maximum number of completion tokens that may be used over the course of the run. The run will make a best effort to use only the number of completion tokens specified, across multiple turns of the run. If the run exceeds the number of completion tokens specified, the run will end with status incomplete. See incomplete_details for more info.

max_prompt_tokens
integer or null

Optional
The maximum number of prompt tokens that may be used over the course of the run. The run will make a best effort to use only the number of prompt tokens specified, across multiple turns of the run. If the run exceeds the number of prompt tokens specified, the run will end with status incomplete. See incomplete_details for more info.

metadata
map

Optional
Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format, and querying for objects via API or the dashboard.

Keys are strings with a maximum length of 64 characters. Values are strings with a maximum length of 512 characters.

model
string

Optional
The ID of the Model to be used to execute this run. If a value is provided here, it will override the model associated with the assistant. If not, the model associated with the assistant will be used.

parallel_tool_calls
boolean

Optional
Defaults to true
Whether to enable parallel function calling during tool use.

response_format
"auto" or object

Optional
Specifies the format that the model must output. Compatible with GPT-4o, GPT-4 Turbo, and all GPT-3.5 Turbo models since gpt-3.5-turbo-1106.

Setting to { "type": "json_schema", "json_schema": {...} } enables Structured Outputs which ensures the model will match your supplied JSON schema. Learn more in the Structured Outputs guide.

Setting to { "type": "json_object" } enables JSON mode, which ensures the message the model generates is valid JSON.

Important: when using JSON mode, you must also instruct the model to produce JSON yourself via a system or user message. Without this, the model may generate an unending stream of whitespace until the generation reaches the token limit, resulting in a long-running and seemingly "stuck" request. Also note that the message content may be partially cut off if finish_reason="length", which indicates the generation exceeded max_tokens or the conversation exceeded the max context length.


Show possible types
stream
boolean or null

Optional
If true, returns a stream of events that happen during the Run as server-sent events, terminating when the Run enters a terminal state with a data: [DONE] message.

temperature
number or null

Optional
Defaults to 1
What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.

thread
object

Optional
Options to create a new thread. If no thread is provided when running a request, an empty thread will be created.


Show properties
tool_choice
string or object

Optional
Controls which (if any) tool is called by the model. none means the model will not call any tools and instead generates a message. auto is the default value and means the model can pick between generating a message or calling one or more tools. required means the model must call one or more tools before responding to the user. Specifying a particular tool like {"type": "file_search"} or {"type": "function", "function": {"name": "my_function"}} forces the model to call that tool.


Show possible types
tool_resources
object or null

Optional
A set of resources that are used by the assistant's tools. The resources are specific to the type of tool. For example, the code_interpreter tool requires a list of file IDs, while the file_search tool requires a list of vector store IDs.


Show properties
tools
array or null

Optional
Override the tools the assistant can use for this run. This is useful for modifying the behavior on a per-run basis.

top_p
number or null

Optional
Defaults to 1
An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.

We generally recommend altering this or temperature but not both.

truncation_strategy
object or null

Optional
Controls for how a thread will be truncated prior to the run. Use this to control the intial context window of the run.


Show properties
Returns
A run object.


Default

Streaming

Streaming with Functions
Example request
curl https://api.openai.com/v1/threads/runs \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
      "assistant_id": "asst_abc123",
      "thread": {
        "messages": [
          {"role": "user", "content": "Explain deep learning to a 5 year old."}
        ]
      }
    }'
Response
{
  "id": "run_abc123",
  "object": "thread.run",
  "created_at": 1699076792,
  "assistant_id": "asst_abc123",
  "thread_id": "thread_abc123",
  "status": "queued",
  "started_at": null,
  "expires_at": 1699077392,
  "cancelled_at": null,
  "failed_at": null,
  "completed_at": null,
  "required_action": null,
  "last_error": null,
  "model": "gpt-4o",
  "instructions": "You are a helpful assistant.",
  "tools": [],
  "tool_resources": {},
  "metadata": {},
  "temperature": 1.0,
  "top_p": 1.0,
  "max_completion_tokens": null,
  "max_prompt_tokens": null,
  "truncation_strategy": {
    "type": "auto",
    "last_messages": null
  },
  "incomplete_details": null,
  "usage": null,
  "response_format": "auto",
  "tool_choice": "auto",
  "parallel_tool_calls": true
}
List runs
Beta
get
 
https://api.openai.com/v1/threads/{thread_id}/runs
Returns a list of runs belonging to a thread.

Path parameters
thread_id
string

Required
The ID of the thread the run belongs to.

Query parameters
after
string

Optional
A cursor for use in pagination. after is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

before
string

Optional
A cursor for use in pagination. before is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, starting with obj_foo, your subsequent call can include before=obj_foo in order to fetch the previous page of the list.

limit
integer

Optional
Defaults to 20
A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

order
string

Optional
Defaults to desc
Sort order by the created_at timestamp of the objects. asc for ascending order and desc for descending order.

Returns
A list of run objects.

Example request
curl https://api.openai.com/v1/threads/thread_abc123/runs \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2"
Response
{
  "object": "list",
  "data": [
    {
      "id": "run_abc123",
      "object": "thread.run",
      "created_at": 1699075072,
      "assistant_id": "asst_abc123",
      "thread_id": "thread_abc123",
      "status": "completed",
      "started_at": 1699075072,
      "expires_at": null,
      "cancelled_at": null,
      "failed_at": null,
      "completed_at": 1699075073,
      "last_error": null,
      "model": "gpt-4o",
      "instructions": null,
      "incomplete_details": null,
      "tools": [
        {
          "type": "code_interpreter"
        }
      ],
      "tool_resources": {
        "code_interpreter": {
          "file_ids": [
            "file-abc123",
            "file-abc456"
          ]
        }
      },
      "metadata": {},
      "usage": {
        "prompt_tokens": 123,
        "completion_tokens": 456,
        "total_tokens": 579
      },
      "temperature": 1.0,
      "top_p": 1.0,
      "max_prompt_tokens": 1000,
      "max_completion_tokens": 1000,
      "truncation_strategy": {
        "type": "auto",
        "last_messages": null
      },
      "response_format": "auto",
      "tool_choice": "auto",
      "parallel_tool_calls": true
    },
    {
      "id": "run_abc456",
      "object": "thread.run",
      "created_at": 1699063290,
      "assistant_id": "asst_abc123",
      "thread_id": "thread_abc123",
      "status": "completed",
      "started_at": 1699063290,
      "expires_at": null,
      "cancelled_at": null,
      "failed_at": null,
      "completed_at": 1699063291,
      "last_error": null,
      "model": "gpt-4o",
      "instructions": null,
      "incomplete_details": null,
      "tools": [
        {
          "type": "code_interpreter"
        }
      ],
      "tool_resources": {
        "code_interpreter": {
          "file_ids": [
            "file-abc123",
            "file-abc456"
          ]
        }
      },
      "metadata": {},
      "usage": {
        "prompt_tokens": 123,
        "completion_tokens": 456,
        "total_tokens": 579
      },
      "temperature": 1.0,
      "top_p": 1.0,
      "max_prompt_tokens": 1000,
      "max_completion_tokens": 1000,
      "truncation_strategy": {
        "type": "auto",
        "last_messages": null
      },
      "response_format": "auto",
      "tool_choice": "auto",
      "parallel_tool_calls": true
    }
  ],
  "first_id": "run_abc123",
  "last_id": "run_abc456",
  "has_more": false
}
Retrieve run
Beta
get
 
https://api.openai.com/v1/threads/{thread_id}/runs/{run_id}
Retrieves a run.

Path parameters
run_id
string

Required
The ID of the run to retrieve.

thread_id
string

Required
The ID of the thread that was run.

Returns
The run object matching the specified ID.

Example request
curl https://api.openai.com/v1/threads/thread_abc123/runs/run_abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2"
Response
{
  "id": "run_abc123",
  "object": "thread.run",
  "created_at": 1699075072,
  "assistant_id": "asst_abc123",
  "thread_id": "thread_abc123",
  "status": "completed",
  "started_at": 1699075072,
  "expires_at": null,
  "cancelled_at": null,
  "failed_at": null,
  "completed_at": 1699075073,
  "last_error": null,
  "model": "gpt-4o",
  "instructions": null,
  "incomplete_details": null,
  "tools": [
    {
      "type": "code_interpreter"
    }
  ],
  "metadata": {},
  "usage": {
    "prompt_tokens": 123,
    "completion_tokens": 456,
    "total_tokens": 579
  },
  "temperature": 1.0,
  "top_p": 1.0,
  "max_prompt_tokens": 1000,
  "max_completion_tokens": 1000,
  "truncation_strategy": {
    "type": "auto",
    "last_messages": null
  },
  "response_format": "auto",
  "tool_choice": "auto",
  "parallel_tool_calls": true
}
Modify run
Beta
post
 
https://api.openai.com/v1/threads/{thread_id}/runs/{run_id}
Modifies a run.

Path parameters
run_id
string

Required
The ID of the run to modify.

thread_id
string

Required
The ID of the thread that was run.

Request body
metadata
map

Optional
Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format, and querying for objects via API or the dashboard.

Keys are strings with a maximum length of 64 characters. Values are strings with a maximum length of 512 characters.

Returns
The modified run object matching the specified ID.

Example request
curl https://api.openai.com/v1/threads/thread_abc123/runs/run_abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
    "metadata": {
      "user_id": "user_abc123"
    }
  }'
Response
{
  "id": "run_abc123",
  "object": "thread.run",
  "created_at": 1699075072,
  "assistant_id": "asst_abc123",
  "thread_id": "thread_abc123",
  "status": "completed",
  "started_at": 1699075072,
  "expires_at": null,
  "cancelled_at": null,
  "failed_at": null,
  "completed_at": 1699075073,
  "last_error": null,
  "model": "gpt-4o",
  "instructions": null,
  "incomplete_details": null,
  "tools": [
    {
      "type": "code_interpreter"
    }
  ],
  "tool_resources": {
    "code_interpreter": {
      "file_ids": [
        "file-abc123",
        "file-abc456"
      ]
    }
  },
  "metadata": {
    "user_id": "user_abc123"
  },
  "usage": {
    "prompt_tokens": 123,
    "completion_tokens": 456,
    "total_tokens": 579
  },
  "temperature": 1.0,
  "top_p": 1.0,
  "max_prompt_tokens": 1000,
  "max_completion_tokens": 1000,
  "truncation_strategy": {
    "type": "auto",
    "last_messages": null
  },
  "response_format": "auto",
  "tool_choice": "auto",
  "parallel_tool_calls": true
}
Submit tool outputs to run
Beta
post
 
https://api.openai.com/v1/threads/{thread_id}/runs/{run_id}/submit_tool_outputs
When a run has the status: "requires_action" and required_action.type is submit_tool_outputs, this endpoint can be used to submit the outputs from the tool calls once they're all completed. All outputs must be submitted in a single request.

Path parameters
run_id
string

Required
The ID of the run that requires the tool output submission.

thread_id
string

Required
The ID of the thread to which this run belongs.

Request body
tool_outputs
array

Required
A list of tools for which the outputs are being submitted.


Show properties
stream
boolean or null

Optional
If true, returns a stream of events that happen during the Run as server-sent events, terminating when the Run enters a terminal state with a data: [DONE] message.

Returns
The modified run object matching the specified ID.


Default

Streaming
Example request
curl https://api.openai.com/v1/threads/thread_123/runs/run_123/submit_tool_outputs \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
    "tool_outputs": [
      {
        "tool_call_id": "call_001",
        "output": "70 degrees and sunny."
      }
    ]
  }'
Response
{
  "id": "run_123",
  "object": "thread.run",
  "created_at": 1699075592,
  "assistant_id": "asst_123",
  "thread_id": "thread_123",
  "status": "queued",
  "started_at": 1699075592,
  "expires_at": 1699076192,
  "cancelled_at": null,
  "failed_at": null,
  "completed_at": null,
  "last_error": null,
  "model": "gpt-4o",
  "instructions": null,
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "get_current_weather",
        "description": "Get the current weather in a given location",
        "parameters": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "description": "The city and state, e.g. San Francisco, CA"
            },
            "unit": {
              "type": "string",
              "enum": ["celsius", "fahrenheit"]
            }
          },
          "required": ["location"]
        }
      }
    }
  ],
  "metadata": {},
  "usage": null,
  "temperature": 1.0,
  "top_p": 1.0,
  "max_prompt_tokens": 1000,
  "max_completion_tokens": 1000,
  "truncation_strategy": {
    "type": "auto",
    "last_messages": null
  },
  "response_format": "auto",
  "tool_choice": "auto",
  "parallel_tool_calls": true
}
Cancel a run
Beta
post
 
https://api.openai.com/v1/threads/{thread_id}/runs/{run_id}/cancel
Cancels a run that is in_progress.

Path parameters
run_id
string

Required
The ID of the run to cancel.

thread_id
string

Required
The ID of the thread to which this run belongs.

Returns
The modified run object matching the specified ID.

Example request
curl https://api.openai.com/v1/threads/thread_abc123/runs/run_abc123/cancel \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -X POST
Response
{
  "id": "run_abc123",
  "object": "thread.run",
  "created_at": 1699076126,
  "assistant_id": "asst_abc123",
  "thread_id": "thread_abc123",
  "status": "cancelling",
  "started_at": 1699076126,
  "expires_at": 1699076726,
  "cancelled_at": null,
  "failed_at": null,
  "completed_at": null,
  "last_error": null,
  "model": "gpt-4o",
  "instructions": "You summarize books.",
  "tools": [
    {
      "type": "file_search"
    }
  ],
  "tool_resources": {
    "file_search": {
      "vector_store_ids": ["vs_123"]
    }
  },
  "metadata": {},
  "usage": null,
  "temperature": 1.0,
  "top_p": 1.0,
  "response_format": "auto",
  "tool_choice": "auto",
  "parallel_tool_calls": true
}
The run object
Beta
Represents an execution run on a thread.

assistant_id
string

The ID of the assistant used for execution of this run.

cancelled_at
integer or null

The Unix timestamp (in seconds) for when the run was cancelled.

completed_at
integer or null

The Unix timestamp (in seconds) for when the run was completed.

created_at
integer

The Unix timestamp (in seconds) for when the run was created.

expires_at
integer or null

The Unix timestamp (in seconds) for when the run will expire.

failed_at
integer or null

The Unix timestamp (in seconds) for when the run failed.

id
string

The identifier, which can be referenced in API endpoints.

incomplete_details
object or null

Details on why the run is incomplete. Will be null if the run is not incomplete.


Show properties
instructions
string

The instructions that the assistant used for this run.

last_error
object or null

The last error associated with this run. Will be null if there are no errors.


Show properties
max_completion_tokens
integer or null

The maximum number of completion tokens specified to have been used over the course of the run.

max_prompt_tokens
integer or null

The maximum number of prompt tokens specified to have been used over the course of the run.

metadata
map

Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format, and querying for objects via API or the dashboard.

Keys are strings with a maximum length of 64 characters. Values are strings with a maximum length of 512 characters.

model
string

The model that the assistant used for this run.

object
string

The object type, which is always thread.run.

parallel_tool_calls
boolean

Whether to enable parallel function calling during tool use.

required_action
object or null

Details on the action required to continue the run. Will be null if no action is required.


Show properties
response_format
"auto" or object

Specifies the format that the model must output. Compatible with GPT-4o, GPT-4 Turbo, and all GPT-3.5 Turbo models since gpt-3.5-turbo-1106.

Setting to { "type": "json_schema", "json_schema": {...} } enables Structured Outputs which ensures the model will match your supplied JSON schema. Learn more in the Structured Outputs guide.

Setting to { "type": "json_object" } enables JSON mode, which ensures the message the model generates is valid JSON.

Important: when using JSON mode, you must also instruct the model to produce JSON yourself via a system or user message. Without this, the model may generate an unending stream of whitespace until the generation reaches the token limit, resulting in a long-running and seemingly "stuck" request. Also note that the message content may be partially cut off if finish_reason="length", which indicates the generation exceeded max_tokens or the conversation exceeded the max context length.


Show possible types
started_at
integer or null

The Unix timestamp (in seconds) for when the run was started.

status
string

The status of the run, which can be either queued, in_progress, requires_action, cancelling, cancelled, failed, completed, incomplete, or expired.

temperature
number or null

The sampling temperature used for this run. If not set, defaults to 1.

thread_id
string

The ID of the thread that was executed on as a part of this run.

tool_choice
string or object

Controls which (if any) tool is called by the model. none means the model will not call any tools and instead generates a message. auto is the default value and means the model can pick between generating a message or calling one or more tools. required means the model must call one or more tools before responding to the user. Specifying a particular tool like {"type": "file_search"} or {"type": "function", "function": {"name": "my_function"}} forces the model to call that tool.


Show possible types
tools
array

The list of tools that the assistant used for this run.


Show possible types
top_p
number or null

The nucleus sampling value used for this run. If not set, defaults to 1.

truncation_strategy
object or null

Controls for how a thread will be truncated prior to the run. Use this to control the intial context window of the run.


Show properties
usage
object or null

Usage statistics related to the run. This value will be null if the run is not in a terminal state (i.e. in_progress, queued, etc.).


Show properties
OBJECT The run object
{
  "id": "run_abc123",
  "object": "thread.run",
  "created_at": 1698107661,
  "assistant_id": "asst_abc123",
  "thread_id": "thread_abc123",
  "status": "completed",
  "started_at": 1699073476,
  "expires_at": null,
  "cancelled_at": null,
  "failed_at": null,
  "completed_at": 1699073498,
  "last_error": null,
  "model": "gpt-4o",
  "instructions": null,
  "tools": [{"type": "file_search"}, {"type": "code_interpreter"}],
  "metadata": {},
  "incomplete_details": null,
  "usage": {
    "prompt_tokens": 123,
    "completion_tokens": 456,
    "total_tokens": 579
  },
  "temperature": 1.0,
  "top_p": 1.0,
  "max_prompt_tokens": 1000,
  "max_completion_tokens": 1000,
  "truncation_strategy": {
    "type": "auto",
    "last_messages": null
  },
  "response_format": "auto",
  "tool_choice": "auto",
  "parallel_tool_calls": true
}
Run steps
Beta
Represents the steps (model and tool calls) taken during the run.

Related guide: Assistants

List run steps
Beta
get
 
https://api.openai.com/v1/threads/{thread_id}/runs/{run_id}/steps
Returns a list of run steps belonging to a run.

Path parameters
run_id
string

Required
The ID of the run the run steps belong to.

thread_id
string

Required
The ID of the thread the run and run steps belong to.

Query parameters
after
string

Optional
A cursor for use in pagination. after is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

before
string

Optional
A cursor for use in pagination. before is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, starting with obj_foo, your subsequent call can include before=obj_foo in order to fetch the previous page of the list.

include[]
array

Optional
A list of additional fields to include in the response. Currently the only supported value is step_details.tool_calls[*].file_search.results[*].content to fetch the file search result content.

See the file search tool documentation for more information.

limit
integer

Optional
Defaults to 20
A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

order
string

Optional
Defaults to desc
Sort order by the created_at timestamp of the objects. asc for ascending order and desc for descending order.

Returns
A list of run step objects.

Example request
curl https://api.openai.com/v1/threads/thread_abc123/runs/run_abc123/steps \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2"
Response
{
  "object": "list",
  "data": [
    {
      "id": "step_abc123",
      "object": "thread.run.step",
      "created_at": 1699063291,
      "run_id": "run_abc123",
      "assistant_id": "asst_abc123",
      "thread_id": "thread_abc123",
      "type": "message_creation",
      "status": "completed",
      "cancelled_at": null,
      "completed_at": 1699063291,
      "expired_at": null,
      "failed_at": null,
      "last_error": null,
      "step_details": {
        "type": "message_creation",
        "message_creation": {
          "message_id": "msg_abc123"
        }
      },
      "usage": {
        "prompt_tokens": 123,
        "completion_tokens": 456,
        "total_tokens": 579
      }
    }
  ],
  "first_id": "step_abc123",
  "last_id": "step_abc456",
  "has_more": false
}
Retrieve run step
Beta
get
 
https://api.openai.com/v1/threads/{thread_id}/runs/{run_id}/steps/{step_id}
Retrieves a run step.

Path parameters
run_id
string

Required
The ID of the run to which the run step belongs.

step_id
string

Required
The ID of the run step to retrieve.

thread_id
string

Required
The ID of the thread to which the run and run step belongs.

Query parameters
include[]
array

Optional
A list of additional fields to include in the response. Currently the only supported value is step_details.tool_calls[*].file_search.results[*].content to fetch the file search result content.

See the file search tool documentation for more information.

Returns
The run step object matching the specified ID.

Example request
curl https://api.openai.com/v1/threads/thread_abc123/runs/run_abc123/steps/step_abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2"
Response
{
  "id": "step_abc123",
  "object": "thread.run.step",
  "created_at": 1699063291,
  "run_id": "run_abc123",
  "assistant_id": "asst_abc123",
  "thread_id": "thread_abc123",
  "type": "message_creation",
  "status": "completed",
  "cancelled_at": null,
  "completed_at": 1699063291,
  "expired_at": null,
  "failed_at": null,
  "last_error": null,
  "step_details": {
    "type": "message_creation",
    "message_creation": {
      "message_id": "msg_abc123"
    }
  },
  "usage": {
    "prompt_tokens": 123,
    "completion_tokens": 456,
    "total_tokens": 579
  }
}
The run step object
Beta
Represents a step in execution of a run.

assistant_id
string

The ID of the assistant associated with the run step.

cancelled_at
integer or null

The Unix timestamp (in seconds) for when the run step was cancelled.

completed_at
integer or null

The Unix timestamp (in seconds) for when the run step completed.

created_at
integer

The Unix timestamp (in seconds) for when the run step was created.

expired_at
integer or null

The Unix timestamp (in seconds) for when the run step expired. A step is considered expired if the parent run is expired.

failed_at
integer or null

The Unix timestamp (in seconds) for when the run step failed.

id
string

The identifier of the run step, which can be referenced in API endpoints.

last_error
object or null

The last error associated with this run step. Will be null if there are no errors.


Show properties
metadata
map

Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format, and querying for objects via API or the dashboard.

Keys are strings with a maximum length of 64 characters. Values are strings with a maximum length of 512 characters.

object
string

The object type, which is always thread.run.step.

run_id
string

The ID of the run that this run step is a part of.

status
string

The status of the run step, which can be either in_progress, cancelled, failed, completed, or expired.

step_details
object

The details of the run step.


Show possible types
thread_id
string

The ID of the thread that was run.

type
string

The type of run step, which can be either message_creation or tool_calls.

usage
object or null

Usage statistics related to the run step. This value will be null while the run step's status is in_progress.


Show properties
OBJECT The run step object
{
  "id": "step_abc123",
  "object": "thread.run.step",
  "created_at": 1699063291,
  "run_id": "run_abc123",
  "assistant_id": "asst_abc123",
  "thread_id": "thread_abc123",
  "type": "message_creation",
  "status": "completed",
  "cancelled_at": null,
  "completed_at": 1699063291,
  "expired_at": null,
  "failed_at": null,
  "last_error": null,
  "step_details": {
    "type": "message_creation",
    "message_creation": {
      "message_id": "msg_abc123"
    }
  },
  "usage": {
    "prompt_tokens": 123,
    "completion_tokens": 456,
    "total_tokens": 579
  }
}
Streaming
Beta
Stream the result of executing a Run or resuming a Run after submitting tool outputs. You can stream events from the Create Thread and Run, Create Run, and Submit Tool Outputs endpoints by passing "stream": true. The response will be a Server-Sent events stream. Our Node and Python SDKs provide helpful utilities to make streaming easy. Reference the Assistants API quickstart to learn more.

The message delta object
Beta
Represents a message delta i.e. any changed fields on a message during streaming.

delta
object

The delta containing the fields that have changed on the Message.


Show properties
id
string

The identifier of the message, which can be referenced in API endpoints.

object
string

The object type, which is always thread.message.delta.

OBJECT The message delta object
{
  "id": "msg_123",
  "object": "thread.message.delta",
  "delta": {
    "content": [
      {
        "index": 0,
        "type": "text",
        "text": { "value": "Hello", "annotations": [] }
      }
    ]
  }
}
The run step delta object
Beta
Represents a run step delta i.e. any changed fields on a run step during streaming.

delta
object

The delta containing the fields that have changed on the run step.


Show properties
id
string

The identifier of the run step, which can be referenced in API endpoints.

object
string

The object type, which is always thread.run.step.delta.

OBJECT The run step delta object
{
  "id": "step_123",
  "object": "thread.run.step.delta",
  "delta": {
    "step_details": {
      "type": "tool_calls",
      "tool_calls": [
        {
          "index": 0,
          "id": "call_123",
          "type": "code_interpreter",
          "code_interpreter": { "input": "", "outputs": [] }
        }
      ]
    }
  }
}
Assistant stream events
Beta
Represents an event emitted when streaming a Run.

Each event in a server-sent events stream has an event and data property:

event: thread.created
data: {"id": "thread_123", "object": "thread", ...}
We emit events whenever a new object is created, transitions to a new state, or is being streamed in parts (deltas). For example, we emit thread.run.created when a new run is created, thread.run.completed when a run completes, and so on. When an Assistant chooses to create a message during a run, we emit a thread.message.created event, a thread.message.in_progress event, many thread.message.delta events, and finally a thread.message.completed event.

We may add additional events over time, so we recommend handling unknown events gracefully in your code. See the Assistants API quickstart to learn how to integrate the Assistants API with streaming.

done
data is [DONE]

Occurs when a stream ends.

error
data is an error

Occurs when an error occurs. This can happen due to an internal server error or a timeout.

thread.created
data is a thread

Occurs when a new thread is created.

thread.message.completed
data is a message

Occurs when a message is completed.

thread.message.created
data is a message

Occurs when a message is created.

thread.message.delta
data is a message delta

Occurs when parts of a Message are being streamed.

thread.message.in_progress
data is a message

Occurs when a message moves to an in_progress state.

thread.message.incomplete
data is a message

Occurs when a message ends before it is completed.

thread.run.cancelled
data is a run

Occurs when a run is cancelled.

thread.run.cancelling
data is a run

Occurs when a run moves to a cancelling status.

thread.run.completed
data is a run

Occurs when a run is completed.

thread.run.created
data is a run

Occurs when a new run is created.

thread.run.expired
data is a run

Occurs when a run expires.

thread.run.failed
data is a run

Occurs when a run fails.

thread.run.in_progress
data is a run

Occurs when a run moves to an in_progress status.

thread.run.incomplete
data is a run

Occurs when a run ends with status incomplete.

thread.run.queued
data is a run

Occurs when a run moves to a queued status.

thread.run.requires_action
data is a run

Occurs when a run moves to a requires_action status.

thread.run.step.cancelled
data is a run step

Occurs when a run step is cancelled.

thread.run.step.completed
data is a run step

Occurs when a run step is completed.

thread.run.step.created
data is a run step

Occurs when a run step is created.

thread.run.step.delta
data is a run step delta

Occurs when parts of a run step are being streamed.

thread.run.step.expired
data is a run step

Occurs when a run step expires.

thread.run.step.failed
data is a run step

Occurs when a run step fails.

thread.run.step.in_progress
data is a run step

Occurs when a run step moves to an in_progress state.

Completions
Legacy
Given a prompt, the model will return one or more predicted completions along with the probabilities of alternative tokens at each position. Most developer should use our Chat Completions API to leverage our best and newest models.

Create completion
Legacy
post
 
https://api.openai.com/v1/completions
Creates a completion for the provided prompt and parameters.

Request body
model
string

Required
ID of the model to use. You can use the List models API to see all of your available models, or see our Model overview for descriptions of them.

prompt
string or array

Required
The prompt(s) to generate completions for, encoded as a string, array of strings, array of tokens, or array of token arrays.

Note that <|endoftext|> is the document separator that the model sees during training, so if a prompt is not specified the model will generate as if from the beginning of a new document.

best_of
integer or null

Optional
Defaults to 1
Generates best_of completions server-side and returns the "best" (the one with the highest log probability per token). Results cannot be streamed.

When used with n, best_of controls the number of candidate completions and n specifies how many to return – best_of must be greater than n.

Note: Because this parameter generates many completions, it can quickly consume your token quota. Use carefully and ensure that you have reasonable settings for max_tokens and stop.

echo
boolean or null

Optional
Defaults to false
Echo back the prompt in addition to the completion

frequency_penalty
number or null

Optional
Defaults to 0
Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.

See more information about frequency and presence penalties.

logit_bias
map

Optional
Defaults to null
Modify the likelihood of specified tokens appearing in the completion.

Accepts a JSON object that maps tokens (specified by their token ID in the GPT tokenizer) to an associated bias value from -100 to 100. You can use this tokenizer tool to convert text to token IDs. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token.

As an example, you can pass {"50256": -100} to prevent the <|endoftext|> token from being generated.

logprobs
integer or null

Optional
Defaults to null
Include the log probabilities on the logprobs most likely output tokens, as well the chosen tokens. For example, if logprobs is 5, the API will return a list of the 5 most likely tokens. The API will always return the logprob of the sampled token, so there may be up to logprobs+1 elements in the response.

The maximum value for logprobs is 5.

max_tokens
integer or null

Optional
Defaults to 16
The maximum number of tokens that can be generated in the completion.

The token count of your prompt plus max_tokens cannot exceed the model's context length. Example Python code for counting tokens.

n
integer or null

Optional
Defaults to 1
How many completions to generate for each prompt.

Note: Because this parameter generates many completions, it can quickly consume your token quota. Use carefully and ensure that you have reasonable settings for max_tokens and stop.

presence_penalty
number or null

Optional
Defaults to 0
Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.

See more information about frequency and presence penalties.

seed
integer or null

Optional
If specified, our system will make a best effort to sample deterministically, such that repeated requests with the same seed and parameters should return the same result.

Determinism is not guaranteed, and you should refer to the system_fingerprint response parameter to monitor changes in the backend.

stop
string / array / null

Optional
Defaults to null
Up to 4 sequences where the API will stop generating further tokens. The returned text will not contain the stop sequence.

stream
boolean or null

Optional
Defaults to false
Whether to stream back partial progress. If set, tokens will be sent as data-only server-sent events as they become available, with the stream terminated by a data: [DONE] message. Example Python code.

stream_options
object or null

Optional
Defaults to null
Options for streaming response. Only set this when you set stream: true.


Show properties
suffix
string or null

Optional
Defaults to null
The suffix that comes after a completion of inserted text.

This parameter is only supported for gpt-3.5-turbo-instruct.

temperature
number or null

Optional
Defaults to 1
What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.

We generally recommend altering this or top_p but not both.

top_p
number or null

Optional
Defaults to 1
An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.

We generally recommend altering this or temperature but not both.

user
string

Optional
A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. Learn more.

Returns
Returns a completion object, or a sequence of completion objects if the request is streamed.


No streaming

Streaming
Example request
curl https://api.openai.com/v1/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-3.5-turbo-instruct",
    "prompt": "Say this is a test",
    "max_tokens": 7,
    "temperature": 0
  }'
Response
{
  "id": "cmpl-uqkvlQyYK7bGYrRHQ0eXlWi7",
  "object": "text_completion",
  "created": 1589478378,
  "model": "gpt-3.5-turbo-instruct",
  "system_fingerprint": "fp_44709d6fcb",
  "choices": [
    {
      "text": "\n\nThis is indeed a test",
      "index": 0,
      "logprobs": null,
      "finish_reason": "length"
    }
  ],
  "usage": {
    "prompt_tokens": 5,
    "completion_tokens": 7,
    "total_tokens": 12
  }
}
The completion object
Legacy
Represents a completion response from the API. Note: both the streamed and non-streamed response objects share the same shape (unlike the chat endpoint).

choices
array

The list of completion choices the model generated for the input prompt.


Show properties
created
integer

The Unix timestamp (in seconds) of when the completion was created.

id
string

A unique identifier for the completion.

model
string

The model used for completion.

object
string

The object type, which is always "text_completion"

system_fingerprint
string

This fingerprint represents the backend configuration that the model runs with.

Can be used in conjunction with the seed request parameter to understand when backend changes have been made that might impact determinism.

usage
object

Usage statistics for the completion request.


Show properties
OBJECT The completion object
{
  "id": "cmpl-uqkvlQyYK7bGYrRHQ0eXlWi7",
  "object": "text_completion",
  "created": 1589478378,
  "model": "gpt-4-turbo",
  "choices": [
    {
      "text": "\n\nThis is indeed a test",
      "index": 0,
      "logprobs": null,
      "finish_reason": "length"
    }
  ],
  "usage": {
    "prompt_tokens": 5,
    "completion_tokens": 7,
    "total_tokens": 12
  }
}
