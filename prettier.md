# prettier実行順番(.sh)

- .bin/prettier
- prettier/bin-prettier.js: version比較とupdate確認
- prettier/cli.js/:run(argv):15289 で実行 logger呼び出し、例外で終了 context.rawArguments = argv context.logger = 警告類 context.detailedOptionMap: オプションの詳細 → これを出力すればいい
- prettier/cli.js/:main()　--helpの実行を参考にする どこ