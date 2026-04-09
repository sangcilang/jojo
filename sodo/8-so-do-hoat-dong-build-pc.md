# Sơ Đồ Hoạt Động - Build PC Thông Minh

```mermaid
flowchart TD
    Start([User vào Build PC]) --> ShowForm[Hiển thị form<br/>Build PC thông minh]
    
    ShowForm --> EnterBudget[Nhập ngân sách<br/>VD: 20,000,000đ]
    
    EnterBudget --> SelectPurpose[Chọn mục đích sử dụng]
    
    SelectPurpose --> PurposeOptions{Chọn mục đích}
    PurposeOptions -->|Văn phòng| SetOffice[office:<br/>CPU, Mainboard, RAM,<br/>SSD, Case, PSU, Monitor]
    PurposeOptions -->|Gaming cơ bản| SetBasicGaming[basicGaming:<br/>+ GPU, Cooling]
    PurposeOptions -->|Gaming nặng| SetHeavyGaming[heavyGaming:<br/>+ GPU cao cấp, Cooling]
    PurposeOptions -->|IT/Dev| SetIT[it:<br/>+ HDD, Cooling]
    PurposeOptions -->|Content Creator| SetContent[content:<br/>+ GPU, Cooling, Accessory]
    
    SetOffice --> BuildConfig
    SetBasicGaming --> BuildConfig
    SetHeavyGaming --> BuildConfig
    SetIT --> BuildConfig
    SetContent --> BuildConfig[Xây dựng cấu hình]
    
    BuildConfig --> CalcBudget[Tính toán:<br/>maxPerCategory = budget / số danh mục]
    
    CalcBudget --> LoopCategories[Duyệt qua từng danh mục]
    
    LoopCategories --> FilterProducts[Lọc sản phẩm:<br/>- Thuộc danh mục<br/>- Giá <= maxPerCategory * 2]
    
    FilterProducts --> SortByPrice[Sắp xếp theo giá<br/>giảm dần]
    
    SortByPrice --> SelectProduct[Chọn sản phẩm phù hợp:<br/>- Giá <= maxPerCategory<br/>- Hoặc rẻ nhất nếu không có]
    
    SelectProduct --> AddToList[Thêm vào danh sách<br/>cấu hình]
    
    AddToList --> CheckMoreCategories{Còn danh mục<br/>nào không?}
    CheckMoreCategories -->|Có| LoopCategories
    CheckMoreCategories -->|Không| CalcTotal[Tính tổng tiền<br/>cấu hình]
    
    CalcTotal --> CheckBudget{Tổng tiền<br/>> ngân sách?}
    
    CheckBudget -->|Có| OptimizeConfig[Tối ưu cấu hình:<br/>- Sắp xếp theo giá<br/>- Loại bỏ item đắt nhất<br/>- Giữ tối thiểu 6 item]
    OptimizeConfig --> RecalcTotal[Tính lại tổng]
    RecalcTotal --> CheckBudget
    
    CheckBudget -->|Không| ShowResult[Hiển thị kết quả:<br/>- Danh sách linh kiện<br/>- Tổng tiền<br/>- Chênh lệch ngân sách]
    
    ShowResult --> UserDecision{User<br/>quyết định}
    
    UserDecision -->|Thêm vào giỏ| ClearCart[Xóa giỏ hàng hiện tại]
    ClearCart --> AddAllToCart[Thêm tất cả linh kiện<br/>vào giỏ hàng]
    AddAllToCart --> CallAPI[POST /api/pc-builder<br/>{budget, purpose}]
    CallAPI --> APISuccess{API<br/>thành công?}
    APISuccess -->|Có| UpdateCart[Cập nhật giỏ hàng]
    UpdateCart --> ShowSuccess[Hiển thị thông báo<br/>thành công]
    ShowSuccess --> RedirectCart[Chuyển đến<br/>trang giỏ hàng]
    RedirectCart --> End([Kết thúc])
    
    APISuccess -->|Không| ShowError[Hiển thị lỗi]
    ShowError --> ShowResult
    
    UserDecision -->|Điều chỉnh| AdjustBudget{Điều chỉnh<br/>gì?}
    AdjustBudget -->|Ngân sách| EnterBudget
    AdjustBudget -->|Mục đích| SelectPurpose
    
    UserDecision -->|Hủy| Cancel[Quay lại trang chủ]
    Cancel --> End
    
    style Start fill:#c8e6c9
    style End fill:#ffcdd2
    style PurposeOptions fill:#fff9c4
    style CheckMoreCategories fill:#fff9c4
    style CheckBudget fill:#fff9c4
    style UserDecision fill:#fff9c4
    style APISuccess fill:#fff9c4
    style AdjustBudget fill:#fff9c4
    style SetOffice fill:#e1f5ff
    style SetBasicGaming fill:#e1f5ff
    style SetHeavyGaming fill:#e1f5ff
    style SetIT fill:#e1f5ff
    style SetContent fill:#e1f5ff
    style UpdateCart fill:#c8e6c9
```
