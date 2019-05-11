/**  Permissions for administrators and customers  */
export enum Permission {
    /**  The Authenticated role means simply that the user is logged in  */
    Authenticated = 'Authenticated',
    /**  SuperAdmin can perform the most sensitive tasks  */
    SuperAdmin = 'SuperAdmin',
    /**  Owner means the user owns this entity, e.g. a Customer's own Order */
    Owner = 'Owner',
    /**  Public means any unauthenticated user may perform the operation  */
    Public = 'Public',
    CreateCatalog = 'CreateCatalog',
    ReadCatalog = 'ReadCatalog',
    UpdateCatalog = 'UpdateCatalog',
    DeleteCatalog = 'DeleteCatalog',
    CreateCustomer = 'CreateCustomer',
    ReadCustomer = 'ReadCustomer',
    UpdateCustomer = 'UpdateCustomer',
    DeleteCustomer = 'DeleteCustomer',
    CreateAdministrator = 'CreateAdministrator',
    ReadAdministrator = 'ReadAdministrator',
    UpdateAdministrator = 'UpdateAdministrator',
    DeleteAdministrator = 'DeleteAdministrator',
    CreateSettings = 'CreateSettings',
    ReadSettings = 'ReadSettings',
    UpdateSettings = 'UpdateSettings',
    DeleteSettings = 'DeleteSettings',
}
