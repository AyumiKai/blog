// 自定义的request对象
// ctx.request

const qs = require('querystring');
const url = require('url')

module.exports = {
  set querystring(str) {
    const url = parse(this.req);
    if (url.search === `?${str}`) return;

    url.search = str;
    url.path = null;

    this.url = stringify(url);
  },
  get querystring() {
    if (!this.req) return '';
    return parse(this.req).query || '';
  },
  get query() {
    return url.parse(this.req.url, true).query
  },
  set query(obj) {
    this.querystring = qs.stringify(obj);
  },
}

