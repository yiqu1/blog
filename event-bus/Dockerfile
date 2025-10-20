# specify the base image
FROM node:24-alpine

# set the working directory in the container
WORKDIR /app

# copy package.json into working directory in the container
COPY ./package.json ./

# install some dependencies
RUN npm install

# copy the rest of the files into the working directory in the container
COPY ./ ./

# Default command
CMD ["npm", "start"]