import breakLines from "./breakLines";

describe("breakLines", () => {
  it("handles lines that are the exact expected length", () => {
    expect(
      breakLines("Lorem ipsum dolor sit amet, consectetur adipiscinges")
    ).toBe("Lorem ipsum dolor sit amet, consectetur adipiscinges");
  });

  it("handles lines with trailing whitespace", () => {
    expect(
      breakLines("Lorem ipsum dolor sit amet, consectetur adipiscinges ")
    ).toBe("Lorem ipsum dolor sit amet, consectetur adipiscinges");
  });

  it("breaks words at the desired length", () => {
    expect(
      breakLines(
        "Lorem ipsum dolor sit amet, consectetur adipiscinges lit. Nam dapibus"
      )
    ).toBe(
      "Lorem ipsum dolor sit amet, consectetur adipiscinges \n lit. Nam dapibus"
    );
  });

  it("handles extra whitespace at the line break", () => {
    expect(
      breakLines(
        "Lorem ipsum dolor sit amet, consectetur adipiscinges   lit. Nam dapibus"
      )
    ).toBe(
      "Lorem ipsum dolor sit amet, consectetur adipiscinges \n lit. Nam dapibus"
    );
  });

  it("breaks at the previous word break for longer lines", () => {
    expect(
      breakLines(
        "Lorem ipsum dolor sit amet, consectetur adipiscingeslit. Nam dapibus"
      )
    ).toBe(
      "Lorem ipsum dolor sit amet, consectetur \n adipiscingeslit. Nam dapibus"
    );
  });

  it("handles no whitespace", () => {
    expect(
      breakLines(
        "LoremipsumdolorsitametconsecteturadipiscingeslitNamdapibustellusvitaevenenatisfacilesisis"
      )
    ).toBe(
      "LoremipsumdolorsitametconsecteturadipiscingeslitNamd \n apibustellusvitaevenenatisfacilesisis"
    );
  });

  it("handles no whitespace within the line limit", () => {
    expect(
      breakLines(
        "LoremipsumdolorsitametconsecteturadipiscingeslitNamdapibustellusvita evenenatisfacilesisis"
      )
    ).toBe(
      "LoremipsumdolorsitametconsecteturadipiscingeslitNamd \n apibustellusvita evenenatisfacilesisis"
    );
  });

  it("handles breaking mid word", () => {
    expect(
      breakLines(
        "LoremipsumdolorsitametconsecteturadipiscingeslitNamdapibustellusvitaevenenatisfacilesisis",
        false
      )
    ).toBe(
      "LoremipsumdolorsitametconsecteturadipiscingeslitNamd \n apibustellusvitaevenenatisfacilesisis"
    );
  });

  it("handles whitespace at the breakpoint", () => {
    expect(
      breakLines(
        "LoremipsumdolorsitametconsecteturadipiscingeslitNamd apibustellusvitaevenenatisfacilesisis",
        false
      )
    ).toBe(
      "LoremipsumdolorsitametconsecteturadipiscingeslitNamd \n apibustellusvitaevenenatisfacilesisis"
    );
  });

  it("can break at a provided length", () => {
    expect(breakLines("Lorem ipsum dolor sit amet", true, 15)).toBe(
      "Lorem ipsum \n dolor sit amet"
    );
  });
});
