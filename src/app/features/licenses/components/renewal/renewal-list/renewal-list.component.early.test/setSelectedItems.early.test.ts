import { RenewalListComponent } from '../renewal-list.component';

// renewal-list.component.setSelectedItems.spec.ts
describe('RenewalListComponent.setSelectedItems() setSelectedItems method', () => {
  // Happy Paths
  describe('Happy Paths', () => {
    it('should set selectedItems to the provided array of RenewalObject', () => {
      // This test aims to verify that setSelectedItems correctly assigns the provided array to selectedItems.
      const component = new RenewalListComponent(
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any
      );
      const items: RenewalObject[] = [
        { uuid: '1', name: 'Renewal 1' } as RenewalObject,
        { uuid: '2', name: 'Renewal 2' } as RenewalObject,
      ];

      component.setSelectedItems(items);

      expect(component.selectedItems).toBe(items);
      expect(component.selectedItems.length).toBe(2);
      expect(component.selectedItems[0].uuid).toBe('1');
      expect(component.selectedItems[1].uuid).toBe('2');
    });

    it('should replace existing selectedItems with new array', () => {
      // This test aims to ensure that setSelectedItems overwrites any previous selection.
      const component = new RenewalListComponent(
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any
      );
      component.selectedItems = [
        { uuid: 'old', name: 'Old Renewal' } as RenewalObject,
      ];
      const newItems: RenewalObject[] = [
        { uuid: 'new1', name: 'New Renewal 1' } as RenewalObject,
        { uuid: 'new2', name: 'New Renewal 2' } as RenewalObject,
      ];

      component.setSelectedItems(newItems);

      expect(component.selectedItems).toBe(newItems);
      expect(component.selectedItems.length).toBe(2);
      expect(component.selectedItems[0].uuid).toBe('new1');
    });

    it('should allow setting selectedItems to an empty array', () => {
      // This test aims to verify that setSelectedItems can clear the selection by setting an empty array.
      const component = new RenewalListComponent(
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any
      );
      component.selectedItems = [
        { uuid: '1', name: 'Renewal 1' } as RenewalObject,
      ];

      component.setSelectedItems([]);

      expect(component.selectedItems).toEqual([]);
      expect(component.selectedItems.length).toBe(0);
    });

    it('should work with a single RenewalObject in the array', () => {
      // This test aims to verify that setSelectedItems works with a single-item array.
      const component = new RenewalListComponent(
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any
      );
      const singleItem: RenewalObject[] = [
        { uuid: 'single', name: 'Single Renewal' } as RenewalObject,
      ];

      component.setSelectedItems(singleItem);

      expect(component.selectedItems).toBe(singleItem);
      expect(component.selectedItems.length).toBe(1);
      expect(component.selectedItems[0].uuid).toBe('single');
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    it('should handle being called with an empty array when selectedItems is already empty', () => {
      // This test aims to verify that setSelectedItems does not throw or misbehave when both the input and current selectedItems are empty.
      const component = new RenewalListComponent(
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any
      );
      component.selectedItems = [];

      component.setSelectedItems([]);

      expect(component.selectedItems).toEqual([]);
      expect(component.selectedItems.length).toBe(0);
    });

    it('should handle being called multiple times in succession with different arrays', () => {
      // This test aims to verify that setSelectedItems can be called repeatedly and always reflects the latest input.
      const component = new RenewalListComponent(
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any
      );
      const first: RenewalObject[] = [
        { uuid: 'a', name: 'A' } as RenewalObject,
      ];
      const second: RenewalObject[] = [
        { uuid: 'b', name: 'B' } as RenewalObject,
        { uuid: 'c', name: 'C' } as RenewalObject,
      ];

      component.setSelectedItems(first);
      expect(component.selectedItems).toBe(first);

      component.setSelectedItems(second);
      expect(component.selectedItems).toBe(second);
      expect(component.selectedItems.length).toBe(2);
    });

    it('should allow setting selectedItems to a new array with the same objects as before', () => {
      // This test aims to verify that setSelectedItems does not care about array identity, only assignment.
      const component = new RenewalListComponent(
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any
      );
      const obj: RenewalObject = { uuid: 'x', name: 'X' } as RenewalObject;
      const arr1 = [obj];
      const arr2 = [obj];

      component.setSelectedItems(arr1);
      expect(component.selectedItems).toBe(arr1);

      component.setSelectedItems(arr2);
      expect(component.selectedItems).toBe(arr2);
      expect(component.selectedItems[0]).toBe(obj);
    });

    it('should not mutate the input array', () => {
      // This test aims to verify that setSelectedItems does not modify the input array (although it assigns it directly).
      const component = new RenewalListComponent(
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any
      );
      const input: RenewalObject[] = [
        { uuid: '1', name: 'Test' } as RenewalObject,
      ];

      component.setSelectedItems(input);

      expect(input).toEqual([{ uuid: '1', name: 'Test' }]);
      expect(component.selectedItems).toBe(input);
    });
  });
});
