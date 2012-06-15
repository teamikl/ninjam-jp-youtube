ninjam-jp-youtube
=================

crasher.orz.hm で演奏されたNINJAMセッション過去放送の一覧表示


## 概要 ##


開発言語: HTML, JavaScript, CSS

方針: 出来る限り HTML ファイル一個配置するだけで動作するようにする。


ライブラリは google ajax library api 経由で利用。

その他の3rd-party製プラグインは、必要ならassetsディレクトリを設ける。
ライセンス確認の上、GitHub　Pagesから直接読み込み。


## NINJAM ネットセッション 過去放送へのクエリ ##

JSONPを利用。HTMLのsctipt要素を使ってクエリを発行します。
ページ送りで動的にクエリを発行する場合は、DOMのcreateElementで。


URL:
 http://gdata.youtube.com/feeds/api/videos/-/NINJAM

QUERY_STRING:
 v=2&alt=jsonc&format=5&orderby=published&author=nakajimayuusuke&max-results=10&callback=showResults


### 関連リンク ###

Developer's Guide: JSON-C / JavaScript
https://developers.google.com/youtube/2.0/developers_guide_jsonc

YouTube Player のパラメータ
https://developers.google.com/youtube/player_parameters


## TODO ##

 * 固定幅フォント利用 (日付が一桁の時のスペース幅を揃える為)
 * ページ送り (jQueryUI の Pagination系 プラグインで)
 * ページ送りの UI 改善 (ページ番号を列挙)
 * サムネイル画像の表示 (JSONCに画像のurlが含まれている。item.thumbnail.default)
 * コメント表示 (PHP等でGData API 利用すれば可能だけど、JSONP では未サポート)
 * 他のブラウザでの動作確認 (現在、chrome でのマニュアル・テストのみ) -> 自動化 selenium
 * スクリプトoff/未対応クライアントへの<noscript>表示
 * ヘージに埋め込んでるスクリプトも外部リソースへ。ファイルサイズはJSMin等で最適化。
 * Cache/manifest利用
 * callbackのエラー処理
 * TODO リストを issue tracker へ登録
 * 動画の組み込み。<object> -> <iframe> プレイヤーの機能が異なる。
 * デザインを動画プレイヤーとの統合
 * 動画プレイヤーの横幅
 * 動画リストのsmooth scroll