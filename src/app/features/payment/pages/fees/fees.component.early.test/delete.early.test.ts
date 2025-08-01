import { FeesComponent } from '../fees.component';

// fees.component.delete.spec.ts
import { of, throwError } from 'rxjs';
import { CpdService } from 'src/app/features/payment/pages/fees/cpd.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

// fees.component.delete.spec.ts
describe('FeesComponent.delete() delete method', () => {
  let component: FeesComponent;
  let mockCpdService: jest.Mocked<CpdService>;
  let mockNotify: jest.Mocked<NotifyService>;
  let confirmSpy: jest.SpyInstance;

  const mockObject = { id: 1, name: 'Test Provider' };

  beforeEach(() => {
    mockCpdService = {
      deleteCpdProvider: jest.fn(),
    } as any;

    mockNotify = {
      successNotification: jest.fn(),
    } as any;

    component = new FeesComponent(mockCpdService, mockNotify);

    // By default, window.confirm returns true
    confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  afterEach(() => {
    jest.clearAllMocks();
    confirmSpy.mockRestore();
  });

  // Happy Path Tests
  it('should call cpdService.deleteCpdProvider and notify.successNotification when user confirms deletion', () => {
    // This test ensures the delete method works as expected when the user confirms the deletion.
    const response = { message: 'Deleted successfully' };
    mockCpdService.deleteCpdProvider.mockReturnValue(of(response));

    const updateTimestampSpy = jest.spyOn(component, 'updateTimestamp');

    component.delete(mockObject);

    expect(window.confirm).toHaveBeenCalledWith(
      'Are you sure you want to delete this provider? You will not be able to restore it. Note that you cannot delete a provider with associated CPD activities'
    );
    expect(mockCpdService.deleteCpdProvider).toHaveBeenCalledWith(mockObject);
    expect(mockNotify.successNotification).toHaveBeenCalledWith(
      response.message
    );
    expect(updateTimestampSpy).toHaveBeenCalled();
  });

  it('should call updateTimestamp after successful deletion', () => {
    // This test ensures updateTimestamp is called after a successful deletion.
    mockCpdService.deleteCpdProvider.mockReturnValue(
      of({ message: 'Deleted' })
    );
    const updateTimestampSpy = jest.spyOn(component, 'updateTimestamp');

    component.delete(mockObject);

    expect(updateTimestampSpy).toHaveBeenCalled();
  });

  // Edge Case Tests
  it('should not call cpdService.deleteCpdProvider if user cancels the confirmation dialog', () => {
    // This test ensures that if the user cancels the confirmation, no deletion occurs.
    confirmSpy.mockImplementation(() => false);

    component.delete(mockObject);

    expect(window.confirm).toHaveBeenCalled();
    expect(mockCpdService.deleteCpdProvider).not.toHaveBeenCalled();
    expect(mockNotify.successNotification).not.toHaveBeenCalled();
  });

  it('should handle error from cpdService.deleteCpdProvider gracefully', () => {
    // This test ensures that if the service throws an error, the method handles it without crashing.
    mockCpdService.deleteCpdProvider.mockReturnValue(
      throwError(() => new Error('Delete failed'))
    );

    // No error notification is expected as per the implementation
    expect(() => component.delete(mockObject)).not.toThrow();
    expect(mockCpdService.deleteCpdProvider).toHaveBeenCalledWith(mockObject);
    expect(mockNotify.successNotification).not.toHaveBeenCalled();
  });

  it('should work with objects having different properties', () => {
    // This test ensures the method works with objects that have additional or different properties.
    const anotherObject = { id: 2, name: 'Another', extra: 'field' };
    mockCpdService.deleteCpdProvider.mockReturnValue(
      of({ message: 'Deleted' })
    );

    component.delete(anotherObject as any);

    expect(mockCpdService.deleteCpdProvider).toHaveBeenCalledWith(
      anotherObject
    );
    expect(mockNotify.successNotification).toHaveBeenCalledWith('Deleted');
  });

  it('should not call notify.successNotification or updateTimestamp on error', () => {
    // This test ensures that on error, no success notification or timestamp update occurs.
    mockCpdService.deleteCpdProvider.mockReturnValue(
      throwError(() => new Error('Delete failed'))
    );
    const updateTimestampSpy = jest.spyOn(component, 'updateTimestamp');

    component.delete(mockObject);

    expect(mockNotify.successNotification).not.toHaveBeenCalled();
    expect(updateTimestampSpy).not.toHaveBeenCalled();
  });
});
