1. 环境变量说明：

EXTERNAL_API_URL：外部 API 的 URL 地址，用于获取代理 IP 扫描和测试数据。例如，https://external-api.example.com。

PASSWORD：用于身份验证的密码（如 cmliu）。这是你设置的访问令牌的密码。

KV 命名空间 ID：通过 Cloudflare KV 存储扫描结果和有效 IP 地址。

2. KV 命名空间设置

Cloudflare Workers 使用 KV（键值存储）来存储数据。在此项目中，KV 用于存储以下数据：

valid_ips:<region>：存储指定区域的有效 IP 列表。每个区域都有一个对应的列表。

subs_counter：用于生成唯一的订阅 ID。

history:<id>：存储每次扫描的详细结果，例如扫描的区域、类型、数量等信息。

创建 KV 命名空间

在 Cloudflare Dashboard 上创建 KV 命名空间后，你需要将该命名空间的 ID 填入 wrangler.toml 文件中的 [kv_namespaces] 部分。
