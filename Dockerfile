FROM node:latest
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
RUN npm install -g nodemon
COPY ./app/package.json /usr/src/app
RUN npm install

# Copy setup script
#COPY ./dbSetup /usr/src/app
# Run the setup script
#RUN node /usr/src/app/dbSetup.js

COPY ./app /usr/src/app
EXPOSE 3000
