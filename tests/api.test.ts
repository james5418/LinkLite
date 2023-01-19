import app from "../src/index";

test('adds 1 + 2 to equal 3', () => {
    let x: number = 1, y: number = 2;
    let expected: number = 3;
    let actual: number = x + y;
  
    expect(actual).toBe(expected);
});