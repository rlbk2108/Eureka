FROM node:18.0-alpine
USER root
WORKDIR /frontend
COPY ./eureka-app /frontend
ENV REACT_APP_HOST_IP_ADDRESS $API_URL
ENV REACT_APP_BACKEND_URL $REACT_APP_BACKEND_URL
RUN npm install
RUN npm run build
CMD [ "npm", "start" ]