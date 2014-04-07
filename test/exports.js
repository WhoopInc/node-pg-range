var pgRange = require("..");

describe("package exports", function () {
  it("should export Range class", function () {
    pgRange.should.include.keys("Range");
  });

  it("should export parser installation function", function () {
    pgRange.should.include.keys("install");
  });
});
