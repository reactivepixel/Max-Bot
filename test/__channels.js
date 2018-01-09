const channels = require('../bot/controllers/channels');
const expect = require('chai').expect;

describe('Sanity Testing', () => {
  it('1 === 1', () => {
    expect(1).to.be.equal(1);
  });
});


describe('Channels Testing', () => {
  it('channels() has >1 Methods attatched', () => {
    // Instance the channels
    const target = Object.keys(channels());
    expect(target.length).to.be.above(0);
  });
});
