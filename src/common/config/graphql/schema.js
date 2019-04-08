const types = `
type Field {
  id: Int!
  groupId: Int!
  name: String!
  handle: String!
  context: String!
  instructions: String!
  type: String!
  settings: String!
  uid: String!
}
type Query {
  fieldList(groupId: Int!): [Field]
}
`;

module.exports = [types]
