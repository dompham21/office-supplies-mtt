USE [master]
GO
/****** Object:  Database [office_supplies]    Script Date: 9/30/2023 9:23:52 PM ******/
CREATE DATABASE [office_supplies]
GO
ALTER DATABASE [office_supplies] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [office_supplies].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [office_supplies] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [office_supplies] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [office_supplies] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [office_supplies] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [office_supplies] SET ARITHABORT OFF 
GO
ALTER DATABASE [office_supplies] SET AUTO_CLOSE ON 
GO
ALTER DATABASE [office_supplies] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [office_supplies] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [office_supplies] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [office_supplies] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [office_supplies] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [office_supplies] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [office_supplies] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [office_supplies] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [office_supplies] SET  ENABLE_BROKER 
GO
ALTER DATABASE [office_supplies] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [office_supplies] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [office_supplies] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [office_supplies] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [office_supplies] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [office_supplies] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [office_supplies] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [office_supplies] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [office_supplies] SET  MULTI_USER 
GO
ALTER DATABASE [office_supplies] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [office_supplies] SET DB_CHAINING OFF 
GO
ALTER DATABASE [office_supplies] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [office_supplies] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [office_supplies] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [office_supplies] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [office_supplies] SET QUERY_STORE = ON
GO
ALTER DATABASE [office_supplies] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [office_supplies]
GO
/****** Object:  UserDefinedFunction [dbo].[FUNC_LAY_GIA_SAN_PHAM]    Script Date: 9/30/2023 9:23:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[FUNC_LAY_GIA_SAN_PHAM] (@MA_SP VARCHAR(10))
    RETURNS FLOAT
AS
BEGIN
    
    DECLARE @GIA FLOAT = 0
    
    SELECT TOP 1 @GIA = PH.price FROM [dbo].[price_history] PH
    WHERE PH.apply_at <= GETDATE() AND PH.product_id = @MA_SP
    ORDER BY ph.apply_at DESC;
   
    RETURN @GIA
END
GO
/****** Object:  UserDefinedFunction [dbo].[FUNC_LAY_GIA_SAN_PHAM_CAO_NHAT]    Script Date: 9/30/2023 9:23:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[FUNC_LAY_GIA_SAN_PHAM_CAO_NHAT] ()
    RETURNS FLOAT
AS
BEGIN
    
    DECLARE @GIA FLOAT = 0;
   
    SELECT TOP 1 @GIA = ISNULL(price,0)
    FROM [dbo].[price_history]
    ORDER BY [price] DESC;

    RETURN @GIA
END
GO
/****** Object:  UserDefinedFunction [dbo].[FUNC_LAY_SL_BAN_SAN_PHAM]    Script Date: 9/30/2023 9:23:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[FUNC_LAY_SL_BAN_SAN_PHAM] (@MA_SP VARCHAR(10))
    RETURNS INT
AS
BEGIN
    
    DECLARE @SL INT
   
    SET @SL = (SELECT ISNULL(SUM(quantity - ISNULL(quantity_return, 0)),0) AS sold_quantity FROM (
        SELECT id FROM dbo.the_order WHERE status_id NOT IN (
                                SELECT id FROM dbo.the_order_status WHERE name LIKE N'%huỷ%' OR name LIKE N'%chờ thanh toán%'
                            ) 
        ) AS DH 
        INNER JOIN (
            SELECT order_id, product_id, quantity, quantity_return FROM dbo.the_order_detail
            ) AS CTDH 
        ON DH.id = CTDH.order_id AND product_id = @MA_SP
    )
   

    RETURN @SL
END
GO
/****** Object:  UserDefinedFunction [dbo].[FUNC_TINH_GIA_TRI_DON_HANG]    Script Date: 9/30/2023 9:23:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[FUNC_TINH_GIA_TRI_DON_HANG] (@MA_DH INT)
    RETURNS FLOAT
AS
BEGIN
    
    DECLARE @total FLOAT
   
    SET @total = (SELECT SUM((quantity - ISNULL(quantity_return, 0)) * unit_price) FROM [dbo].[the_order_detail] WHERE order_id = @MA_DH)
    
    RETURN @total
END
GO
/****** Object:  Table [dbo].[account]    Script Date: 9/30/2023 9:23:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[account](
	[email] [varchar](64) NOT NULL,
	[password] [nvarchar](100) NOT NULL,
	[role_id] [int] NOT NULL,
	[is_active] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[brand]    Script Date: 9/30/2023 9:23:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[brand](
	[id] [VARCHAR](10) NOT NULL,
	[description] [nvarchar](100) NOT NULL,
	[image] [varchar](200) NOT NULL,
	[is_active] [bit] NOT NULL,
	[name] [nvarchar](50) NOT NULL,
	[created_at] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[carts]    Script Date: 9/30/2023 9:23:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[carts](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[quantity] [int] NOT NULL,
	[customer_id] [int] NOT NULL,
	[product_id] [VARCHAR](10) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[category]    Script Date: 9/30/2023 9:23:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[category](
	[id] [VARCHAR](10) NOT NULL,
	[description] [nvarchar](100) NOT NULL,
	[image] [varchar](200) NOT NULL,
	[is_active] [bit] NOT NULL,
	[name] [nvarchar](50) NOT NULL,
	[created_at] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[customer]    Script Date: 9/30/2023 9:23:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[customer](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[avatar] [varchar](200) NULL,
	[birthday] [datetime] NULL,
	[gender] [nvarchar](3) NULL,
	[name] [nvarchar](50) NOT NULL,
	[phone] [varchar](11) NULL,
	[created_at] [datetime] NOT NULL,
	[email] [varchar](64) NOT NULL,
	[address] [nvarchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[image_product]    Script Date: 9/30/2023 9:23:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[image_product](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[path] [varchar](200) NOT NULL,
	[product_id] [VARCHAR](10) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[invoice]    Script Date: 9/30/2023 9:23:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[invoice](
	[id] [VARCHAR](10) NOT NULL,
	[created_at] [datetime] NOT NULL,
	[name] [nvarchar](50) NOT NULL,
	[tax_code] [varchar](13) NOT NULL,
	[the_order_id] [int] NOT NULL,
	[staff_id] [VARCHAR](10) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[poster]    Script Date: 9/30/2023 9:23:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[poster](
	[id] [VARCHAR](10) NOT NULL,
	[image] [varchar](200) NOT NULL,
	[is_active] [bit] NOT NULL,
	[name] [nvarchar](20) NOT NULL,
	[type] [int] NOT NULL,
	[staff_id] [VARCHAR](10) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[price_history]    Script Date: 9/30/2023 9:23:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[price_history](
	[apply_at] [datetime] NOT NULL,
	[product_id] [VARCHAR](10) NOT NULL,
	[staff_id] [VARCHAR](10) NOT NULL,
	[created_at] [datetime] NOT NULL,
	[price] [float] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[apply_at] ASC,
	[product_id] ASC,
	[staff_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[product]    Script Date: 9/30/2023 9:23:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[product](
	[id] [VARCHAR](10) NOT NULL,
	[description] [nvarchar](max) NOT NULL,
	[in_stock] [int] NOT NULL,
	[is_active] [bit] NOT NULL,
	[name] [nvarchar](50) NOT NULL,
	[created_at] [datetime] NOT NULL,
	[brand_id] [VARCHAR](10) NOT NULL,
	[category_id] [VARCHAR](10) NOT NULL,
	[supply_id] [VARCHAR](10) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[promotion]    Script Date: 9/30/2023 9:23:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[promotion](
	[id] [VARCHAR](10) NOT NULL,
	[end_at] [datetime] NOT NULL,
	[reason] [nvarchar](100) NOT NULL,
	[start_at] [datetime] NOT NULL,
	[staff_id] [VARCHAR](10) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[promotion_detail]    Script Date: 9/30/2023 9:23:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[promotion_detail](
	[percentage] [int] NOT NULL,
	[product_id] [VARCHAR](10) NOT NULL,
	[promotion_id] [VARCHAR](10) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[product_id] ASC,
	[promotion_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[purchase_order]    Script Date: 9/30/2023 9:23:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[purchase_order](
	[id] [VARCHAR](10) NOT NULL,
	[created_at] [datetime] NOT NULL,
	[staff_id] [VARCHAR](10) NOT NULL,
	[supplier_id] [VARCHAR](10) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[purchase_order_detail]    Script Date: 9/30/2023 9:23:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[purchase_order_detail](
	[product_id] [VARCHAR](10) NOT NULL,
	[purchase_order_id] [VARCHAR](10) NOT NULL,
	[quantity] [int] NOT NULL,
	[unit_price] [float] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[product_id] ASC,
	[purchase_order_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[receipt]    Script Date: 9/30/2023 9:23:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[receipt](
	[id] [VARCHAR](10) NOT NULL,
	[created_at] [datetime] NOT NULL,
	[purchase_order_id] [VARCHAR](10) NOT NULL,
	[staff_id] [VARCHAR](10) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[receipt_detail]    Script Date: 9/30/2023 9:23:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[receipt_detail](
	[product_id] [VARCHAR](10) NOT NULL,
	[receipt_id] [VARCHAR](10) NOT NULL,
	[quantity] [int] NOT NULL,
	[unit_price] [float] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[product_id] ASC,
	[receipt_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[return_product]    Script Date: 9/30/2023 9:23:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[return_product](
	[id] [VARCHAR](10) NOT NULL,
	[created_at] [datetime] NOT NULL,
	[invoice_id] [VARCHAR](10) NOT NULL,
	[staff_id] [VARCHAR](10) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[review]    Script Date: 9/30/2023 9:23:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[review](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[comment] [nvarchar](100) NOT NULL,
	[created_at] [datetime] NOT NULL,
	[vote] [int] NOT NULL,
	[customer_id] [int] NOT NULL,
	[product_id] [VARCHAR](10) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[role]    Script Date: 9/30/2023 9:23:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[role](
	[id_role] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](20) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id_role] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[staff]    Script Date: 9/30/2023 9:23:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[staff](
	[id] [VARCHAR](10) NOT NULL,
	[address] [nvarchar](100) NOT NULL,
	[avatar] [varchar](200) NOT NULL,
	[gender] [nvarchar](4) NOT NULL,
	[name] [nvarchar](50) NOT NULL,
	[phone] [nvarchar](11) NOT NULL,
	[created_at] [datetime] NOT NULL,
	[email] [varchar](64) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[supplier]    Script Date: 9/30/2023 9:23:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[supplier](
	[id] [VARCHAR](10) NOT NULL,
	[address] [nvarchar](100) NOT NULL,
	[email] [nvarchar](64) NOT NULL,
	[is_active] [bit] NOT NULL,
	[name] [nvarchar](50) NOT NULL,
	[phone] [varchar](11) NOT NULL,
	[created_at] [datetime] NOT NULL,
	[website] [varchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[the_order]    Script Date: 9/30/2023 9:23:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[the_order](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[address] [nvarchar](100) NOT NULL,
	[created_at] [datetime] NOT NULL,
	[payment_id] [nvarchar](100) NOT NULL,
	[received_at] [datetime] NULL,
	[customer_id] [int] NOT NULL,
	[staff_approve_id] [VARCHAR](10) NULL,
	[staff_deliver_id] [VARCHAR](10) NULL,
	[status_id] [int] NOT NULL,
	[name] [nvarchar](100) NOT NULL,
	[phone] [varchar](11) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[the_order_detail]    Script Date: 9/30/2023 9:23:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[the_order_detail](
	[order_id] [int] NOT NULL,
	[product_id] [VARCHAR](10) NOT NULL,
	[quantity] [int] NOT NULL,
	[quantity_return] [int] NULL,
	[unit_price] [float] NOT NULL,
	[return_id] [VARCHAR](10) NULL,
PRIMARY KEY CLUSTERED 
(
	[order_id] ASC,
	[product_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[the_order_status]    Script Date: 9/30/2023 9:23:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[the_order_status](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](20) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[the_order_reason_cancel](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

INSERT [dbo].[account] ([email], [password], [role_id], [is_active]) VALUES (N'admin@admin.com', N'$2a$10$wHj3sRVs41pkF53BTRAERuF.dmocgNdmAsCBlcYwzuah0vOx/UGRS', 1, 1)
INSERT [dbo].[account] ([email], [password], [role_id], [is_active]) VALUES (N'staff@shipper.com', N'$2a$10$wHj3sRVs41pkF53BTRAERuF.dmocgNdmAsCBlcYwzuah0vOx/UGRS', 3, 1)

GO
SET IDENTITY_INSERT [dbo].[role] ON 

INSERT [dbo].[role] ([id_role], [name]) VALUES (1, N'ADMIN')
INSERT [dbo].[role] ([id_role], [name]) VALUES (3, N'SHIPPER')
INSERT [dbo].[role] ([id_role], [name]) VALUES (2, N'USER')
SET IDENTITY_INSERT [dbo].[role] OFF

GO
INSERT [dbo].[staff] ([id], [address], [avatar], [gender], [name], [phone], [created_at], [email]) VALUES (N'STAFF01   ', N'Quảng Trị', N'https://res.cloudinary.com/dmriwkfll/image/upload/v1656155271/f0w0qgwpe8wxo1ceafhm.jpg', N'nam', N'Văn Ngọc Dũng', N'0977777777', CAST(N'2023-07-08T22:59:59.000' AS DateTime), N'admin@admin.com')
INSERT [dbo].[staff] ([id], [address], [avatar], [gender], [name], [phone], [created_at], [email]) VALUES (N'STAFF02   ', N'Quảng Trị', N'https://res.cloudinary.com/dmriwkfll/image/upload/v1656155271/f0w0qgwpe8wxo1ceafhm.jpg', N'nam', N'Ngọc Dũng', N'0977777778', CAST(N'2023-07-22T10:40:14.000' AS DateTime), N'staff@shipper.com')
GO
SET IDENTITY_INSERT [dbo].[the_order_status] ON 

INSERT [dbo].[the_order_status] ([id], [name]) VALUES (2, N'Chờ duyệt')
INSERT [dbo].[the_order_status] ([id], [name]) VALUES (1, N'Chờ thanh toán')
INSERT [dbo].[the_order_status] ([id], [name]) VALUES (5, N'Đã huỷ')
INSERT [dbo].[the_order_status] ([id], [name]) VALUES (3, N'Đang giao')
INSERT [dbo].[the_order_status] ([id], [name]) VALUES (4, N'Hoàn thành')
SET IDENTITY_INSERT [dbo].[the_order_status] ON 

GO
SET ANSI_PADDING ON
GO

INSERT INTO [dbo].[the_order_reason_cancel] ([name]) VALUES (N'Muốn thay đổi sản phẩm');
INSERT INTO [dbo].[the_order_reason_cancel] ([name]) VALUES (N'Tìm thấy chỗ mua khác tốt hơn');
INSERT INTO [dbo].[the_order_reason_cancel] ([name]) VALUES (N'Không có nhu cầu mua nữa');
INSERT INTO [dbo].[the_order_reason_cancel] ([name]) VALUES (N'Phí vận chuyển cao');
INSERT INTO [dbo].[the_order_reason_cancel] ([name]) VALUES (N'Khác');
/****** Object:  Index [UK_rdxh7tq2xs66r485cc8dkxt77]    Script Date: 9/30/2023 9:23:52 PM ******/
ALTER TABLE [dbo].[brand] ADD  CONSTRAINT [UK_rdxh7tq2xs66r485cc8dkxt77] UNIQUE NONCLUSTERED 
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UK_46ccwnsi9409t36lurvtyljak]    Script Date: 9/30/2023 9:23:52 PM ******/
ALTER TABLE [dbo].[category] ADD  CONSTRAINT [UK_46ccwnsi9409t36lurvtyljak] UNIQUE NONCLUSTERED 
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_customer]    Script Date: 9/30/2023 9:23:52 PM ******/
ALTER TABLE [dbo].[customer] ADD  CONSTRAINT [IX_customer] UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_invoice]    Script Date: 9/30/2023 9:23:52 PM ******/
ALTER TABLE [dbo].[invoice] ADD  CONSTRAINT [IX_invoice] UNIQUE NONCLUSTERED 
(
	[the_order_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UK_s1ik5vng7bbm4ql0fa722blbi]    Script Date: 9/30/2023 9:23:52 PM ******/
ALTER TABLE [dbo].[poster] ADD  CONSTRAINT [UK_s1ik5vng7bbm4ql0fa722blbi] UNIQUE NONCLUSTERED 
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UK_jmivyxk9rmgysrmsqw15lqr5b]    Script Date: 9/30/2023 9:23:52 PM ******/
ALTER TABLE [dbo].[product] ADD  CONSTRAINT [UK_jmivyxk9rmgysrmsqw15lqr5b] UNIQUE NONCLUSTERED 
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_receipt]    Script Date: 9/30/2023 9:23:52 PM ******/
ALTER TABLE [dbo].[receipt] ADD  CONSTRAINT [IX_receipt] UNIQUE NONCLUSTERED 
(
	[purchase_order_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_return_product]    Script Date: 9/30/2023 9:23:52 PM ******/
ALTER TABLE [dbo].[return_product] ADD  CONSTRAINT [IX_return_product] UNIQUE NONCLUSTERED 
(
	[invoice_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UK_8sewwnpamngi6b1dwaa88askk]    Script Date: 9/30/2023 9:23:52 PM ******/
ALTER TABLE [dbo].[role] ADD  CONSTRAINT [UK_8sewwnpamngi6b1dwaa88askk] UNIQUE NONCLUSTERED 
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_staff]    Script Date: 9/30/2023 9:23:52 PM ******/
ALTER TABLE [dbo].[staff] ADD  CONSTRAINT [IX_staff] UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UK_c3fclhmodftxk4d0judiafwi3]    Script Date: 9/30/2023 9:23:52 PM ******/
ALTER TABLE [dbo].[supplier] ADD  CONSTRAINT [UK_c3fclhmodftxk4d0judiafwi3] UNIQUE NONCLUSTERED 
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UK_g7qiwwu4vpciysmeeyme9gg1d]    Script Date: 9/30/2023 9:23:52 PM ******/
ALTER TABLE [dbo].[supplier] ADD  CONSTRAINT [UK_g7qiwwu4vpciysmeeyme9gg1d] UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UK_4d6tkkxot3yh5netgb60cnbug]    Script Date: 9/30/2023 9:23:52 PM ******/
ALTER TABLE [dbo].[the_order_status] ADD  CONSTRAINT [UK_4d6tkkxot3yh5netgb60cnbug] UNIQUE NONCLUSTERED 
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[account] ADD  CONSTRAINT [DEFAULT_account_is_active]  DEFAULT ((1)) FOR [is_active]
GO
ALTER TABLE [dbo].[brand] ADD  CONSTRAINT [DEFAULT_brand_is_active]  DEFAULT ((1)) FOR [is_active]
GO
ALTER TABLE [dbo].[brand] ADD  CONSTRAINT [DEFAULT_brand_created_at]  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[category] ADD  CONSTRAINT [DEFAULT_category_is_active]  DEFAULT ((1)) FOR [is_active]
GO
ALTER TABLE [dbo].[category] ADD  CONSTRAINT [DEFAULT_category_created_at]  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[customer] ADD  CONSTRAINT [DEFAULT_customer_created_at]  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[invoice] ADD  CONSTRAINT [DEFAULT_invoice_created_at]  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[poster] ADD  CONSTRAINT [DEFAULT_poster_is_active]  DEFAULT ((1)) FOR [is_active]
GO
ALTER TABLE [dbo].[product] ADD  CONSTRAINT [DEFAULT_product_is_active]  DEFAULT ((1)) FOR [is_active]
GO
ALTER TABLE [dbo].[product] ADD  CONSTRAINT [DEFAULT_product_created_at]  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[purchase_order] ADD  CONSTRAINT [DEFAULT_purchase_order_created_at]  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[receipt] ADD  CONSTRAINT [DEFAULT_receipt_created_at]  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[return_product] ADD  CONSTRAINT [DEFAULT_return_product_created_at]  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[review] ADD  CONSTRAINT [DEFAULT_review_created_at]  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[staff] ADD  CONSTRAINT [DEFAULT_staff_created_at]  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[supplier] ADD  CONSTRAINT [DEFAULT_supplier_is_active]  DEFAULT ((1)) FOR [is_active]
GO
ALTER TABLE [dbo].[supplier] ADD  CONSTRAINT [DEFAULT_supplier_created_at]  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[the_order] ADD  CONSTRAINT [DEFAULT_the_order_created_at]  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[account]  WITH NOCHECK ADD  CONSTRAINT [FKd4vb66o896tay3yy52oqxr9w0] FOREIGN KEY([role_id])
REFERENCES [dbo].[role] ([id_role])
ON UPDATE CASCADE
NOT FOR REPLICATION 
GO
ALTER TABLE [dbo].[account] CHECK CONSTRAINT [FKd4vb66o896tay3yy52oqxr9w0]
GO
ALTER TABLE [dbo].[carts]  WITH NOCHECK ADD  CONSTRAINT [FK7ltuqgyyak6nuuddwlsy93uje] FOREIGN KEY([customer_id])
REFERENCES [dbo].[customer] ([id])
ON UPDATE CASCADE
NOT FOR REPLICATION 
GO
ALTER TABLE [dbo].[carts] CHECK CONSTRAINT [FK7ltuqgyyak6nuuddwlsy93uje]
GO
ALTER TABLE [dbo].[carts]  WITH NOCHECK ADD  CONSTRAINT [FKgw1wbtjn7nxji1iwbnuhemct1] FOREIGN KEY([product_id])
REFERENCES [dbo].[product] ([id])
ON UPDATE CASCADE
NOT FOR REPLICATION 
GO
ALTER TABLE [dbo].[carts] CHECK CONSTRAINT [FKgw1wbtjn7nxji1iwbnuhemct1]
GO
ALTER TABLE [dbo].[customer]  WITH NOCHECK ADD  CONSTRAINT [FKmb9ba8vea64u5q2h6w0cmlg5y] FOREIGN KEY([email])
REFERENCES [dbo].[account] ([email])
ON UPDATE CASCADE
NOT FOR REPLICATION 
GO
ALTER TABLE [dbo].[customer] CHECK CONSTRAINT [FKmb9ba8vea64u5q2h6w0cmlg5y]
GO
ALTER TABLE [dbo].[image_product]  WITH NOCHECK ADD  CONSTRAINT [FKml4177k7ufupebm7e4wgmvpnj] FOREIGN KEY([product_id])
REFERENCES [dbo].[product] ([id])
ON UPDATE CASCADE
NOT FOR REPLICATION 
GO
ALTER TABLE [dbo].[image_product] CHECK CONSTRAINT [FKml4177k7ufupebm7e4wgmvpnj]
GO
ALTER TABLE [dbo].[invoice]  WITH NOCHECK ADD  CONSTRAINT [FKrasck35q7fyoddc70x5lj0uqn] FOREIGN KEY([the_order_id])
REFERENCES [dbo].[the_order] ([id])
ON UPDATE CASCADE
NOT FOR REPLICATION 
GO
ALTER TABLE [dbo].[invoice] CHECK CONSTRAINT [FKrasck35q7fyoddc70x5lj0uqn]
GO
ALTER TABLE [dbo].[invoice]  WITH NOCHECK ADD  CONSTRAINT [FKs1ik5vng7bbm4ql0fa722blbi] FOREIGN KEY([staff_id])
REFERENCES [dbo].[staff] ([id])
ON UPDATE CASCADE
NOT FOR REPLICATION 
GO
ALTER TABLE [dbo].[invoice] CHECK CONSTRAINT [FKs1ik5vng7bbm4ql0fa722blbi]
GO
ALTER TABLE [dbo].[poster]  WITH NOCHECK ADD  CONSTRAINT [FKo7fa1v2n99emj5xhmfbc4rxag] FOREIGN KEY([staff_id])
REFERENCES [dbo].[staff] ([id])
ON UPDATE CASCADE
NOT FOR REPLICATION 
GO
ALTER TABLE [dbo].[poster] CHECK CONSTRAINT [FKo7fa1v2n99emj5xhmfbc4rxag]
GO
ALTER TABLE [dbo].[price_history]  WITH NOCHECK ADD  CONSTRAINT [FK1j41eyat2ep3wc0cgpgiwhxah] FOREIGN KEY([staff_id])
REFERENCES [dbo].[staff] ([id])
ON UPDATE CASCADE
NOT FOR REPLICATION 
GO
ALTER TABLE [dbo].[price_history] CHECK CONSTRAINT [FK1j41eyat2ep3wc0cgpgiwhxah]
GO
ALTER TABLE [dbo].[price_history]  WITH NOCHECK ADD  CONSTRAINT [FKccenwj0wsvy3enpt5ov384f3g] FOREIGN KEY([product_id])
REFERENCES [dbo].[product] ([id])
ON UPDATE CASCADE
NOT FOR REPLICATION 
GO
ALTER TABLE [dbo].[price_history] CHECK CONSTRAINT [FKccenwj0wsvy3enpt5ov384f3g]
GO
ALTER TABLE [dbo].[product]  WITH NOCHECK ADD  CONSTRAINT [FK1mtsbur82frn64de7balymq9s] FOREIGN KEY([category_id])
REFERENCES [dbo].[category] ([id])
ON UPDATE CASCADE
NOT FOR REPLICATION 
GO
ALTER TABLE [dbo].[product] CHECK CONSTRAINT [FK1mtsbur82frn64de7balymq9s]
GO
ALTER TABLE [dbo].[product]  WITH CHECK ADD  CONSTRAINT [FKqqqjqng1aci9yy6q3a42i28tj] FOREIGN KEY([supply_id])
REFERENCES [dbo].[supplier] ([id])
GO
ALTER TABLE [dbo].[product] CHECK CONSTRAINT [FKqqqjqng1aci9yy6q3a42i28tj]
GO
ALTER TABLE [dbo].[product]  WITH NOCHECK ADD  CONSTRAINT [FKs6cydsualtsrprvlf2bb3lcam] FOREIGN KEY([brand_id])
REFERENCES [dbo].[brand] ([id])
ON UPDATE CASCADE
NOT FOR REPLICATION 
GO
ALTER TABLE [dbo].[product] CHECK CONSTRAINT [FKs6cydsualtsrprvlf2bb3lcam]
GO
ALTER TABLE [dbo].[promotion]  WITH NOCHECK ADD  CONSTRAINT [FK21of89p7bx0tdg2qskfkdf1ln] FOREIGN KEY([staff_id])
REFERENCES [dbo].[staff] ([id])
ON UPDATE CASCADE
NOT FOR REPLICATION 
GO
ALTER TABLE [dbo].[promotion] CHECK CONSTRAINT [FK21of89p7bx0tdg2qskfkdf1ln]
GO
ALTER TABLE [dbo].[promotion_detail]  WITH NOCHECK ADD  CONSTRAINT [FKb6d4qiw3g81ygrgyj4vw4o9si] FOREIGN KEY([product_id])
REFERENCES [dbo].[product] ([id])
ON UPDATE CASCADE
NOT FOR REPLICATION 
GO
ALTER TABLE [dbo].[promotion_detail] CHECK CONSTRAINT [FKb6d4qiw3g81ygrgyj4vw4o9si]
GO
ALTER TABLE [dbo].[promotion_detail]  WITH NOCHECK ADD  CONSTRAINT [FKskn4hq1smglwge63h73j761ox] FOREIGN KEY([promotion_id])
REFERENCES [dbo].[promotion] ([id])
ON UPDATE CASCADE
NOT FOR REPLICATION 
GO
ALTER TABLE [dbo].[promotion_detail] CHECK CONSTRAINT [FKskn4hq1smglwge63h73j761ox]
GO
ALTER TABLE [dbo].[purchase_order]  WITH NOCHECK ADD  CONSTRAINT [FK23upy3r934qc2vha9ydkko40d] FOREIGN KEY([staff_id])
REFERENCES [dbo].[staff] ([id])
ON UPDATE CASCADE
NOT FOR REPLICATION 
GO
ALTER TABLE [dbo].[purchase_order] CHECK CONSTRAINT [FK23upy3r934qc2vha9ydkko40d]
GO
ALTER TABLE [dbo].[purchase_order]  WITH NOCHECK ADD  CONSTRAINT [FK4traogu3jriq9u7e8rvm86k7i] FOREIGN KEY([supplier_id])
REFERENCES [dbo].[supplier] ([id])
ON UPDATE CASCADE
NOT FOR REPLICATION 
GO
ALTER TABLE [dbo].[purchase_order] CHECK CONSTRAINT [FK4traogu3jriq9u7e8rvm86k7i]
GO
ALTER TABLE [dbo].[purchase_order_detail]  WITH NOCHECK ADD  CONSTRAINT [FKcpv7slf2i15y8e9utfwd7e1vk] FOREIGN KEY([product_id])
REFERENCES [dbo].[product] ([id])
ON UPDATE CASCADE
NOT FOR REPLICATION 
GO
ALTER TABLE [dbo].[purchase_order_detail] CHECK CONSTRAINT [FKcpv7slf2i15y8e9utfwd7e1vk]
GO
ALTER TABLE [dbo].[purchase_order_detail]  WITH NOCHECK ADD  CONSTRAINT [FKi6xlnsg9o9ght6xcwl51ooa4k] FOREIGN KEY([purchase_order_id])
REFERENCES [dbo].[purchase_order] ([id])
ON UPDATE CASCADE
NOT FOR REPLICATION 
GO
ALTER TABLE [dbo].[purchase_order_detail] CHECK CONSTRAINT [FKi6xlnsg9o9ght6xcwl51ooa4k]
GO
ALTER TABLE [dbo].[receipt]  WITH NOCHECK ADD  CONSTRAINT [FKd3m9vjhrr13nbb4ycw6o2u3lx] FOREIGN KEY([staff_id])
REFERENCES [dbo].[staff] ([id])
ON UPDATE CASCADE
NOT FOR REPLICATION 
GO
ALTER TABLE [dbo].[receipt] CHECK CONSTRAINT [FKd3m9vjhrr13nbb4ycw6o2u3lx]
GO
ALTER TABLE [dbo].[receipt]  WITH CHECK ADD  CONSTRAINT [FKjxmk0bjvgwm3iux64qgl4w7vp] FOREIGN KEY([purchase_order_id])
REFERENCES [dbo].[purchase_order] ([id])
GO
ALTER TABLE [dbo].[receipt] CHECK CONSTRAINT [FKjxmk0bjvgwm3iux64qgl4w7vp]
GO
ALTER TABLE [dbo].[receipt_detail]  WITH NOCHECK ADD  CONSTRAINT [FK4qgqei3yfmquqnhwutybgv0dj] FOREIGN KEY([receipt_id])
REFERENCES [dbo].[receipt] ([id])
ON UPDATE CASCADE
NOT FOR REPLICATION 
GO
ALTER TABLE [dbo].[receipt_detail] CHECK CONSTRAINT [FK4qgqei3yfmquqnhwutybgv0dj]
GO
ALTER TABLE [dbo].[receipt_detail]  WITH NOCHECK ADD  CONSTRAINT [FK7uqsukcpefvj4yildhm3sbnw8] FOREIGN KEY([product_id])
REFERENCES [dbo].[product] ([id])
ON UPDATE CASCADE
NOT FOR REPLICATION 
GO
ALTER TABLE [dbo].[receipt_detail] CHECK CONSTRAINT [FK7uqsukcpefvj4yildhm3sbnw8]
GO
ALTER TABLE [dbo].[return_product]  WITH NOCHECK ADD  CONSTRAINT [FK7gki4vkfybib4cv5a3hdp8onq] FOREIGN KEY([staff_id])
REFERENCES [dbo].[staff] ([id])
ON UPDATE CASCADE
NOT FOR REPLICATION 
GO
ALTER TABLE [dbo].[return_product] CHECK CONSTRAINT [FK7gki4vkfybib4cv5a3hdp8onq]
GO
ALTER TABLE [dbo].[return_product]  WITH CHECK ADD  CONSTRAINT [FKgc7pbiqgeywpnprs8s6c1l6dr] FOREIGN KEY([invoice_id])
REFERENCES [dbo].[invoice] ([id])
GO
ALTER TABLE [dbo].[return_product] CHECK CONSTRAINT [FKgc7pbiqgeywpnprs8s6c1l6dr]
GO
ALTER TABLE [dbo].[review]  WITH NOCHECK ADD  CONSTRAINT [FKgce54o0p6uugoc2tev4awewly] FOREIGN KEY([customer_id])
REFERENCES [dbo].[customer] ([id])
ON UPDATE CASCADE
NOT FOR REPLICATION 
GO
ALTER TABLE [dbo].[review] CHECK CONSTRAINT [FKgce54o0p6uugoc2tev4awewly]
GO
ALTER TABLE [dbo].[review]  WITH NOCHECK ADD  CONSTRAINT [FKiyof1sindb9qiqr9o8npj8klt] FOREIGN KEY([product_id])
REFERENCES [dbo].[product] ([id])
ON UPDATE CASCADE
NOT FOR REPLICATION 
GO
ALTER TABLE [dbo].[review] CHECK CONSTRAINT [FKiyof1sindb9qiqr9o8npj8klt]
GO
ALTER TABLE [dbo].[staff]  WITH NOCHECK ADD  CONSTRAINT [FK8yxxnci0oqmyi8cw2btid5sk0] FOREIGN KEY([email])
REFERENCES [dbo].[account] ([email])
ON UPDATE CASCADE
NOT FOR REPLICATION 
GO
ALTER TABLE [dbo].[staff] CHECK CONSTRAINT [FK8yxxnci0oqmyi8cw2btid5sk0]
GO
ALTER TABLE [dbo].[the_order]  WITH CHECK ADD  CONSTRAINT [FK7ad8xwylef2mlsiffhafjkcgx] FOREIGN KEY([staff_approve_id])
REFERENCES [dbo].[staff] ([id])
GO
ALTER TABLE [dbo].[the_order] CHECK CONSTRAINT [FK7ad8xwylef2mlsiffhafjkcgx]
GO
ALTER TABLE [dbo].[the_order]  WITH CHECK ADD  CONSTRAINT [FKgpkwk8cjw3l1xm0h2cab4ngi6] FOREIGN KEY([staff_deliver_id])
REFERENCES [dbo].[staff] ([id])
GO
ALTER TABLE [dbo].[the_order] CHECK CONSTRAINT [FKgpkwk8cjw3l1xm0h2cab4ngi6]
GO
ALTER TABLE [dbo].[the_order]  WITH CHECK ADD  CONSTRAINT [FKkhigb6l4ynafqo9iosal9sqb3] FOREIGN KEY([customer_id])
REFERENCES [dbo].[customer] ([id])
GO
ALTER TABLE [dbo].[the_order] CHECK CONSTRAINT [FKkhigb6l4ynafqo9iosal9sqb3]
GO
ALTER TABLE [dbo].[the_order]  WITH NOCHECK ADD  CONSTRAINT [FKnbwo9ga0dt0uw5hj20hr9fnvc] FOREIGN KEY([status_id])
REFERENCES [dbo].[the_order_status] ([id])
ON UPDATE CASCADE
NOT FOR REPLICATION 
GO
ALTER TABLE [dbo].[the_order] CHECK CONSTRAINT [FKnbwo9ga0dt0uw5hj20hr9fnvc]
GO
ALTER TABLE [dbo].[the_order_detail]  WITH NOCHECK ADD  CONSTRAINT [FK928aoyw2h2u4bsgoc9ywkgxx4] FOREIGN KEY([order_id])
REFERENCES [dbo].[the_order] ([id])
ON UPDATE CASCADE
NOT FOR REPLICATION 
GO
ALTER TABLE [dbo].[the_order_detail] CHECK CONSTRAINT [FK928aoyw2h2u4bsgoc9ywkgxx4]
GO
ALTER TABLE [dbo].[the_order_detail]  WITH NOCHECK ADD  CONSTRAINT [FKccb72b09i97efk19ge4dg1ma7] FOREIGN KEY([product_id])
REFERENCES [dbo].[product] ([id])
ON UPDATE CASCADE
NOT FOR REPLICATION 
GO
ALTER TABLE [dbo].[the_order_detail] CHECK CONSTRAINT [FKccb72b09i97efk19ge4dg1ma7]
GO
ALTER TABLE [dbo].[the_order_detail]  WITH NOCHECK ADD  CONSTRAINT [FKref3ytdp5bk0wr7u7ipy0hmkr] FOREIGN KEY([return_id])
REFERENCES [dbo].[return_product] ([id])
ON UPDATE CASCADE
NOT FOR REPLICATION 
GO
ALTER TABLE [dbo].[the_order_detail] CHECK CONSTRAINT [FKref3ytdp5bk0wr7u7ipy0hmkr]
GO
ALTER TABLE [dbo].[carts]  WITH CHECK ADD  CONSTRAINT [CK_QUANTITY] CHECK  (([quantity]>(0)))
GO
ALTER TABLE [dbo].[carts] CHECK CONSTRAINT [CK_QUANTITY]
GO
ALTER TABLE [dbo].[customer]  WITH CHECK ADD  CONSTRAINT [CK_gender] CHECK  (([gender]=N'khác' OR [gender]=N'nữ' OR [gender]=N'nam'))
GO
ALTER TABLE [dbo].[customer] CHECK CONSTRAINT [CK_gender]
GO
ALTER TABLE [dbo].[price_history]  WITH CHECK ADD  CONSTRAINT [CK_price_history_apply_greater_create] CHECK  (([apply_at]>=[created_at]))
GO
ALTER TABLE [dbo].[price_history] CHECK CONSTRAINT [CK_price_history_apply_greater_create]
GO
ALTER TABLE [dbo].[price_history]  WITH CHECK ADD  CONSTRAINT [CK_price_history_price] CHECK  (([price]>=(0)))
GO
ALTER TABLE [dbo].[price_history] CHECK CONSTRAINT [CK_price_history_price]
GO
ALTER TABLE [dbo].[product]  WITH CHECK ADD  CONSTRAINT [CK_product_in_stock] CHECK  (([in_stock]>=(0)))
GO
ALTER TABLE [dbo].[product] CHECK CONSTRAINT [CK_product_in_stock]
GO
ALTER TABLE [dbo].[promotion]  WITH CHECK ADD  CONSTRAINT [CK_promotion_end_greater_start] CHECK  (([end_at]>=[start_at]))
GO
ALTER TABLE [dbo].[promotion] CHECK CONSTRAINT [CK_promotion_end_greater_start]
GO
ALTER TABLE [dbo].[promotion]  WITH CHECK ADD  CONSTRAINT [CK_promotion_start] CHECK  (([start_at]>=getdate()))
GO
ALTER TABLE [dbo].[promotion] CHECK CONSTRAINT [CK_promotion_start]
GO
ALTER TABLE [dbo].[promotion_detail]  WITH CHECK ADD  CONSTRAINT [CK_promotion_detail_percentage_max] CHECK  (([percentage]<=(100)))
GO
ALTER TABLE [dbo].[promotion_detail] CHECK CONSTRAINT [CK_promotion_detail_percentage_max]
GO
ALTER TABLE [dbo].[promotion_detail]  WITH CHECK ADD  CONSTRAINT [CK_promotion_detail_percentage_min] CHECK  (([percentage]>(0)))
GO
ALTER TABLE [dbo].[promotion_detail] CHECK CONSTRAINT [CK_promotion_detail_percentage_min]
GO
ALTER TABLE [dbo].[purchase_order_detail]  WITH CHECK ADD  CONSTRAINT [CK_purchase_order_detail_quantity] CHECK  (([quantity]>(0)))
GO
ALTER TABLE [dbo].[purchase_order_detail] CHECK CONSTRAINT [CK_purchase_order_detail_quantity]
GO
ALTER TABLE [dbo].[purchase_order_detail]  WITH CHECK ADD  CONSTRAINT [CK_purchase_order_detail_unit_price] CHECK  (([unit_price]>=(0)))
GO
ALTER TABLE [dbo].[purchase_order_detail] CHECK CONSTRAINT [CK_purchase_order_detail_unit_price]
GO
ALTER TABLE [dbo].[receipt_detail]  WITH CHECK ADD  CONSTRAINT [CK_receipt_detail_quantity] CHECK  (([quantity]>(0)))
GO
ALTER TABLE [dbo].[receipt_detail] CHECK CONSTRAINT [CK_receipt_detail_quantity]
GO
ALTER TABLE [dbo].[receipt_detail]  WITH CHECK ADD  CONSTRAINT [CK_receipt_detail_unit_price] CHECK  (([unit_price]>=(0)))
GO
ALTER TABLE [dbo].[receipt_detail] CHECK CONSTRAINT [CK_receipt_detail_unit_price]
GO
ALTER TABLE [dbo].[review]  WITH CHECK ADD  CONSTRAINT [CK_review_vote_max] CHECK  (([vote]<=(5)))
GO
ALTER TABLE [dbo].[review] CHECK CONSTRAINT [CK_review_vote_max]
GO
ALTER TABLE [dbo].[review]  WITH CHECK ADD  CONSTRAINT [CK_review_vote_min] CHECK  (([vote]>=(0)))
GO
ALTER TABLE [dbo].[review] CHECK CONSTRAINT [CK_review_vote_min]
GO
ALTER TABLE [dbo].[staff]  WITH CHECK ADD  CONSTRAINT [CK_staff_gender] CHECK  (([gender]=N'khác' OR [gender]=N'nữ' OR [gender]=N'nam'))
GO
ALTER TABLE [dbo].[staff] CHECK CONSTRAINT [CK_staff_gender]
GO
ALTER TABLE [dbo].[the_order_detail]  WITH CHECK ADD  CONSTRAINT [CK_the_order_detail_quantity] CHECK  (([quantity]>(0)))
GO
ALTER TABLE [dbo].[the_order_detail] CHECK CONSTRAINT [CK_the_order_detail_quantity]
GO
ALTER TABLE [dbo].[the_order_detail]  WITH CHECK ADD  CONSTRAINT [CK_the_order_detail_quantity_return_max] CHECK  (([quantity_return]<=[quantity]))
GO
ALTER TABLE [dbo].[the_order_detail] CHECK CONSTRAINT [CK_the_order_detail_quantity_return_max]
GO
ALTER TABLE [dbo].[the_order_detail]  WITH CHECK ADD  CONSTRAINT [CK_the_order_detail_quantity_return_min] CHECK  (([quantity_return]>(0)))
GO
ALTER TABLE [dbo].[the_order_detail] CHECK CONSTRAINT [CK_the_order_detail_quantity_return_min]
GO
ALTER TABLE [dbo].[the_order_detail]  WITH CHECK ADD  CONSTRAINT [CK_the_order_detail_unit_price] CHECK  (([unit_price]>=(0)))
GO
ALTER TABLE [dbo].[the_order_detail] CHECK CONSTRAINT [CK_the_order_detail_unit_price]
GO


