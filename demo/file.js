
const defineFunction = (key, definitions) => {
  definitions[key] = {
    ...definitions[key],
    merge: MergeStrategy[definitions[key].merge]
  }
}