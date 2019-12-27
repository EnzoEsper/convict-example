// config.js
require("dotenv").config();
const convict = require("convict");

const schema = {
  sources: {
    doc: "A collection of credentials.",
    format: "credential-array",
    default: [],

    children: {
      username: {
        username: "The username credential",
        format: String,
        default: null
      },
      password: {
        doc: "The password credential",
        format: String,
        default: null
      }
    }
  }
};

convict.addFormat({
  name: "credential-array",
  validate: function(credentials, schema) {
    if (!Array.isArray(credentials)) {
      throw new Error("must be of type Array");
    }

    for (credential of credentials) {
      convict(schema.children)
        .load(credential)
        .validate();
    }
  }
});

const config = convict({
  sources: {
    doc: "A collection of credentials.",
    format: "credential-array",
    default: [],

    children: {
      username: {
        username: "The username credential",
        format: String,
        default: null
      },
      password: {
        doc: "The password credential",
        format: String,
        default: null
      }
    }
  }
});

// const env = config.get("env");
config.loadFile(`./config/prod.json`);

// config.validate({ allowed: "strict" }); // throws error if config does not conform to schema

module.exports = config.getProperties(); // so we can operate with a plain old JavaScript object and abstract away convict (optional)
