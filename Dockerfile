FROM  nginx:stable
RUN  mkdir -p /app && \
     ln -s /usr/share/nginx  /app
COPY  public   /app/nginx
COPY default.conf  /etc/nginx/conf.d/
EXPOSE 8080



