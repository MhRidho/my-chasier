openFormAddData = () => {
  $('#form-add-data').addClass('active')
  $('#product_name').focus()
  loadCategoryOptions()
  loadUnitOptions()
}

closeFormAddData = () => {
  $('#form-add-data').removeClass('active')
  $('#product_name').focus()
}

function deleteAction(id = false, data = false) {
  let msg = `Are you sure want to delete ${data} ?`
  //check id ada dalam parameter fungsi
  if (id) {
    let dialogBox = dialog.showMessageBoxSync({
      type: 'question',
      title: 'Delete records',
      buttons: ['No', 'Yes'],
      defaultId: [0, 1],
      message: msg
    })
    if (dialogBox === 0) {
      $('input.data-checkbox').prop("checked", false)
      $('tbody#data tr').removeClass('blocked')
    } else {
      deleteRecord(id)
    }
  } else {
    array_ids = []
    $('input.data-checkbox:checked').each(function () {
      let ids = $(this).attr('id')
      array_ids.push(ids)
    })
    if (array_ids.length < 1) {
      let msgBox = dialog.showMessageBoxSync({
        type: 'question',
        title: 'Delete records',
        buttons: ['No', 'Yes'],
        defaultId: [0, 1],
        message: 'ATTENTION, You didn`t select any record, If no record selected, then this action WILL DELETE ALL RECORDS in the table. Are you sure want to delete all record in this table?'
      })
      if (msgBox === 0) {
        console.log('No')
      } else {
        deleteAllRecords()
      }
    } else {
      let msgBox = dialog.showMessageBoxSync({
        type: 'question',
        title: 'Delete records',
        buttons: ['No', 'Yes'],
        defaultId: [0, 1],
        message: 'Are you sure want to delete the selected records?'
      })
      if (msgBox === 0) {
        console.log('No')
        $('input.data-checkbox').prop("checked", false)
      } else {
        join_array_ids = array_ids.join(",")
        deleteMultipleRecords(join_array_ids)
      }
    }
  }
}

selectAll = () => {
  $('input.data-checkbox').prop("checked", true)
  $('tbody#data tr').addClass('blocked')
}

unSelectAll = () => {
  $('input.data-checkbox').prop("checked", false)
  $('tbody#data tr').removeClass('blocked')
}

// pagination
$('#first-page').click((e) => {
  e.preventDefault()
  let searchVal = $('#search-data').val()
  let total_row_displayed = $('#row_per_page').val()
  $('#page_number').val(1)
  load_data(1, total_row_displayed, searchVal)
})

$('#last-page').click((e) => {
  e.preventDefault()
  let total_page = $('#total_pages').val()
  $('#page_number').val(total_page)
  let searchVal = $('#search-data').val()
  let total_row_displayed = $('#row_per_page').val()
  load_data(total_page, total_row_displayed, searchVal)
})

$('#page_number').keyup(() => {
  let searchVal = $('#search-data').val()
  let page_number = $(this).val()
  let total_row_displayed = $('#row_per_page').val()
  load_data(page_number, total_row_displayed, searchVal)
})

$('#next-page').click((e) => {
  e.preventDefault()
  let searchVal = $('#search-data').val()
  let total_page = $('#total_pages').val()
  let input_val = $('#page_number').val()
  if (input_val == "") {
    input_val = 1
  }
  let page_no = parseInt(input_val)
  let total_row_displayed = $('#row_per_page').val()
  if (page_no < total_page) {
    $('#page_number').val(page_no + 1)
    load_data(page_no + 1, total_row_displayed, searchVal)
  }
})

$('#prev-page').click((e) => {
  e.preventDefault()
  let searchVal = $('#search-data').val()
  let input_val = $('#page_number').val()
  let page_no = parseInt(input_val)
  if (page_no > 1) {
    $('#page_number').val(page_no - 1)
    let total_row_displayed = $('#row_per_page').val()
    load_data(page_no - 1, total_row_displayed, searchVal)
  }
})

$('#row_per_page').change(() => {
  let searchVal = $('#search-data').val()
  let total_row_displayed = $('#row_per_page').val()
  let page_number = $('#page_number').val()
  let total_page = $('#total_pages').val()
  if (page_number > total_page) {
    let page_number = 1
    $('#page_number').val(1)
  }
  load_data(page_number, total_row_displayed, searchVal)
})

search = () => {
  let searchVal = $('#search-data').val()
  let page_number = $('#page_number').val()
  let total_row_displayed = $('#row_per_page').val()
  load_data(page_number, total_row_displayed, searchVal)
}

$('#search-data').keydown((e) => {
  if (e.keyCode === 13) {
    search()
  }
})

$('#search-data').keyup(() => {
  let val = $(this).val()
  let page = $('#page_number').val()
  let row = $('#row_per_page').val()
  if (val === "") {
    load_data(page, row)
  }
})

exportData = (ext) => {
  let array_ids = []
  $('input.data-checkbox:checked').each(() => {
    let ids = $(this).attr('id')
    array_ids.push(ids)
  })

  let filePath = dialog.showSaveDialogSync({
    title: 'Export Data',
    filters: [
      {
        name: ext,
        extensions: [ext]
      }
    ]
  })
  if (filePath != undefined) {
    if (array_ids < 1) {
      executeExport(filePath, ext)
    } else {
      let join_ids = array_ids.join(",")
      executeExport(filePath, ext, join_ids)
    }
  } else {
    console.log("Something went wrong")
  }
}

executeExport = (filePath, ext, joinIds = false) => {
  switch (ext) {
    case 'csv':
      exportCsv(filePath, ext, joinIds);
      break;
    case 'pdf':
      exportPdf(filePath, ext, joinIds);
      break;
  }
}

exportCsv = (filePath, ext, joinIds = false) => {
  let doc_id = $('body').attr('id')
  switch (doc_id) {
    case 'product_data':
      exportCsvPrdData(filePath, ext, joinIds);
      break;
  }
}