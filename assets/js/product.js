let inputPrdPrice = IMask(
  document.getElementById('product_price'),
  {
    mask: 'Rp num',
    blocks: {
      num: {
        mask: Number,
        thousandsSeparator: '.',
        scale: 3,
        radix: ',',
        mapToRadix: ['.'],
        padFractionalZeros: false,
        signed: false
      }
    }
  }
)

let inputPrdCost = IMask(
  document.getElementById('product_cost'),
  {
    mask: 'Rp num',
    blocks: {
      num: {
        mask: Number,
        thousandsSeparator: '.',
        scale: 3,
        radix: ',',
        mapToRadix: ['.'],
        padFractionalZeros: false,
        signed: false
      }
    }
  }
)

let inputPrdInitQty = IMask(
  document.getElementById('product_initial_qty'),
  {
    mask: 'num',
    blocks: {
      num: {
        mask: Number,
        thousandsSeparator: '.',
        padFractionalZeros: false,
        signed: false
      }
    }
  }
)

function loadProduct() {
  let query = `select * from products`
  db.serialize(() => {
    db.all(query, (err, rows) => {
      if (err) throw err
      let tr = ''
      if (rows.length < 1) {
        tr += ''
      } else {
        rows.forEach((row) => {
          tr += `<tr data-id=${row.id}>
                  <td data-colname="Id">
                    ${row.id}
                    <input type="checkbox" id="${row.id}" class="data-checkbox invisible">
                  </td> 
                  <td>${row.product_name}</td>
                  <td>${row.product_code}</td>
                  <td>${row.barcode}</td>
                  <td>${row.category}</td>
                  <td>${row.unit}</td>
                  <td>${row.selling_price}</td>
                  <td>${row.cost_of_product}</td>
                  <td>${row.product_initial_qty}</td>
                  <td>
                    <button class="btn btn-sm btn-light btn-light-bordered" onclick="editRecord(${row.id})" id="edit-data"><i class="fa fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="deleteAction(${row.id}, '${row.product_name}')" id="delete-data"><i class="fa fa-trash"></i></button>
                  </td>
                </tr>`
        })
      }
      $('tbody#data').html(tr)
    })
  })
}

blankForm = () => {
  $('#product_name').val("")
  $('#product_barcode').val("")
  $('#product_price').val("")
  $('#product_cost').val("")
  $('#product_initial_qty').val("")
}

insertProduct = () => {
  let prd_name = $('#product_name').val()
  let prd_barcode = $('#product_barcode').val()
  let prd_category = $('#product_category').val()
  let prd_price = inputPrdPrice.unmaskedValue
  let prd_cost = inputPrdCost.unmaskedValue
  let prd_init_qty = inputPrdInitQty.unmaskedValue
  let prd_unit = $('#product_unit').val()

  let required = $('[required]')
  let required_array = []
  required.each(function () {
    if ($(this).val() != "") {
      required_array.push($(this).val())
    }
  })

  if (required_array.length < 4) {
    dialog.showMessageBox({
      title: 'Alert',
      type: 'info',
      message: 'Nama Produk, Harga Jual, Harga Pokok dan Satuan Harga harus diisi'
    })
  } else if (parseInt(prd_price) < parseInt(prd_cost)) {
    dialog.showMessageBox({
      title: 'Alert',
      type: 'info',
      message: 'Harga Jual lebih kecil dari harga pokok'
    })
  } else {
    db.serialize(() => {
      db.each(`select count(*) as row_number from products where product_name = '${prd_name}'`, (err, res) => {
        if (err) throw err
        if (res.row_number < 1) {
          db.run(`insert into products(product_name, barcode, category, selling_price, cost_of_product, product_initial_qty, unit) values('${prd_name}','${prd_barcode}','${prd_category}','${prd_price}','${prd_cost}','${prd_init_qty}','${prd_unit}')`, err => {
            if (err) throw err
            // generate kode produk otomatis
            db.each(`select id from products where product_name = '${prd_name}'`, (err, row) => {
              if (err) throw err
              db.run(`update products set product_code = 'PR' || substr('000000' || ${row.id}, -6,6) where product_name = '${prd_name}'`, err => {
                if (err) throw err
                blankForm()
                $('#product_name').focus()
                load_data()
              })
            })
          })
        } else {
          dialog.showMessageBox({
            title: 'Alert',
            type: 'info',
            message: 'Nama produk sudah ada di dalam database, silakan gunakan nama produk lain'
          })
        }
      })

    })
  }
}

