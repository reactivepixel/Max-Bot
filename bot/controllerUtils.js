class controllerUtils {
  constructor() {
    // Method to generate random numeric verification code
    // Modified to fit style guide from this SO answer:
    // https://stackoverflow.com/a/39774334
    this.generateCode = (n) => {
      // Workaround method for Math.pow() and ** operator
      const pow = (base, exp) => {
        let result = 1;
        for (let i = 0; i < exp; i += 1) {
          result *= base;
        }
        return result;
      };
      const add = 1;
      let max = 12 - add;
      let min = 0;
      if (n > max) {
        return this.generateCode(max) + this.generateCode(n - max);
      }
      max = pow(10, n + add);
      min = max / 10;
      const number = Math.floor(Math.random() * (max - (min + 1))) + min;
      return ('' + number).substring(add);
    };
  }
}

module.exports = controllerUtils;
