FROM alpine:latest

ARG PB_VERSION=0.26.6

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

# pb_data フォルダ（ローカルでコレクション作った状態）をコピー
COPY pb_data/ /pb/pb_data/

# CMDで PocketBase 起動時に --dir 指定
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8080", "--dir", "/pb/pb_data"]

