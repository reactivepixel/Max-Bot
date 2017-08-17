const roles = require('../bot/controllers/roles');
const expect = require('chai').expect;

describe('Sanity Testing', () => {
  it('1 === 1', () => {
    expect(1).to.be.equal(1);
  });
});


describe('Roles Testing', () => {
  it('roles() has >1 Methods attatched', () => {
    // Instance the roles
    const target = Object.keys(roles());
    expect(target.length).to.be.above(0);
  });
});
