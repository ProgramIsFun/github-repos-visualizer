FROM node:alpine

WORKDIR '/app'

COPY package.json .
RUN npm install

COPY . .
CMD ["npm", "run", "start"]



# PREVENT EXIT https://stackoverflow.com/a/30209974/10189759
#ENTRYPOINT ["tail"]
#CMD ["-f","/dev/null"]