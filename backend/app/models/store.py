from datetime import datetime
from pydantic import ConfigDict
from app.models.base import ObjectDocument


class StoreDocument(ObjectDocument):
    model_config = ConfigDict(extra="allow")
    object_type: str = "store"
    id: int | None = None
    name: str | None = None
    organization_id: int | None = None
    employee_id: int | None = None
    owner_id: int | None = None
    address: str | None = None
    address_extra: str | None = None
    city: str | None = None
    state: str | None = None
    zip_code: str | None = None
    phone: str | None = None
    timezone: str | None = None
    archived: bool | None = None
    website: str | None = None
    logo_url: str | None = None
    logo_updated_at: datetime | None = None
    receipt_tagline: str | None = None
    package_provider: str | None = None
    packages_last_imported_at: datetime | None = None
    dek_ct: str | None = None
    last_full_package_check_at: datetime | None = None
    packages_last_definite_imported_at: datetime | None = None
    receipts_last_unlinked_detection_at: datetime | None = None
    store_id: int | None = None
    pin_length: int | None = None
    run_reports_at: datetime | None = None
    pricing_scheme: str | None = None
    label_printer_address: str | None = None
    enable_dare_mode: bool | None = None
    dare_mode_config: str | None = None
    enable_new_dashboard: bool | None = None
    allow_dashboard_selection: bool | None = None
    label_print_timing: str | None = None
    metrc_delay_mins: int | None = None
    use_split_pricing: bool | None = None
    use_weight_heavy: bool | None = None
    weight_heavy_quantity: float | None = None
    use_package_finish_threshold: bool | None = None
    package_finish_threshold: float | None = None
    use_pos_auto_logout: bool | None = None
    pos_auto_logout_minutes: int | None = None
    use_force_age_check: bool | None = None
    age_check: int | None = None
    open_cash_drawer_requires_manager: bool | None = None
    logout_after_sale: bool | None = None
    fetch_interval_minutes: int | None = None
    enable_paybotics: bool | None = None
    enable_receipt_print: bool | None = None
    setting_update_date: datetime | None = None
    menu_update_date: datetime | None = None
    icon_name: str | None = None
    active: bool | None = None
    screen_id: int | None = None
    sales_type_id: int | None = None
