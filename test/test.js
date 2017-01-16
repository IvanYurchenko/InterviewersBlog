describe('My Test Set', function () {
    it('My test 2+2 = 4 - should succeed', function () {
        expect(2 + 2).toEqual(4);
    });

    it('My test 2*16 = 33 - should fail', function () {
        expect(2 * 16).toEqual(33);
    });

    it('My test 2*16 = 32 - should succeed', function () {
        expect(2 * 16).toEqual(32);
    });

});