FROM node:8

WORKDIR /app

COPY . ./

RUN npm install

EXPOSE 3000

VOLUME [ "/app/graphql" ]

CMD [ "npm", "start" ]
