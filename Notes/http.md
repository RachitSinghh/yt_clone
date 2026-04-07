# What are HTTP headers

**Metadata** => key-value sent along with request and response

=> caching, authentication, manage state(for state management, logged in, logged out, etc etc)
-> _X-prefix ---> 2012(X-derecated)_

- Request Headers -> from client
- Response Headers -> from server
- Representation Headers -> encoding / compression 
- Payload Headers -> data

## Most common Headers
- Accept: application/json
- User-agent
- Authorization 
- cookie
- content-type
- cache-control

## CORS
* Access-control-allow-origin 
* Access-control-allow-Credentials 
* Access-control-allow-Method


## Security 
* Cross-origin-Embedder-Policy
* Cross-origin-opener-policy
* Content-security-Policy
* X-XSS-Protection

## HTTP Methods
Basic set of operation that can be used to interact with server 

- GET: retrieve a resource 
- HEAD: No message body (response headers only)
- OPTIONS: What operations are available
- TRACE: loopback test(get same data)
- DLETE: remove a resource 
- PUT: replace a resource
- POST: interact with resource (mostly add)
- PATCH:  change part of a resource

## HTTP status code

| Category | Description      |
|----------|------------------|
| 1XX      | Informational    |
| 2XX      | Success          |
| 3XX      | Redirection      |
| 4XX      | Client Error     |
| 5XX      | Server Error     |
=======================================
| Status Code | Meaning               |
|------------|------------------------|
| 100        | Continue               |
| 102        | Processing             |
| 200        | OK                     |
| 201        | Created                |
| 202        | Accepted               |
| 307        | Temporary Redirect     |
| 308        | Permanent Redirect     |
| 400        | Bad Request            |
| 401        | Unauthorized           |
| 402        | Payment Required       |
| 404        | Not Found              |
| 500        | Internal Server Error  |
| 504        | Gateway Timeout        |