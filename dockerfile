FROM node
WORKDIR /usr/api
COPY package*.json ./
RUN npm install 
COPY . .
EXPOSE 4000
CMD ["npm","start"]