FROM node
 
# Create app directory
RUN mkdir -p /sbb/www/poemweb
WORKDIR /sbb/www/poemweb
 
# Bundle app source
COPY . /sbb/www/poemweb
RUN npm install
 
EXPOSE 3001
CMD [ "npm", "start" ]
#docker build -t poemweb .
#docker run -d -p 3001:3001 [imageid]