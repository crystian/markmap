import { loadCSS, loadJS } from 'markmap-common';
import { Transformer } from 'markmap-lib';

export const transformer = new Transformer();
const { scripts, styles } = transformer.getAssets();
// @ts-expect-error blah
loadCSS(styles);
// @ts-expect-error blah
loadJS(scripts);
