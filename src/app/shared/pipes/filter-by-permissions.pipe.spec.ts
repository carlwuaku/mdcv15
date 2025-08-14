import { FilterByPermissionsPipe } from './filter-by-permissions.pipe';

describe('FilterByPermissionsPipe', () => {
  it('create an instance', () => {
    const pipe = new FilterByPermissionsPipe();
    expect(pipe).toBeTruthy();
  });
});
