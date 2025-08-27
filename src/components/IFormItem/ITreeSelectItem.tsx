import React, { useMemo } from 'react'
import { TreeSelect, Tree } from 'tdesign-react'
import DtoHOC, { IDtoMap } from 'components/DtoHOC'
import { IFormItemWrap } from './FormItemMap'
import { ModelQueryComp, IOption } from 'types/index.d'
import { ItemConfig } from './types'

const mapToTree = (node: any): IOption => {
  const item: IOption = {
    label: node.name,
    value: node.id,
  }

  if (node.childList) {
    item.children = node.childList.map(mapToTree)
  }

  return item
}

const ITreeSelect = (props: React.PropsWithChildren<{ item: ItemConfig; loading?: boolean; isEdit: boolean }>) =>
  props.item.widgetType === ModelQueryComp.TREESELECT ? (
    <IFormItemWrap {...props}>
      <TreeSelect
        clearable
        filterable
        expandAll
        loading={props.loading}
        placeholder={props.item.placeholder}
        style={{ width: 300 }}
        popupProps={{ overlayInnerStyle: { maxHeight: '260px', overflowY: 'auto' } }}
        data={props.item.orgProps?.options || []}
        disabled={props.isEdit && props.item.canUpdate === 0}
        {...(props.item.orgProps || {})}
      />
      {props.children}
    </IFormItemWrap>
  ) : (
    <IFormItemWrap {...props}>
      <Tree
        hover
        checkable
        expandLevel={0}
        expandMutex
        data={props.item.orgProps?.options || []}
        {...(props.item.orgProps || {})}
      />
      {props.children}
    </IFormItemWrap>
  )

const DtoITreeSelectWrap = (props: { item: ItemConfig; isEdit: boolean; dtoMap?: IDtoMap }) => {
  const { item, dtoMap = {}, isEdit, ...others } = props

  const [wrapItem, loading] = useMemo(() => {
    const { options, loading } = dtoMap[item.dictKey || '']

    return [{ ...item, orgProps: { ...item.orgProps, options } }, loading]
  }, [dtoMap])

  return <ITreeSelect {...others} isEdit={isEdit} item={wrapItem} loading={loading} />
}

const ITreeSelectItem = (props: { item: ItemConfig; isEdit: boolean }) => {
  const { item } = props

  if (item.dictKey) {
    return (
      <DtoHOC mapper={{ [item.dictKey]: mapToTree }} extraMap={{ [item.dictKey]: { tree: true } }}>
        <DtoITreeSelectWrap {...props} />
      </DtoHOC>
    )
  }
  return <ITreeSelect {...props} />
}

export default ITreeSelectItem
