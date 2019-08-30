FROM mhart/alpine-node:8
RUN mkdir -p /lead-management-service
WORKDIR /lead-management-service
ADD . /lead-management-service
ENV PORT 3034
CMD [ "mkdir /var/log/applogs", "CMD chmod +777 /var/log/applogs",  "npm run start"]
EXPOSE 3034