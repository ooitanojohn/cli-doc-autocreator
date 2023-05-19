function getOptionsWithOpposites(options) {
    const optionsWithOpposites = options.map((option) => [option.description ? option : null, option.oppositeDescription ? Object.assign(Object.assign({}, option), {}, {
      name: `no-${option.name}`,
      type: "boolean",
      description: option.oppositeDescription
    }) : null]);
    return optionsWithOpposites.flat().filter(Boolean);
}

// no-を生成しないオプションを取得

function getOptionsWithOpposites(options) {