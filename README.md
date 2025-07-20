# 勉強進捗管理アプリ Study Manager

## 目次
- [勉強進捗管理アプリ Study Manager](#勉強進捗管理アプリ-study-manager)
  - [目次](#目次)
  - [概要](#概要)
  - [使用技術](#使用技術)
  - [機能一覧](#機能一覧)
  - [画面設計](#画面設計)
  - [ルーティング](#ルーティング)
  - [ディレクトリ構成](#ディレクトリ構成)
  - [データベース構成（PocketBase）](#データベース構成pocketbase)
    - [1. `Users`（Auth コレクション）](#1-usersauth-コレクション)
    - [2. `StudyTheme`（Base コレクション）](#2-studythemebase-コレクション)
    - [3. `StudyMaterial`（Base コレクション）](#3-studymaterialbase-コレクション)
    - [補足メモ（Tips）](#補足メモtips)
  - [起動方法](#起動方法)


---

## 概要
このアプリは、毎日の勉強計画と進捗をシンプルに管理できるサポートツールです。
テーマ・教材ごとにノルマを自動で配分し、日々の達成状況を記録できます。

## 使用技術
- フロントエンド: HTML/CSS/JavaScript(mjs, js)
- バックエンド: [PocketBase(BaaS。認証・DB管理・REST API)](https://pocketbase.io/)
- その他: LocalStorage/SessionStorage

---

## 機能一覧
- ユーザー登録・削除
- 勉強テーマの登録(教材の複数追加が可能)
- 自動ノルマ計算(平日・休日に重み付け)
- 本日の勉強完了ボタン(進捗の自動反映。1日1回を想定)
- テーマ・教材の削除
- 勉強テーマ詳細ページ

---

## 画面設計

- #### [Figmaリンク](https://www.figma.com/design/Tg1vLe7V9DqKJfgG16lQLO/webapp_b3_first?node-id=0-1&t=irZRNAUsjc1eHttR-1)  
- #### [Penpotリンク](https://design.penpot.app/#/workspace?team-id=3268f47a-7993-81be-8006-41f3592a7f47&file-id=3268f47a-7993-81be-8006-41f3c5510925&page-id=3268f47a-7993-81be-8006-41f3c5510926)

---

## ルーティング

|URL|メソッド|機能・説明|
|:---:|:---|:---|
| `/login` | GET, POST | ログインフォームの表示/ログイン処理 |
| `/createAccount`| GET, POST | アカウント作成フォームの表示/登録処理 |
| `/topPage`| GET | 本日予定の勉強テーマ（未完了・完了済）の一覧表示 |
| `/myPage` | GET | ユーザープロフィール表示 |
| `/myPage/edit` | GET, PUT | プロフィール編集フォームの表示/更新処理 |
| `/studyList` | GET | 勉強テーマ一覧の表示・検索 |
| `/studyList/new` | GET, POST | 勉強テーマ新規作成フォーム/登録処理 |
| `/studyList/detail` | GET, PUT | テーマ詳細表示/その日の進捗登録処理 |

---

## ディレクトリ構成

**frontend**
```bash
frontend
├── createAccount.html
├── css
│   ├── createAccount.css
│   ├── createStudy.css
│   ├── loginStyle.css
│   ├── mainParts.css
│   ├── mypage.css
│   ├── mypageEdit.css
│   ├── studyBanner.css
│   ├── studyDetail.css
│   ├── studyList.css
│   ├── studyMaterialBanner.css
│   ├── studyMaterials.css
│   └── topPage.css
├── js
│   ├── calcNorma.js
│   ├── calendarDisplay.js
│   └── createStudyMaterialForm.js
├── login.html
├── mjs
│   ├── createAccont.mjs
│   ├── loginHandle.mjs
│   ├── mypage.mjs
│   ├── registerStudy.mjs
│   ├── studyBannerFactory.mjs
│   ├── studyDetail.mjs
│   ├── studyList.mjs
│   ├── topPageHandle.mjs
│   └── userEdit.mjs
├── myPage
│   ├── edit.html
│   └── index.html
├── studyList
│   ├── detail.html
│   ├── index.html
│   └── new.html
├── templete.html
└── topPage.html
```

**backend**
```bash
backend/
├── Dockerfile
├── pocketbase
├── pb_migrations/
└── pb_data/
```

---

## データベース構成（PocketBase）

このアプリでは、PocketBase を使用して以下の3つのコレクションを定義しています。

### 1. `Users`（Auth コレクション）

ユーザー認証とアカウント情報を管理します。

| 変数名 | 型 | 説明 |
|:---|:---|:---|
| `id` | ID（自動） | ユーザーID（主キー） |
| `email` | Email | メールアドレス（ログインに使用） |
| `name` | Plain text | ユーザーの名前 |
| `icon` | File | ユーザーのアイコン画像 |
| `created` | Autodate | 作成日 |
| `updated` | Autodate | 更新日 |

### 2. `StudyTheme`（Base コレクション）

ユーザーごとの勉強テーマを管理します。

| 変数名 | 型 | 説明 |
|:---|:---|:---|
| `id` | ID（自動） | テーマID（主キー） |
| `user` | Relation: Users | このテーマを所有するユーザー |
| `title` | Plain text | テーマ名 |
| `tips` | Plain text | テーマの補足説明や勉強メモ |
| `startDate` | Date | 勉強開始日 |
| `endDate` | Date | 勉強終了日 |
| `doneToday` | Date | 最後に「今日の勉強完了」を押した日（更新トリガー用） |
| `materials` | Relation: StudyMaterial (複数可) | 紐づく教材群（StudyMaterial） |
| `created` | Autodate | 作成日 |
| `updated` | Autodate | 更新日（※`doneToday`で代替使用） |


### 3. `StudyMaterial`（Base コレクション）

教材ごとの進捗情報を管理します。

| 変数名 | 型 | 説明 |
|:---|:---|:---|
| `id` | ID（自動） | 教材ID（主キー） |
| `name` | Plain text | 教材名 |
| `type` | Plain text | 教材の種類（例：本、動画、アプリなど） |
| `totalAmount` | Number | 教材全体の量（例：100ページ） |
| `unitName` | Plain text | 単位名（ページ、問、レッスンなど） |
| `doneAmount` | Number | 現在の進捗量 |
| `created` | Autodate | 作成日 |
| `updated` | Autodate | 更新日 |


### 補足メモ（Tips）

- `StudyTheme.materials` の relation により、テーマ単位で教材をまとめて取得・管理できる設計になっています。
- `doneToday` は「今日の進捗登録ボタン」を押したかどうかの判定に使い、更新時刻の代替としても活用しています。

---

## 起動方法
起動方法は【①ターミナルで手動で起動する場合】と【②Dockerで起動する場合】があります。どちらかの方法でWebアプリを起動します。
起動したら http://localhost:3000/login にアクセスしてください。


【①ターミナルで手動で起動する場合】
**使うもの**
- ターミナル×2
- お好きなWebブラウザ
   
1. フロントエンドのサーバーを立ち上げる
ターミナルで以下のコマンドを実行してください。
```bash
$ cd frontend
$ npx serve -l 3000
```

1. バックエンドのサーバーを立ち上げる
もう1つのターミナルで以下のコマンドを実行してください。
```bash
$ cd backend
$ ./pocketbase serve
```

【②Dockerで起動する場合】
**使うもの**
- ターミナル×1
- お好きなWebブラウザ

以下のコマンドを実行してください。
```bash
$ docker-compose up --build
```
※`--build`は、Dockerイメージを初回または変更時に再構築するオプションです。2回目以降で設定に変更がなければ省略して大丈夫です。