FROM node:22-alpine

COPY ./server /find-your-wine

COPY .env /find-your-wine

WORKDIR /find-your-wine

RUN npm install

RUN npm run build

EXPOSE 3000

CMD [ "node", "dist/src/index.js" ]