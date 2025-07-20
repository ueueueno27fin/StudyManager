#!/bin/sh

# スーパーユーザーを作成（メール・パスワードは置き換えてください）
/pb/pocketbase superuser upsert pbUeno_devTest@test.com testport8080

# サーバー起動
/pb/pocketbase serve --http=0.0.0.0:8080
