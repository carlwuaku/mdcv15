import { DialogFormComponent } from 'src/app/shared/components/dialog-form/dialog-form.component';
import { RenewalComponent } from '../renewal.component';

// renewal.component.approveOnlineCerficates.spec.ts
// Manual mocks for Angular and RxJS dependencies
class MockMatDialog {
  open = jest.fn();
}
class MockActivatedRoute {
  snapshot = { params: { type: 'testType' } };
}
class MockRouter {
  navigate = jest.fn();
}
class MockObservable<T = any> {
  private _value: T;
  constructor(value: T) {
    this._value = value;
  }
  subscribe = jest.fn((handlers: any) => {
    if (handlers && handlers.next) handlers.next(this._value);
    if (handlers && handlers.complete) handlers.complete();
    return { unsubscribe: jest.fn() };
  });
  pipe = jest.fn(() => this);
}

// Mocked services
const mockAuthService = {} as unknown as jest.Mocked<any>;
const mockNotifyService = {
  successNotification: jest.fn(),
  failNotification: jest.fn(),
} as unknown as jest.Mocked<any>;
const mockRenewalService = {
  updateBulkRenewals: jest.fn(),
} as unknown as jest.Mocked<any>;
const mockAppService = {} as unknown as jest.Mocked<any>;

// Mock getToday and openHtmlInNewWindow
jest.mock('src/app/shared/utils/dates', () => {
  const actual = jest.requireActual('src/app/shared/utils/dates');
  return {
    ...actual,
    getToday: jest.fn(() => '2024-01-01') as any,
  };
});
jest.mock('src/app/shared/utils/helper', () => {
  const actual = jest.requireActual('src/app/shared/utils/helper');
  return {
    ...actual,
    openHtmlInNewWindow: jest.fn() as any,
  };
});
describe('RenewalComponent.approveOnlineCerficates() approveOnlineCerficates method', () => {
  let component: RenewalComponent;
  let mockDialog: MockMatDialog;
  let mockActivatedRoute: MockActivatedRoute;
  let mockRouter: MockRouter;

  beforeEach(() => {
    mockDialog = new MockMatDialog() as any;
    mockActivatedRoute = new MockActivatedRoute() as any;
    mockRouter = new MockRouter() as any;

    component = new RenewalComponent(
      mockAuthService as any,
      mockNotifyService as any,
      mockDialog as any,
      mockRenewalService as any,
      mockActivatedRoute as any,
      mockRouter as any,
      mockAppService as any
    );
    component.selectedItems = [
      {
        id: '1',
        license_uuid: 'lic-1',
        deleted_at: null,
        uuid: 'uuid-1',
        license_number: 'LN-001',
        deleted_by: '',
        deleted: '',
        modified_by: '',
        created_by: '',
        created_on: '',
        modified_on: '',
        receipt: '',
        qr_code: '',
        qr_text: '',
        expiry: '',
        status: 'Active',
        payment_date: '',
        payment_file: '',
        payment_file_date: '',
        picture: '',
        license_type: 'testType',
        print_template: 'template1',
        online_print_template: '',
        in_print_queue: false,
      },
    ];
  });

  // --- Happy Path Tests ---

  it('should open dialog and process form data, then call updateBulkRenewals and show success notification', () => {
    // This test ensures the full happy path: dialog returns data, updateBulkRenewals is called, and notifications are shown.

    // Arrange
    const afterClosedMock = new MockObservable([
      {
        name: 'online_print_template',
        value: 'templateA',
      },
      {
        name: 'online_certificate_start_date',
        value: '2024-01-01',
      },
      {
        name: 'online_certificate_end_date',
        value: '2024-12-31',
      },
    ]) as any;

    jest.mocked(mockDialog.open).mockReturnValue({
      afterClosed: () => afterClosedMock,
    } as any);

    jest
      .mocked(mockRenewalService.updateBulkRenewals)
      .mockReturnValue(new MockObservable({ message: 'ok', data: [] }) as any);

    // Act
    component.approveOnlineCerficates();

    // Assert
    expect(mockDialog.open).toHaveBeenCalledWith(
      DialogFormComponent,
      expect.objectContaining({
        data: expect.objectContaining({
          fields: expect.any(Array),
          title: expect.stringContaining(
            'Approve online/temporary certificates'
          ),
          formType: 'filter',
        }),
        height: '90vh',
        width: '90vw',
      }) as any
    );

    expect(mockRenewalService.updateBulkRenewals).toHaveBeenCalledWith(
      [
        expect.objectContaining({
          uuid: 'uuid-1',
          online_print_template: 'templateA',
          online_certificate_start_date: '2024-01-01',
          online_certificate_end_date: '2024-12-31',
          license_type: 'testType',
          license_number: 'LN-001',
          status: 'Active',
        }),
      ],
      ''
    );

    expect(mockNotifyService.successNotification).toHaveBeenCalledWith(
      'Items added to print queue'
    );
    expect(component.selectedItems).toEqual([]);
  });

  it('should handle multiple selectedItems and map each correctly', () => {
    // This test ensures that when multiple items are selected, each is mapped and sent to updateBulkRenewals.

    component.selectedItems = [
      {
        id: '1',
        license_uuid: 'lic-1',
        deleted_at: null,
        uuid: 'uuid-1',
        license_number: 'LN-001',
        deleted_by: '',
        deleted: '',
        modified_by: '',
        created_by: '',
        created_on: '',
        modified_on: '',
        receipt: '',
        qr_code: '',
        qr_text: '',
        expiry: '',
        status: 'Active',
        payment_date: '',
        payment_file: '',
        payment_file_date: '',
        picture: '',
        license_type: 'testType',
        print_template: 'template1',
        online_print_template: '',
        in_print_queue: false,
      },
      {
        id: '2',
        license_uuid: 'lic-2',
        deleted_at: null,
        uuid: 'uuid-2',
        license_number: 'LN-002',
        deleted_by: '',
        deleted: '',
        modified_by: '',
        created_by: '',
        created_on: '',
        modified_on: '',
        receipt: '',
        qr_code: '',
        qr_text: '',
        expiry: '',
        status: 'Active',
        payment_date: '',
        payment_file: '',
        payment_file_date: '',
        picture: '',
        license_type: 'testType',
        print_template: 'template2',
        online_print_template: '',
        in_print_queue: false,
      },
    ];

    const afterClosedMock = new MockObservable([
      { name: 'online_print_template', value: 'templateA' },
      { name: 'online_certificate_start_date', value: '2024-01-01' },
      { name: 'online_certificate_end_date', value: '2024-12-31' },
    ]) as any;

    jest.mocked(mockDialog.open).mockReturnValue({
      afterClosed: () => afterClosedMock,
    } as any);

    jest
      .mocked(mockRenewalService.updateBulkRenewals)
      .mockReturnValue(new MockObservable({ message: 'ok', data: [] }) as any);

    component.approveOnlineCerficates();

    expect(mockRenewalService.updateBulkRenewals).toHaveBeenCalledWith(
      [
        expect.objectContaining({
          uuid: 'uuid-1',
          online_print_template: 'templateA',
          online_certificate_start_date: '2024-01-01',
          online_certificate_end_date: '2024-12-31',
          license_type: 'testType',
          license_number: 'LN-001',
          status: 'Active',
        }),
        expect.objectContaining({
          uuid: 'uuid-2',
          online_print_template: 'templateA',
          online_certificate_start_date: '2024-01-01',
          online_certificate_end_date: '2024-12-31',
          license_type: 'testType',
          license_number: 'LN-002',
          status: 'Active',
        }),
      ],
      ''
    );
    expect(mockNotifyService.successNotification).toHaveBeenCalledWith(
      'Items added to print queue'
    );
    expect(component.selectedItems).toEqual([]);
  });

  // --- Edge Case Tests ---

  it('should show fail notification if dialog is closed without data', () => {
    // This test ensures that if the dialog is closed without returning data, failNotification is called.

    const afterClosedMock = new MockObservable(undefined) as any;

    jest.mocked(mockDialog.open).mockReturnValue({
      afterClosed: () => afterClosedMock,
    } as any);

    component.approveOnlineCerficates();

    expect(mockNotifyService.failNotification).toHaveBeenCalledWith(
      'Please provide the required data'
    );
    expect(mockRenewalService.updateBulkRenewals).not.toHaveBeenCalled();
    // selectedItems should remain unchanged
    expect(component.selectedItems.length).toBe(1);
  });

  it('should handle missing fields in form data gracefully', () => {
    // This test ensures that if some fields are missing in the form data, the mapping still works (values will be undefined).

    const afterClosedMock = new MockObservable([
      { name: 'online_print_template', value: 'templateA' },
      // missing start_date and end_date
    ]) as any;

    jest.mocked(mockDialog.open).mockReturnValue({
      afterClosed: () => afterClosedMock,
    } as any);

    jest
      .mocked(mockRenewalService.updateBulkRenewals)
      .mockReturnValue(new MockObservable({ message: 'ok', data: [] }) as any);

    component.approveOnlineCerficates();

    expect(mockRenewalService.updateBulkRenewals).toHaveBeenCalledWith(
      [
        expect.objectContaining({
          uuid: 'uuid-1',
          online_print_template: 'templateA',
          online_certificate_start_date: undefined,
          online_certificate_end_date: undefined,
          license_type: 'testType',
          license_number: 'LN-001',
          status: 'Active',
        }),
      ],
      ''
    );
    expect(mockNotifyService.successNotification).toHaveBeenCalledWith(
      'Items added to print queue'
    );
    expect(component.selectedItems).toEqual([]);
  });

  it('should not throw if selectedItems is empty', () => {
    // This test ensures that if selectedItems is empty, the dialog still opens and the rest of the flow works.

    component.selectedItems = [];

    const afterClosedMock = new MockObservable([
      { name: 'online_print_template', value: 'templateA' },
      { name: 'online_certificate_start_date', value: '2024-01-01' },
      { name: 'online_certificate_end_date', value: '2024-12-31' },
    ]) as any;

    jest.mocked(mockDialog.open).mockReturnValue({
      afterClosed: () => afterClosedMock,
    } as any);

    jest
      .mocked(mockRenewalService.updateBulkRenewals)
      .mockReturnValue(new MockObservable({ message: 'ok', data: [] }) as any);

    component.approveOnlineCerficates();

    // updateBulkRenewals should be called with an empty array
    expect(mockRenewalService.updateBulkRenewals).toHaveBeenCalledWith([], '');
    expect(mockNotifyService.successNotification).toHaveBeenCalledWith(
      'Items added to print queue'
    );
    expect(component.selectedItems).toEqual([]);
  });

  it('should call updateTimestamp after successful update', () => {
    // This test ensures that updateTimestamp is called after a successful update.

    const afterClosedMock = new MockObservable([
      { name: 'online_print_template', value: 'templateA' },
      { name: 'online_certificate_start_date', value: '2024-01-01' },
      { name: 'online_certificate_end_date', value: '2024-12-31' },
    ]) as any;

    jest.mocked(mockDialog.open).mockReturnValue({
      afterClosed: () => afterClosedMock,
    } as any);

    jest
      .mocked(mockRenewalService.updateBulkRenewals)
      .mockReturnValue(new MockObservable({ message: 'ok', data: [] }) as any);

    const updateTimestampSpy = jest.spyOn(component as any, 'updateTimestamp');

    component.approveOnlineCerficates();

    expect(updateTimestampSpy).toHaveBeenCalled();
  });

  it('should not call updateBulkRenewals if dialog.afterClosed is never called', () => {
    // This test ensures that if afterClosed is not called, updateBulkRenewals is not called.

    jest.mocked(mockDialog.open).mockReturnValue({
      afterClosed: jest.fn(), // does not call subscribe
    } as any);

    component.approveOnlineCerficates();

    expect(mockRenewalService.updateBulkRenewals).not.toHaveBeenCalled();
  });

  it('should handle updateBulkRenewals observable error gracefully', () => {
    // This test ensures that if updateBulkRenewals observable errors, the component does not throw.

    const afterClosedMock = new MockObservable([
      { name: 'online_print_template', value: 'templateA' },
      { name: 'online_certificate_start_date', value: '2024-01-01' },
      { name: 'online_certificate_end_date', value: '2024-12-31' },
    ]) as any;

    jest.mocked(mockDialog.open).mockReturnValue({
      afterClosed: () => afterClosedMock,
    } as any);

    // Simulate error in observable
    jest.mocked(mockRenewalService.updateBulkRenewals).mockReturnValue({
      subscribe: (handlers: any) => {
        if (handlers && handlers.error) handlers.error(new Error('fail'));
        return { unsubscribe: jest.fn() };
      },
      pipe: jest.fn(() => this),
    } as any);

    // Should not throw
    expect(() => component.approveOnlineCerficates()).not.toThrow();
    // No success notification should be called
    expect(mockNotifyService.successNotification).not.toHaveBeenCalled();
  });
});
