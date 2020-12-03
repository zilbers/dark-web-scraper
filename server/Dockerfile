FROM node:12

RUN mkdir -p /src/app

WORKDIR /src/app

COPY package.json /src/app/package.json

RUN npm i --silent

EXPOSE 8080

COPY . /src

# CMD ["npm", "run", "dev"]