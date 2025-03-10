import { createApp } from 'vue'
import { TabulatorFull as Tabulator } from 'tabulator-tables' //import Tabulator library
import ActionButton from '@/components/ActionButton.vue'
import SelectColumn from '@/components/SelectColumn.vue'

export let tableInstance

export const initTable = (
  { element, headers, data, options } = {
    element: null,
    headers: [],
    data: [],
    options: {}
  }
) => {
  // const mainRoute = store.mainRoute
  tableInstance = new Tabulator(element, {
    pagination: false,
    paginationMode: 'remote',
    layout: 'fitDataStretch',
    resizableColumnFit: true,
    // ajaxURL: mainRoute,
    // ajaxParams: { token: 'ABC123' },
    paginationSize: 5,
    paginationInitialPage: 1,
    paginationSizeSelector: [3, 6, 8, 10],
    paginationCounter: 'rows',
    ajaxLoaderLoading:
      "<div style='display:inline-block; border:4px solid #333; border-radius:10px; background:#fff; font-weight:bold; font-size:16px; color:#000; padding:10px 20px;'>Loading Data</div>",
    data,
    columns: makeHeaders(headers),
    ...options
  })

  setTimeout(() => {
    tableInstance.setData()
  })

  return tableInstance
}

export function makeHeaders(headers) {
  const mapHeader = {
    _select_: {
      formatter: selectColumn,
      formatterParams: {
        component: SelectColumn
      }
    },
    _actions_: {
      formatter: actions,
      formatterParams: {
        component: ActionButton
      }
    },
    _index_: {
      formatter: updateRowNumber
    }
  }

  return headers.map((h) => (h.field in mapHeader ? { ...h, ...mapHeader[h.field] } : h))
}

export function updateRowNumber(cell) {
  var pageNumber = tableInstance.getPage()
  var pageSize = tableInstance.getPageSize()
  var index = cell.getRow().getPosition(true) + (pageNumber - 1) * pageSize
  return index
}

export function actions(cell, formatterParams) {
  const data = cell.getRow().getData()
  const index = cell.getRow().getPosition()
  const el = document.createElement('div')
  const Component = formatterParams.component
  const app = createApp(Component, { data, index })
  app.mount(el)
  return el
}

export function selectColumn(cell, formatterParams) {
  const data = cell.getRow().getData()
  const index = cell.getRow().getPosition()
  const el = document.createElement('div')
  const Component = formatterParams.component
  const app = createApp(Component, { data, index })
  app.mount(el)
  return el
}

export function addData(items) {
  tableInstance
    .addData(items, true)
    .then(function (rows) {
      //rows - array of the row components for the rows updated or added
      //run code after data has been updated
    })
    .catch(function (error) {
      //handle error updating data
    })
}

export function setData(items) {
  tableInstance.setData(items)
}

export function editData(item) {
  tableInstance.updateData([item])
}

export function removeData(itemIds) {
  for (let i = 0; i < 10; i++) {
    var row = tableInstance.getRow(i)
  }

  // row.delete()
  // tableInstance.deleteRow(itemIds)
}

export function setColumns(cols) {
  tableInstance.setColumns(cols)
}
