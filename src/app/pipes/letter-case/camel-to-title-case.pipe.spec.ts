import { CamelToTitleCasePipe } from './camel-to-title-case.pipe';

describe('CamelToTitleCasePipe', () => {
  it('create an instance', () => {
    const pipe = new CamelToTitleCasePipe();
    expect(pipe).toBeTruthy();
  });
});
