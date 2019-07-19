FROM node:12
WORKDIR /home/node/app
ADD package.json package.json
RUN npm install
ADD app.js app.js
CMD ["npm", "start"]