/****** Object:  StoredProcedure [dbo].[BAO_CAO_DOANH_THU_N_NGAY_GAN_NHAT]    Script Date: 9/30/2023 9:23:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[BAO_CAO_DOANH_THU_N_NGAY_GAN_NHAT] @N INT
AS
BEGIN
    DECLARE @i INT = 0;

    -- Check exist table temp
    IF OBJECT_ID('tempdb..#temp') IS NOT NULL
        DROP TABLE #temp; -- Xóa bảng tạm nếu đã tồn tại
    CREATE TABLE #temp (
        NGAY DATE
    )

    -- Add day into table 
    DECLARE @today DATE = DATEADD(DAY, 1,GETDATE())
    WHILE @i < @N
        BEGIN
            SET @today = DATEADD(DAY, -1, @today);

            INSERT INTO #temp (NGAY) VALUES(@today);
            SET @i = @i + 1;
        END
    
    SELECT temp.NGAY, ISNULL(SUM([dbo].[FUNC_TINH_GIA_TRI_DON_HANG](DH.id)), 0)
    FROM #temp temp 
    LEFT JOIN (SELECT * FROM the_order WHERE  
                    status_id NOT IN (
                        SELECT id
                        FROM the_order_status
                        WHERE name LIKE N'%huỷ%' OR name LIKE N'%chờ thanh toán%'
                    )
    ) AS DH
    ON  DATEDIFF(DAY, temp.NGAY, DH.created_at) = 0
    GROUP BY temp.NGAY   


    DROP TABLE #temp;
END
GO
/****** Object:  StoredProcedure [dbo].[BAO_CAO_DOANH_THU_THEO_KHOANG]    Script Date: 9/30/2023 9:23:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[BAO_CAO_DOANH_THU_THEO_KHOANG] @fromDate DATE, @toDate DATE
AS
BEGIN
    -- Check if the temp table exists and drop it if it does
    IF OBJECT_ID('tempdb..#temp') IS NOT NULL
        DROP TABLE #temp;

    CREATE TABLE #temp (
        Thang DATE
    );
    
    DECLARE @begin DATE = @fromDate;

    WHILE DATEDIFF(MONTH, @begin, @toDate) >= 0 
    BEGIN
        INSERT INTO #temp (Thang)
        VALUES (@begin);

        SET @begin = DATEADD(MONTH, 1, @begin);
    END;
    
    SELECT temp.Thang, ISNULL(SUM([dbo].[FUNC_TINH_GIA_TRI_DON_HANG](DH.id)), 0)
    FROM #temp temp 
    LEFT JOIN (SELECT * FROM the_order WHERE  
                    (created_at BETWEEN @fromDate AND @toDate)
                    AND status_id NOT IN (
                        SELECT id
                        FROM the_order_status
                        WHERE name LIKE N'%huỷ%' OR name LIKE N'%chờ thanh toán%'
                    )
    ) AS DH
    ON MONTH(temp.Thang) = MONTH(DH.created_at) AND YEAR(temp.Thang) = YEAR(DH.created_at)
    GROUP BY temp.Thang                

    DROP TABLE #temp;
END
GO
/****** Object:  StoredProcedure [dbo].[BAO_CAO_DOANH_THU_THEO_NAM]    Script Date: 9/30/2023 9:23:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[BAO_CAO_DOANH_THU_THEO_NAM] @Year INT
AS
BEGIN
    -- Check if the temp table exists and drop it if it does
    IF OBJECT_ID('tempdb..#temp') IS NOT NULL
        DROP TABLE #temp;

    CREATE TABLE #temp (
        Thang INT
    );

    DECLARE @month INT = 1;
    WHILE @month <= 12
    BEGIN
        INSERT INTO #temp (Thang)
        VALUES (@month);

        SET @month = @month + 1;
    END;

    SELECT temp.Thang, ISNULL(SUM([dbo].[FUNC_TINH_GIA_TRI_DON_HANG](DH.id)), 0)
    FROM #temp temp 
    LEFT JOIN (SELECT * FROM the_order WHERE  
                    (created_at BETWEEN  DATEFROMPARTS(@Year, 1, 1) 
                                AND DATEFROMPARTS(@Year, 12, 31))
                    AND status_id NOT IN (
                        SELECT id
                        FROM the_order_status
                        WHERE name LIKE N'%huỷ%' OR name LIKE N'%chờ thanh toán%'
                    )
    ) AS DH
    ON temp.Thang = MONTH(DH.created_at)
    GROUP BY temp.Thang  

    DROP TABLE #temp;
END
GO
/****** Object:  StoredProcedure [dbo].[LAY_SP_BAN_CHAY]    Script Date: 9/30/2023 9:23:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[LAY_SP_BAN_CHAY] @top INT = null
AS
BEGIN
    IF(@top IS NULL) 
    SET @top = (SELECT COUNT(*) FROM [dbo].[product]);
    
    WITH List_Best_Sell AS (
    SELECT TOP (@top) CTDH.product_id as product_id, SUM(CTDH.quantity - ISNULL(CTDH.quantity_return, 0)) AS sold_quantity
     FROM (
        SELECT id FROM dbo.the_order WHERE status_id NOT IN (
                                SELECT id FROM dbo.the_order_status WHERE name LIKE N'%huỷ%'
                                OR name LIKE N'%chờ thanh toán%'
                            )
        ) AS DH 
        INNER JOIN (
            SELECT order_id, product_id, quantity, quantity_return FROM dbo.the_order_detail
            ) AS CTDH 
        
        ON DH.id = CTDH.order_id
        GROUP BY CTDH.product_id
    )
   
    SELECT SP.*, BestSell.sold_quantity FROM
    (SELECT * FROM [dbo].[product] WHERE is_active = 1) SP
    JOIN List_Best_Sell AS BestSell ON SP.id = BestSell.product_id
    ORDER BY BestSell.sold_quantity DESC;
END
GO
/****** Object:  StoredProcedure [dbo].[LAY_SP_KHUYEN_MAI]    Script Date: 9/30/2023 9:23:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[LAY_SP_KHUYEN_MAI] @top INT = null
AS
BEGIN
    IF(@top IS NULL) 
    SET @top = (SELECT COUNT(*) FROM [dbo].[product])

    SELECT TOP(@top) SP.*, CTKM.[percentage]
    FROM 
        (SELECT id, start_at, end_at FROM [dbo].[promotion] WHERE GETDATE() BETWEEN start_at AND end_at) as KM
        INNER JOIN 
        (SELECT promotion_id, product_id, percentage FROM dbo.promotion_detail) AS CTKM 
        ON CTKM.promotion_id = KM.id
        INNER JOIN (SELECT * FROM dbo.product WHERE is_active = 1) SP 
        ON SP.id = CTKM.product_id
        ORDER BY CTKM.percentage DESC
    
END

GO
USE [master]
GO
ALTER DATABASE [office_supplies] SET  READ_WRITE 
