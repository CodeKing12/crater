import { compact, getSlotCompoundVariant, memo, splitProps } from '../helpers.mjs';
import { createRecipe } from './create-recipe.mjs';

const splitterDefaultVariants = {
  "variant": "default"
}
const splitterCompoundVariants = []

const splitterSlotNames = [
  [
    "root",
    "splitter__root"
  ],
  [
    "panel",
    "splitter__panel"
  ],
  [
    "resizeTrigger",
    "splitter__resizeTrigger"
  ]
]
const splitterSlotFns = /* @__PURE__ */ splitterSlotNames.map(([slotName, slotKey]) => [slotName, createRecipe(slotKey, splitterDefaultVariants, getSlotCompoundVariant(splitterCompoundVariants, slotName))])

const splitterFn = memo((props = {}) => {
  return Object.fromEntries(splitterSlotFns.map(([slotName, slotFn]) => [slotName, slotFn.recipeFn(props)]))
})

const splitterVariantKeys = [
  "variant"
]
const getVariantProps = (variants) => ({ ...splitterDefaultVariants, ...compact(variants) })

export const splitter = /* @__PURE__ */ Object.assign(splitterFn, {
  __recipe__: false,
  __name__: 'splitter',
  raw: (props) => props,
  classNameMap: {},
  variantKeys: splitterVariantKeys,
  variantMap: {
  "variant": [
    "default",
    "subtle"
  ]
},
  splitVariantProps(props) {
    return splitProps(props, splitterVariantKeys)
  },
  getVariantProps
})