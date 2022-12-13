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