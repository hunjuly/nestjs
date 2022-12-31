FROM node:lts-alpine

# Bash shell
RUN apk add -f bash bash-doc bash-completion
## change default shell ash -> bash
RUN sed -i "s|/bin/ash|/bin/bash|g" /etc/passwd

## color prompt
RUN echo 'PS1="\[\033[32m\]\w\[\033[00m\] "' >> ~/.bashrc
RUN echo "alias ls='ls --color=auto'" >> ~/.bashrc
RUN echo "alias l='ls --color=auto -lA'" >> ~/.bashrc

# Development Tools
RUN apk add -f git curl jq tree vim asciinema

# plant uml
RUN apk add openjdk8-jre graphviz

# ApacheBench
RUN apk add -f apache2-utils

# docker 설치, docker cli만 사용하기 때문에 아래처럼 간단하게 했다.
RUN DOCKER_PKG="docker-20.10.9.tgz";\
    curl -fsSLO --compressed "https://download.docker.com/linux/static/stable/$(arch)/$DOCKER_PKG"; \
    tar -xf $DOCKER_PKG --strip-components 1 --directory /usr/local/bin/ docker/docker; \
    rm -f $DOCKER_PKG
RUN apk add -f docker-compose

#grpcurl
# RUN GRPCURL_PKG="grpcurl_1.8.7_linux_$(arch).tar.gz";\
#     curl -fsSLO --compressed "https://github.com/fullstorydev/grpcurl/releases/download/v1.8.7/$GRPCURL_PKG";\
#     tar -xf $GRPCURL_PKG  --directory /usr/local/bin/;\
#     rm -f $GRPCURL_PKG
