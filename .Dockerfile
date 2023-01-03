FROM node:latest

RUN mkdir /blog
WORKDIR /blog

# libs:
COPY ./package*.json ./
RUN npm install

COPY ./src ./src
COPY ./init.mjs ./init.mjs

# mountingpoint
RUN mkdir /res
# RUN mkdir /src

EXPOSE 3000

CMD [ "node", "init.mjs"]