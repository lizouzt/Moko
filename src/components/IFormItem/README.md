## 实例

#### Select异步分页
```javascript
{
  code: "ddd",
  name: "地点",
  widgetType: ModelQueryComp.SELECT,
  required: 1,
  asyncQuery: async (params: any): Promise<SelectOption[]> => {
    const { code, data } = await queryAddressPage(params)

    if (code !== 2000) {
      return []
    } else {
      return (data.records || []).map((item: any) => ({
        value: item.id,
        label: item.name,
      }))
    }
  },
}
```