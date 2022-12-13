let doc_id = $('body').attr('id')
load_data = () => {
  switch (doc_id) {
    case 'product-data':
      loadProduct();
      break;
  }
}

load_data()

deleteRecord = (id) => {
  let doc_id = $('body').attr('id')
  let table
  switch (doc_id) {
    case 'product-data':
      table = 'products'
      break;
  }
  let sql = `delete from ${table} where id = ${id}`
  db.run(sql, err => {
    if (err) {
      console.log(err)
    } else {
      load_data()
    }
  })
}

deleteAllRecords = () => {
  let doc_id = $('body').attr('id')
  let table
  switch (doc_id) {
    case 'product-data':
      table = 'products'
      break;
  }
  let sql = `delete from ${table}`
  db.run(sql, err => {
    if (err) {
      console.log(err)
    } else {
      load_data()
    }
  })
}

deleteMultipleRecords = (ids) => {
  let doc_id = $('body').attr('id')
  let table
  switch (doc_id) {
    case 'product-data':
      table = 'products'
      break;
  }
  let sql = `delete from ${table} where id IN(${ids})`
  db.run(sql, err => {
    if (err) {
      console.log(err)
    } else {
      load_data()
    }
  })
}

// checkbox checked
$('tbody#data').on('click', 'tr', function () {
  let data_id = $(this).attr('data-id')
  let checkBox = $('input[type="checkbox"]#' + data_id)
  checkBox.prop('checked', !checkBox.prop("checked"))
  $(this).toggleClass('blocked')
})

editRecord = (id) => {
  let doc_id = $('body').attr('id')
  switch (doc_id) {
    case 'product-data':
      editPrdData(id)
      break;
  }
}

alertSuccess = (msg) => {
  let div = `<div class="alert alert-success">${msg}</div>`
  $('#alert').html(div)
  clearAlert = () => {
    $('#alert').html("")
  }
  setTimeout(clearAlert, 4000)
}