loadCategoryOptions = () => {
  db.all(`select * from categories order by id desc`, (err, rows) => {
    if (err) throw err
    let option = '<option value="">Kategori</option>'
    rows.map((row) => {
      option += `<option value="${row.category}">${row.category}</option>`
    })
    $('#product_category').html(option)
  })
}

loadUnitOptions = () => {
  db.all(`select * from units order by id desc`, (err, rows) => {
    if (err) throw err
    let option = '<option value="">Satuan</option>'
    rows.map((row) => {
      option += `<option value="${row.unit}">${row.unit}</option>`
    })
    $('#product_unit').html(option)
  })
}

function selectUnitOption(unitOpt, unit) {
  let options = unitOpt.replace(`value="${unit}">`, `value="${unit}" selected>`)
  return options
}

selectCategoryOption = (categoryOpt, category) => {
  let options = categoryOpt.replace(`value="${category}">`, `value="${category}" selected>`)
  return options
}


editPrdData = (id) => {
  let sqlUnit = `select * from units`
  let sqlCategory = `select * from categories`
  let sql = `select * from products where id = ${id}`

  db.all(sqlUnit, (err, result) => {
    if (err) {
      throw err
    } else {
      let unitOption
      let unitOpts = '<option></option>'
      result.forEach(item => {
        unitOpts += `<option value="${item.unit}">${item.unit}</option>`
      })
      unitOption = unitOpts
      db.all(sqlCategory, (err, result) => {
        if (err) {
          throw err
        } else {
          let categoryOption
          let categoryOpts = '<option></option>'
          result.forEach(item => {
            categoryOpts += `<option value="${item.category}">${item.category}</option>`
          })

          categoryOption = categoryOpts
          db.all(sql, (err, result) => {
            if (err) {
              throw err
            } else {
              let row = result[0]
              let editForm
              editForm = `
                          <div class="mb-3">
                            <input type="text" value="${row.product_name}" id="editPrdName" placeholder="Nama Produk" class="form-control form-control-sm">
                            <input type="hidden" value="${row.product_name}" id="prevPrdName">
                            <input type="hidden" value="${id}" id="rowId">
                          </div>
                          
                          <div class="mb-3">
                            <input type="text" value="${row.barcode}" id="editPrdBarcode" placeholder="Barcode" class="form-control form-control-sm">
                            <input type="hidden" value="${row.barcode}" id="prevPrdBarcode">
                            <input type="hidden" value="${id}" id="rowId">
                          </div>
                          
                          <div class="mb-3">
                            <select id="editPrdCategory" class="form-select form-select-sm">
                              ${selectCategoryOption(categoryOption, row.category)}
                            </select>
                          </div>
                          
                          <div class="mb-3">
                            <select id="editPrdUnit" class="form-select form-select-sm">
                              ${selectUnitOption(unitOption, row.unit)}
                            </select>
                          </div>
                          
                          <div class="mb-3">
                            <input type="text" value="${row.selling_price}" id="editPrdPrice" placeholder="Harga Jual" class="form-control form-control-sm">
                          </div>                         
                          
                          <div class="mb-3">
                            <input type="text" value="${row.cost_of_product}" id="editPrdCost" placeholder="Harga Pokok" class="form-control form-control-sm">
                          </div>
                          
                          <div class="mb-3">
                            <input type="text" value="${row.product_initial_qty}" id="editPrdInitQty" placeholder="Stock Awal" class="form-control form-control-sm">
                          </div>
                          
                          <div class="d-grid gap-2">
                            <button class="btn btn-sm btn-primary btn-block" onclick="submitEditPrdData(${id})"><i class="fa fa-paper-plane"></i> Submit</button>
                          </div>
                          `
              ipcRenderer.send('load:edit', 'product-data', editForm, 300, 450, id)
            }
          })
        }
      })
    }
  })
}

ipcRenderer.on('update:success', (e, msg) => {
  alertSuccess(msg)
  load_data()
})