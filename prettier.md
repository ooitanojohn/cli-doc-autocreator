# prettier実行順番(.sh)

- .bin/prettier
- prettier/bin-prettier.js: version比較とupdate確認
- prettier/cli.js/:run(argv):15289 で実行 logger呼び出し、例外で終了 context.rawArguments = argv context.logger = 警告類 context.detailedOptionMap: オプションの詳細 → これを出力すればいい
- prettier/cli.js/:main() argvのバリデーション　--help発見 :15333

```js
var {printToScreen} = require_utils();
if (context.argv.help !== void 0) {
    printToScreen(typeof context.argv.help === "string" && context.argv.help !== "" ? createDetailedUsage(context, context.argv.help) : createUsage(context));
    return;
  }
```

## printToScreen() のコードを追う　→　require_utils() のプロパティ

- require_utils → __commonJS2でrequireをrapしている
- src/cli/*がcli.jsにまとめられている logger、utilsは使えそう
- printToScreen() はこのまま使用できそう

```js
var printToScreen2 = console.log.bind(console);
```

- 出力内容 → --helpの値によって変わる

```js
printToScreen(typeof context.argv.help === "string" && context.argv.help !== "" ? createDetailedUsage(context, context.argv.help) : createUsage(context));
```

- createDetailedUsage() はオプションの詳細を出力する関数
- createUsage() はオプションの概要を出力する関数

## require_usage() を追う

```js
var {
  createDetailedUsage,
  createUsage
} = require_usage();
```

### createUsage()

- 規模が大きくないなら、createUsage()だけでよさそう

```js
function createUsage2(context) {
      const options = getOptionsWithOpposites(context.detailedOptions).filter((option) => !(option.type === "boolean" && option.oppositeDescription && !option.name.startsWith("no-")));
      const groupedOptions = groupBy(options, (option) => option.category);
      const firstCategories = constant.categoryOrder.slice(0, -1);
      const lastCategories = constant.categoryOrder.slice(-1);
      const restCategories = Object.keys(groupedOptions).filter((category) => !constant.categoryOrder.includes(category));
      const allCategories = [...firstCategories, ...restCategories, ...lastCategories];
      const optionsUsage = allCategories.map((category) => {
        const categoryOptions = groupedOptions[category].map((option) => createOptionUsage(context, option, OPTION_USAGE_THRESHOLD)).join("\n");
        return `${category} options:

${indent(categoryOptions, 2)}`;
      });
      return [constant.usageSummary, ...optionsUsage, ""].join("\n\n");
    }
```

### getOptionsWithOpposites() を追う

```js
function getOptionsWithOpposites(options) {
      const optionsWithOpposites = options.map((option) => [option.description ? option : null, option.oppositeDescription ? Object.assign(Object.assign({}, option), {}, {
        name: `no-${option.name}`,
        type: "boolean",
        description: option.oppositeDescription
      }) : null]);
      return optionsWithOpposites.flat().filter(Boolean);
    }
```

- 現在あるoptionのno-をつけたものを追加している
- noを生成する必要がないなら

```js
function getOptionsWithOpposites(options) {
    const optionsWithOpposites = options.map((option) => [option.description ? option : null]);
    return optionsWithOpposites.flat().filter(Boolean);
}
```

### getOptionsWithOpposites() をfilter

- オプションの'type'が'boolean'で、'oppositeDescription'が存在し、 'name'が'no-'で始まらないものを返す

### groupBy()でoption毎にgroup化

- groupBy() iterateeにはFormat,Other,Outputなどoptions.categoryの値が入る

```js
function groupBy(array2, iteratee) {
      const result = /* @__PURE__ */ Object.create(null);
      for (const value of array2) {
        const key = iteratee(value);
        if (Array.isArray(result[key])) {
          result[key].push(value);
        } else {
          result[key] = [value];
        }
      }
      return result;
}
```

### createOptionUsageHeader()

- --option -alias のstringを作成

```js
    function createOptionUsageHeader(option) {
      const name = `--${option.name}`;
      const alias = option.alias ? `-${option.alias},` : null;
      const type = createOptionUsageType(option);
      return [alias, name, type].filter(Boolean).join(" ");
    }
```

### createOptionUsageType()

- optionのtypeを返す

```js
function createOptionUsageType(option) {
      switch (option.type) {
        case "boolean":
          return null;
        case "choice":
          return `<${option.choices.filter((choice) => !choice.deprecated && choice.since !== null).map((choice) => choice.value).join("|")}>`;
        default:
          return `<${option.type}>`;
      }
    }
```


### createDetailedUsage()

```js
function createDetailedUsage2(context, flag) {
      const option = getOptionsWithOpposites(context.detailedOptions).find((option2) => option2.name === flag || option2.alias === flag);
      const header = createOptionUsageHeader(option);
      const description = `
```
