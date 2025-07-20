FROM alpine:latest

ARG PB_VERSION=0.28.3

RUN apk add --no-cache \
    unzip \
    ca-certificates \
    bash

# PocketBaseのzipをダウンロードして解凍
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

# init.sh をイメージに追加し、実行権限をつける
COPY init.sh /pb/init.sh
RUN chmod +x /pb/init.sh

EXPOSE 8080

# init.sh をCMDで実行
CMD ["/pb/init.sh"]
