// response
// ctx.response

const response = {
  get header() {
    return this.res.getHeaders();
  },
  get status() {
    return this.res.statusCode;
  },
}

module.exports = response;