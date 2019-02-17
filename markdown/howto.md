# How to use this

## GraphQL and GraphiQL

You can access <a href="/graphql">GraphQL here</a>

## Docker

Build and run using `docker-compose`:

```sh
$ cd <project-folder>
$ docker-compose up -d
```

## Folder structure

You only need to edit `graphql` folder files

```
graphql
└── product
    ├── product.graphql
    └── resolver.js
```

Folder `product` contains product `Domain`.
Inside you will have a `.graphql` with **GraphQL schemas and queries** and a `resolver.js`.

`resolver.js` is a Javascript function to return a mocked data.

## Example

### Person

####Mock

```json
[
  { "id": 1, "name": "Name1" },
  { "id": 2, "name": "Name2" },
  { "id": 3, "name": "Name3" }
]
```

#### GraphQL Schemas

```graphql
type Person {
  id: ID!
  name: String
  books: [Book!]
}

type Query {
  people: [Person]
  person(id: Int): Person
}
```

#### Resolvers

```js
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
```

### Book

#### Mocks

```json
[
  { "id": 1, "name": "BName1", "author": 1 },
  { "id": 2, "name": "BName2", "author": 1 },
  { "id": 3, "name": "BName3", "author": 2 }
]
```

#### GraphQL Schemas

```graphql
type Book {
  id: ID!
  name: String
  author: Person
}

type Query {
  books(id: Int): [Book]
}
```

##### Resolvers

```js
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
```
