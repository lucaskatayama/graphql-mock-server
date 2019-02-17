var person = require("../person/mock.json");
var books = require("./mock.json");

exports.resolver = {
  Query: {
    books(root, { id }, context) {
      const results = id ? books.filter(p => p.id == id) : books;
      if (results.length > 0) return results;
      else throw new Error(`id ${id} does not exist.`);
    },
  },
  Book: {
    author(book) {
      console.log(book, person);
      return person.find(p => book.author === p.id);
    },
  },
};
