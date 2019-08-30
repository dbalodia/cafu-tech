FROM node:10
RUN mkdir -p /cafu-tech
WORKDIR /cafu-tech
ADD . /cafu-tech
ENV PORT 3012
EXPOSE 3012
CMD [ "mkdir /var/log/applogs", "CMD chmod +777 /var/log/applogs",  "npm run start"]