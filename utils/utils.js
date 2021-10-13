// 解决require undefine问题
import { createRequire } from 'module';
const require = createRequire(import.meta.url);


export default {
    isDigit: function (c) {
        return c >= '0' && c <= '9';
    },
    isLetter: function (c) {
        return c.toUpperCase() >= 'A' && c.toUpperCase() <= 'Z';
    },
    require,
}