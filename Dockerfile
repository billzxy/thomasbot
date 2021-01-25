FROM node:current-buster

RUN apt-get update && apt-get install -y ffmpeg --no-install-recommends

WORKDIR /app
COPY . .

RUN npm install

CMD ["npm", "start"]
