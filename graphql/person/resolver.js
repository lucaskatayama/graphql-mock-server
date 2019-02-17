var people = require("./mock.json");
var books = require("../book/mock.json");

exports.resolver = {
  Query: {
    people(root, args, context) {
      return mocks;
    },
    person(root, { id }, context) {
      const results = id ? people.filter(p => p.id == id)[0] : people;
      if (results.length > 0) return results;
      else throw new Error(`id ${id} does not exist.`);
    },
  },
  Person: {
    books(person) {
      return books.filter(b => b.author === person.id);
    },
  },
};
