import { Dice } from '../Dice';
import { dice } from '../proto/dice';

describe('contract', () => {
  it("should return 'hello, NAME!'", () => {
    const c = new Dice();

    const args = new dice.hello_arguments('World');
    const res = c.hello(args);

    expect(res.value).toStrictEqual('Hello, World!');
  });
});
