FROM node:10
RUN mkdir -p /cafu-tech
CMD mkdir /var/log/applogs
CMD chmod +777 /var/log/applogs
WORKDIR /cafu-tech
ADD . /cafu-tech
ENV PORT 3012
CMD npm run start
EXPOSE 3012