[![CircleCI](https://circleci.com/gh/infaspublications/auth0-deploy.svg?style=svg&circle-token=e972049af853ac9a4890233a9d52660d00f93d5f)](https://circleci.com/gh/infaspublications/auth0-deploy)

## Auth0 deploy
Auth0にデプロイする設定やソースコードを管理します

## Environment Variables
デプロイに必要な各種環境変数です

|環境変数名  |用途  |例 |
|---|---|---|
|AUTH0_TENANT_DOMAIN|テナント名を指定|xxx-yyyyyyy.auth0.com|
|AUTH0_SITE_DOMAIN|WWD側のサイトドメインを指定|xxx.wwdjapan.com|
|AUTH0_CLIENT_ID|deploy用アプリケーションのclient_id|aaaaaaaaaa|
|AUTH0_CLIENT_SECRET|deploy用アプリケーションのclient_secret|bbbbbbbbbbbb|
|AUTH0_SMTP_USER|SMTPのユーザ名を指定|xxxxxxx|
|AUTH0_SMTP_PASS|SMTPのパスワードを指定|yyyyyyy|
|AUTH0_DEFAULT_FROM_ADDRESS|SMTPのデフォルトのfromアドレスを指定|no-reply@example.com|

## 使い方
### Auth0セットアップ
1. Auth0のダッシュボードよりtenantを新たに作成します
2. そのtenantに[Auth0 Deploy CLI Extension](https://github.com/auth0-extensions/auth0-deploy-cli-extension)をインストールします
3. テナント名とclient_id、client_secretをローカル環境のセットアップ用に保存します

### ローカル環境

1. ローカルへのソースとライブラリの展開

```
$ git clone git@github.com:infaspublications/auth0-deploy.git
$ cd auth0-deploy
$ npm install
```

2. direnvのインストール
https://github.com/direnv/direnv に従いインストールと設定を行う

3. .envrcの設定

各種環境変数を設定
```
$ cp .envrc.sample .envrc
$ direnv edit
```

## テスト
RulesとCustom Database Scriptsにはユニットテストがあります。以下のコマンドで実施

```
$ npm run test
```

## デプロイ

以下のコマンドでデプロイを実施
```
$ npm run deploy
```

## 本番リリース
tagを作ることでCircleCI上でテストが実施、その後本番のテナントに対してデプロイが実施されます

```
$ git tag 1.2.0
$ git push origin 1.2.0
```
