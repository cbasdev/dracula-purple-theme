const isMobile = require('./is-mobile');

describe('Navigation', () => {
  describe('Is Mobile', () => {
    it('returns false since we are in desktop', () => {
      expect(isMobile({
        device: {
          desktop: true,
        },
      })).toEqual(false);
    });

    it('returns true since we are in mobile', () => {
      expect(isMobile({
        device: {
          mobile: true,
        },
      })).toEqual(true);
    });
  });
});
