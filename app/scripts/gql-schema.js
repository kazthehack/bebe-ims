#! /usr/bin/env node
const fs = require('fs')
const fetch = require('node-fetch')
const dotenv = require('dotenv')

const SCHEMA_OUTPUT_FILE = 'schema.json'

// TODO: investigate replacing this using apollo-cli (preffered) or graphql-cli (if necessary).
// This "Introspection Query" simulates the behavior used by the GraphiQL Developer Tools that
// we host on our API host.  This query will fetch a valid "schema" json that can be read by
// our static analysis tools locally (e.g. eslint).  This allows for the same level of "linting"
// as we are used to when writing queries inside of GraphiQL from our api server.
// AFAICT this query originated from this gist, or similar:
// https://gist.github.com/craigbeck/b90915d49fda19d5b2b17ead14dcd6da
const INTROSPECTION_QUERY = `
query IntrospectionQuery {
  __schema {
    queryType { name }
    mutationType { name }
    subscriptionType { name }
    types {
      ...FullType
    }
    directives {
      name
      description
      locations
      args {
        ...InputValue
      }
    }
  }
}

fragment FullType on __Type {
  kind
  name
  description
  fields(includeDeprecated: true) {
    name
    description
    args {
      ...InputValue
    }
    type {
      ...TypeRef
    }
    isDeprecated
    deprecationReason
  }
  inputFields {
    ...InputValue
  }
  interfaces {
    ...TypeRef
  }
  enumValues(includeDeprecated: true) {
    name
    description
    isDeprecated
    deprecationReason
  }
  possibleTypes {
    ...TypeRef
  }
}

fragment InputValue on __InputValue {
  name
  description
  type { ...TypeRef }
  defaultValue
}

fragment TypeRef on __Type {
  kind
  name
  ofType {
    kind
    name
    ofType {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
              }
            }
          }
        }
      }
    }
  }
}
`

const GRAPHQL_URL = process.env.GRAPHQL_URL
  || dotenv.config().parsed.REACT_APP_API_ENDPOINT
  || 'https://api.dev0.forge.bloomup.co/graphql'

fetch(GRAPHQL_URL, {
  method: 'POST',
  body: JSON.stringify({ query: INTROSPECTION_QUERY }),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})
.then(res => res.json())
.then(json => fs.writeFile(SCHEMA_OUTPUT_FILE, JSON.stringify(json), (err) => {
  if (err) throw err;
  console.log('Local Schema Updated Successfully!')
}))
