FROM node:18

#Install pm2
RUN npm install pm2 -g;

# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /usr/src/app

# Installing dependencies
COPY package*.json ./

# Copying source files
COPY . .

# Build image
RUN yarn install; \
    yarn build; 

EXPOSE 3000