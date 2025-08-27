## Useage
```
<Info data={info}>
	<div className="flex">
		<InfoItem label='承运计划编号' name='transportNo' alternate/>
		<InfoItem label='物流类型' name='consignType.desc' alternate/>
		<InfoItem label='物料名称' name='materialName' alternate/>
	</div>
	<div className="flex">
		<InfoItem label='承运计划编号' name='transportNo' />
	</div>
	<div className="flex">
		<InfoItem label='承运计划编号' name='transportNo' style={{flexBasis: '33.33%'}} />
		<InfoItem label='物流类型' name='consignType.desc' style={{flexBasis: '66.67%'}} />
	</div>
</Info>
```

### Alternate
```
<InfoRow flex={[2, 2, 1]}>
  <InfoItem label={'签收备注'} name={'signremark'} alternate/>
  <InfoItem label={'签收备注'} name={'signremark'} alternate/>
  <InfoItem label={'签收备注'} name={'signremark'} alternate/>
</InfoRow>
```

### FlexRow
```
<InfoRow flex={[1]}>
  <InfoItem label='物料' name={['materialCode', 'materialName']}/>
</InfoRow>
<InfoRow flex={[3, 2, 1]}>
  <InfoItem label={'签收备注'} name={'signremark'} />
  <InfoItem label={'签收备注'} name={'signremark'} />
  <InfoItem label={'签收备注'} name={'signremark'} />
  <InfoItem label={'签收备注'} name={'signremark'} />
  <InfoItem label={'签收备注'} name={'signremark'} />
  <InfoItem label={'签收备注'} name={'signremark'} />
</InfoRow>

```

### columnCount
```
<Info className="flex wrap" columnCount={2}>
  <InfoItem label={'签收备注'} name={'signremark'} />
  <InfoItem label={'签收备注'} name={'signremark'} />
  <InfoItem label={'签收备注'} name={'signremark'} />
  <InfoItem label={'签收备注'} name={'signremark'} />
  <InfoItem label={'签收备注'} name={'signremark'} />
  <InfoItem label={'签收备注'} name={'signremark'} />
</Info>
```