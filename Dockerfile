FROM node:20.10.0-alpine3.18

COPY ./backend /find-your-wine

WORKDIR /find-your-wine

RUN npm install

RUN npm run build

EXPOSE 3002

CMD [ "node", "dist/main.js" ]